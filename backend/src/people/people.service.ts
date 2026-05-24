import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from 'src/seed/entities/people';
import { Repository } from 'typeorm';
import { join } from 'path';
import { PeopleImage } from 'src/seed/entities/people-image';
import { promises as fs } from 'fs';

@Injectable()
export class PeopleService {
  private readonly characterRelations = ['homeworld', 'films', 'starships', 'vehicles', 'species', 'images'];
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Character) private readonly characterRepo: Repository<Character>,
    @InjectRepository(PeopleImage) private readonly imageRepo: Repository<PeopleImage>
  ) { }

  async addImage(personId: number, file: Express.Multer.File) {
    const character = await this.findOne(personId);
    const newImage = this.imageRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      character: character, 
    });

    await this.imageRepo.save(newImage);

    return {
      id: newImage.id,
      filename: newImage.filename,
      url: `/people/image/${newImage.filename}`
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

  async create(createPersonDto: CreatePersonDto): Promise<Character> {
    const newCharacter = this.characterRepo.create(createPersonDto);
    return await this.characterRepo.save(newCharacter);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Character[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.characterRepo.findAndCount({
      relations: this.characterRelations,
      relationLoadStrategy: 'query',
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
    const character = await this.findOne(id);
    if (character.images && character.images.length > 0) {
      const deletePromises = character.images.map(async (image) => {
        const filePath = join(this.uploadPath, image.filename);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`File not found: ${filePath}`);
        }
      });
      await Promise.all(deletePromises);
    }

    await this.characterRepo.delete(id);
    return { deleted: true };
  }
}