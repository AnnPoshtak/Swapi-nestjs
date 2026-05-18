import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';

import { Planet } from 'src/seed/entities/planets';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Planet,
    ]),
  ],
  controllers: [PlanetsController],
  providers: [PlanetsService],
})
export class PlanetsModule { }
