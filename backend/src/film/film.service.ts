import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from '../seed/entities/films';
import { FilmImage } from '../seed/entities/film-image';
import { Repository } from 'typeorm';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FilmService {
  private readonly filmRelations = ['characters', 'planets', 'starships', 'vehicles', 'species', 'images'];
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Film) private readonly filmRepo: Repository<Film>,
    @InjectRepository(FilmImage) private readonly imageRepo: Repository<FilmImage>,
  ) {}

  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    const newFilm = this.filmRepo.create(createFilmDto); 
    return await this.filmRepo.save(newFilm);
  }

  async addImage(filmId: number, file: Express.Multer.File) {
    const film = await this.findOne(filmId);
    const newImage = this.imageRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      film: film,
    });

    await this.imageRepo.save(newImage);

    return {
      id: newImage.id,
      filename: newImage.filename,
      url: `/film/image/${newImage.filename}`
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

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Film[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.filmRepo.findAndCount({
      relations: this.filmRelations,
      relationLoadStrategy: 'query',
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Film> {
    const film = await this.filmRepo.findOne({ 
      where: { id },
      relations: this.filmRelations,
    });

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return film;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    const film = await this.findOne(id);
    const updatedFilm = this.filmRepo.merge(film, updateFilmDto);
    return await this.filmRepo.save(updatedFilm);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const film = await this.findOne(id);
    if (film.images && film.images.length > 0) {
      const deletePromises = film.images.map(async (image) => {
        const filePath = join(this.uploadPath, image.filename);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`File not found: ${filePath}`);
        }
      });
      await Promise.all(deletePromises);
    }

    await this.filmRepo.delete(id);
    return { deleted: true };
  }
}