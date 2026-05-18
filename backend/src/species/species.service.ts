import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Species } from 'src/seed/entities/species';
import { Repository } from 'typeorm';

@Injectable()
export class SpeciesService {
  private speciesRelations = ["films", "homeworld", "people"]
  constructor(
    @InjectRepository(Species) private readonly speciesRepo: Repository<Species>,
  ) { }

  async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    const newSpecies = this.speciesRepo.create(createSpeciesDto);
    return await this.speciesRepo.save(newSpecies);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Species[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.speciesRepo.findAndCount({
      // relations: this.characterRelations, //so far yes, because it puts the entire server
      loadRelationIds: true,
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
    await this.findOne(id);
    await this.speciesRepo.delete(id);
    return { deleted: true };
  }
}
