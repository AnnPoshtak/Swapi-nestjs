import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { Planet } from 'src/seed/entities/planets';
import { PlanetImage } from 'src/seed/entities/planet-image';

@Module({
  imports: [TypeOrmModule.forFeature([Planet, PlanetImage])],
  controllers: [PlanetsController],
  providers: [PlanetsService],
})
export class PlanetsModule {}