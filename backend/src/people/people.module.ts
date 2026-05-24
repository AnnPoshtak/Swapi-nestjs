import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';

import { Character } from 'src/seed/entities/people';
import { PeopleImage } from 'src/seed/entities/people-image';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Character, PeopleImage
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule { }
