import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';

import { Character } from 'src/seed/entities/people';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Character,
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule { }
