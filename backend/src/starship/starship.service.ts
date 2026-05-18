import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Starship } from 'src/seed/entities/starship';
import { Repository } from 'typeorm';

@Injectable()
export class StarshipService {
  private starshipRelations = ['pilots', 'films'];
  constructor(
    @InjectRepository(Starship) private readonly starshipRepo: Repository<Starship>,
  ) { }

  async create(createStarshipDto: CreateStarshipDto): Promise<Starship> {
    const newStarship = this.starshipRepo.create(createStarshipDto);
    return await this.starshipRepo.save(newStarship);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Starship[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.starshipRepo.findAndCount({
      loadRelationIds: true,
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Starship> {
    const starship = await this.starshipRepo.findOne({
      where: { id },
      relations: this.starshipRelations,
    });

    if (!starship) {
      throw new NotFoundException(`Starship with ID ${id} not found`);
    }
    return starship;
  }

  async update(id: number, updateStarshipDto: UpdateStarshipDto): Promise<Starship> {
    const starship = await this.findOne(id);
    const updateStarship = this.starshipRepo.merge(starship, updateStarshipDto);
    return await this.starshipRepo.save(updateStarship);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.findOne(id);
    await this.starshipRepo.delete(id);
    return { deleted: true };
  }
}
