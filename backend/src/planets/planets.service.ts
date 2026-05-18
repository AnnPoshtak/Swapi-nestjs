import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { Planet } from 'src/seed/entities/planets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class PlanetsService {
  private readonly planetRelations = ['films', 'residents'];
  constructor(
    @InjectRepository(Planet) private readonly planetRepo: Repository<Planet>,
  ) { }

  async create(createPlanetDto: CreatePlanetDto): Promise<Planet> {
    const newPlanet = this.planetRepo.create(createPlanetDto);
    return await this.planetRepo.save(newPlanet);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Planet[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.planetRepo.findAndCount({
      // relations: this.PlanetRelations, //so far yes, because it puts the entire server
      loadRelationIds: true,
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Planet> {
    const planet = await this.planetRepo.findOne({
      where: { id },
      relations: this.planetRelations,
    });

    if (!planet) {
      throw new NotFoundException(`Planet with ID ${id} not found`);
    }
    return planet;
  }

  async update(id: number, updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    const planet = await this.findOne(id);
    const updatedPlanet = this.planetRepo.merge(planet, updatePlanetDto);
    return await this.planetRepo.save(updatedPlanet);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.findOne(id);
    await this.planetRepo.delete(id);
    return { deleted: true };
  }
}
