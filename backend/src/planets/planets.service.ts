import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { Planet } from 'src/seed/entities/planets';
import { PlanetImage } from 'src/seed/entities/planet-image'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class PlanetsService {
  private readonly planetRelations = ['films', 'residents', 'images'];
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Planet) private readonly planetRepo: Repository<Planet>,
    @InjectRepository(PlanetImage) private readonly imageRepo: Repository<PlanetImage>,
  ) { }

  private addImagePaths(planet: Planet): Planet {
    if (planet.images && planet.images.length > 0) {
      planet.images = planet.images.map(image => ({
        ...image,
        url: `/images/${image.filename}`
      })) as PlanetImage[];
    }
    return planet;
  }

  async addImage(planetId: number, file: Express.Multer.File) {
    const planet = await this.findOne(planetId);

    const newImage = this.imageRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      planet: planet,
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
      throw new NotFoundException(`with ID ${imageId} not found`);
    }

    const filePath = join(this.uploadPath, image.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.imageRepo.delete(imageId);

    return { deleted: true };
  }

  async create(createPlanetDto: CreatePlanetDto): Promise<Planet> {
    const newPlanet = this.planetRepo.create(createPlanetDto);
    return await this.planetRepo.save(newPlanet);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Planet[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.planetRepo.findAndCount({
      relations: this.planetRelations,
      relationLoadStrategy: 'query',
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    const transformedData = data.map(planet => this.addImagePaths(planet));
    return { data: transformedData, total };
  }

  async findOne(id: number): Promise<Planet> {
    const planet = await this.planetRepo.findOne({
      where: { id },
      relations: this.planetRelations,
    });

    if (!planet) {
      throw new NotFoundException(`Planet with ID ${id} not found`);
    }this.addImagePaths(planet)
    return planet;
  }

  async update(id: number, updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    const planet = await this.findOne(id);
    const updatedPlanet = this.planetRepo.merge(planet, updatePlanetDto);
    return await this.planetRepo.save(updatedPlanet);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const planet = await this.findOne(id);

    if (planet.images && planet.images.length > 0) {
      for (const image of planet.images) {
        const filePath = join(this.uploadPath, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await this.planetRepo.delete(id);
    return { deleted: true };
  }
}