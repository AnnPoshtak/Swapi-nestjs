import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Starship } from 'src/seed/entities/starship';
import { StarshipImage } from 'src/seed/entities/starship-image';
import { Repository } from 'typeorm';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class StarshipService {
  private starshipRelations = ['pilots', 'films', 'images'];
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Starship) private readonly starshipRepo: Repository<Starship>,
    @InjectRepository(StarshipImage) private readonly imageRepo: Repository<StarshipImage>,
  ) { }

  private addImagePaths(starship: Starship): Starship {
    if (starship.images && starship.images.length > 0) {
      starship.images = starship.images.map(image => ({
        ...image,
        url: `/images/${image.filename}`
      })) as StarshipImage[];
    }
    return starship;
  }

  async create(createStarshipDto: CreateStarshipDto): Promise<Starship> {
    const newStarship = this.starshipRepo.create(createStarshipDto);
    return await this.starshipRepo.save(newStarship);
  }

  async addImage(starshipId: number, file: Express.Multer.File) {
    const starship = await this.findOne(starshipId);
    const newImage = this.imageRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      starship: starship,
    });

    await this.imageRepo.save(newImage);

    return {
      id: newImage.id,
      filename: newImage.filename,
      url: `/images/${newImage.filename}`
    };
  }

  async removeImage(imageId: number) {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    const filePath = join(this.uploadPath, image.filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`File not found on disk: ${filePath}`);
    }

    await this.imageRepo.delete(imageId);

    return { deleted: true };
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Starship[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.starshipRepo.findAndCount({
      relations: this.starshipRelations,
      relationLoadStrategy: 'query',
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    const transformedData = data.map(starship => this.addImagePaths(starship));
    return { data: transformedData, total };
  }

  async findOne(id: number): Promise<Starship> {
    const starship = await this.starshipRepo.findOne({
      where: { id },
      relations: this.starshipRelations,
    });

    if (!starship) {
      throw new NotFoundException(`Starship with ID ${id} not found`);
    }
    return this.addImagePaths(starship);
  }

  async update(id: number, updateStarshipDto: UpdateStarshipDto): Promise<Starship> {
    const starship = await this.findOne(id);
    const updateStarship = this.starshipRepo.merge(starship, updateStarshipDto);
    return await this.starshipRepo.save(updateStarship);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const starship = await this.findOne(id);
    if (starship.images && starship.images.length > 0) {
      const deletePromises = starship.images.map(async (image) => {
        const filePath = join(this.uploadPath, image.filename);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`File not found: ${filePath}`);
        }
      });
      await Promise.all(deletePromises);
    }

    await this.starshipRepo.delete(id);
    return { deleted: true };
  }
}
