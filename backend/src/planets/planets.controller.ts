import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) { }

  @Post()
  create(@Body() createPlanetDto: CreatePlanetDto) {
    return this.planetsService.create(createPlanetDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
  ) {
    return this.planetsService.findAll(page, 10);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.planetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePlanetDto: UpdatePlanetDto) {
    return this.planetsService.update(id, updatePlanetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.planetsService.remove(id);
  }
}