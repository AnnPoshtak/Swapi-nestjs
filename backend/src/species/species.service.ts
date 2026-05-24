import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Species } from 'src/seed/entities/species';
import { SpeciesImage } from 'src/seed/entities/species-image';
import { Repository } from 'typeorm';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class SpeciesService {
  private speciesRelations = ["films", "homeworld", "people", "images"]
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Species) private readonly speciesRepo: Repository<Species>,
    @InjectRepository(SpeciesImage) private readonly imageRepo: Repository<SpeciesImage>,
  ) { }

  async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    const newSpecies = this.speciesRepo.create(createSpeciesDto);
    return await this.speciesRepo.save(newSpecies);
  }

  async addImage(speciesId: number, file: Express.Multer.File) {
    const species = await this.findOne(speciesId);
    const newImage = this.imageRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      species: species,
    });

    await this.imageRepo.save(newImage);

    return {
      id: newImage.id,
      filename: newImage.filename,
      url: `/species/image/${newImage.filename}`
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

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Species[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.speciesRepo.findAndCount({
      relations: this.speciesRelations,
      relationLoadStrategy: 'query',
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Species> {
    const specie = await this.speciesRepo.findOne({
      where: { id },
      relations: this.speciesRelations,
    });

    if (!specie) {
      throw new NotFoundException(`Specie with ID ${id} not found`);
    }
    return specie;
  }

  async update(id: number, updateSpeciesDto: UpdateSpeciesDto): Promise<Species> {
    const species = await this.findOne(id);
    const updateSpecies = this.speciesRepo.merge(species, updateSpeciesDto);
    return await this.speciesRepo.save(updateSpecies);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const species = await this.findOne(id);
    if (species.images && species.images.length > 0) {
      const deletePromises = species.images.map(async (image) => {
        const filePath = join(this.uploadPath, image.filename);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`File not found: ${filePath}`);
        }
      });
      await Promise.all(deletePromises);
    }

    await this.speciesRepo.delete(id);
    return { deleted: true };
  }
}
