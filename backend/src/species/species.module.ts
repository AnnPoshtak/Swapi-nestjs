import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';

import { Species } from 'src/seed/entities/species';
import { SpeciesImage } from 'src/seed/entities/species-image';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Species,
      SpeciesImage,
    ]),
  ],
  controllers: [SpeciesController],
  providers: [SpeciesService],
})
export class SpeciesModule { }
