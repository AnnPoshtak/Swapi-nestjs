import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';

import { Film } from 'src/seed/entities/films';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Film,
    ]),
  ],
  controllers: [FilmController],
  providers: [FilmService],
})
export class FilmModule { }
