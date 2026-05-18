import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StarshipService } from './starship.service';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';

@Controller('starship')
export class StarshipController {
  constructor(private readonly starshipService: StarshipService) { }

  @Post()
  create(@Body() createStarshipDto: CreateStarshipDto) {
    return this.starshipService.create(createStarshipDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
  ) {
    return this.starshipService.findAll(page, 10);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.starshipService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateStarshipDto: UpdateStarshipDto) {
    return this.starshipService.update(id, updateStarshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.starshipService.remove(id);
  }
}
