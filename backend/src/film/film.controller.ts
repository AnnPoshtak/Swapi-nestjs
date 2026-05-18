import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FilmService } from './film.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Post()
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmService.create(createFilmDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
  ) {
    return this.filmService.findAll(page, 10);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.filmService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFilmDto: UpdateFilmDto) {
    return this.filmService.update(id, updateFilmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.filmService.remove(id);
  }
}