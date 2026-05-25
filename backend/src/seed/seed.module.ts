import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { Film } from './entities/films';
import { Character } from './entities/people';
import { Planet } from './entities/planets';
import { Species } from './entities/species';
import { Starship } from './entities/starship';
import { Vehicle } from './entities/vehicles';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Film,
      Character,
      Planet,
      Species,
      Starship,
      Vehicle,
      User
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}