import { Module } from '@nestjs/common';
import { StarshipService } from './starship.service';
import { StarshipController } from './starship.controller';

import { Starship } from 'src/seed/entities/starship';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Starship,
    ]),
  ],
  controllers: [StarshipController],
  providers: [StarshipService],
})
export class StarshipModule { }
