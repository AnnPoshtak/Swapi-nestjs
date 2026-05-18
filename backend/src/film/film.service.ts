import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from 'src/seed/entities/films';
import { Repository } from 'typeorm';

@Injectable()
export class FilmService {
  private readonly filmRelations = ['characters', 'planets', 'starships', 'vehicles', 'species'];

  constructor(
    @InjectRepository(Film) private readonly filmRepo: Repository<Film>,
  ) {}

  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    const newFilm = this.filmRepo.create(createFilmDto); 
    return await this.filmRepo.save(newFilm);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Film[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.filmRepo.findAndCount({
      //relations: this.filmRelations,
      loadRelationIds: true, //so far yes, because it puts the entire server
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
    await this.findOne(id);
    await this.filmRepo.delete(id);
    return { deleted: true };
  }
}