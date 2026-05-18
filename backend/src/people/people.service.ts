import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from 'src/seed/entities/people';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleService {
  private readonly characterRelations = ['homeworld', 'films', 'starships', 'vehicles', 'species'];
  
  constructor(
    @InjectRepository(Character) private readonly characterRepo: Repository<Character>,
  ) { }

  async create(createPersonDto: CreatePersonDto): Promise<Character> {
    const newCharacter = this.characterRepo.create(createPersonDto);
    return await this.characterRepo.save(newCharacter);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Character[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.characterRepo.findAndCount({
      // relations: this.characterRelations, //so far yes, because it puts the entire server
      loadRelationIds: true, 
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.characterRepo.findOne({
      where: { id },
      relations: this.characterRelations,
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    return character;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Character> {
    const character = await this.findOne(id);
    const updatedCharacter = this.characterRepo.merge(character, updatePersonDto);
    return await this.characterRepo.save(updatedCharacter);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.findOne(id);
    await this.characterRepo.delete(id);
    return { deleted: true };
  }
}