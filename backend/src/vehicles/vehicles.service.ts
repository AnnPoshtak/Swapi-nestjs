import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Vehicle } from 'src/seed/entities/vehicles';
import { Repository } from 'typeorm';

@Injectable()
export class VehiclesService {
  private vehicleRelations = ['pilots', 'films'];
  constructor(
    @InjectRepository(Vehicle) private readonly vehicleRepo: Repository<Vehicle>,
  ) { }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const newVehicle = this.vehicleRepo.create(createVehicleDto);
    return await this.vehicleRepo.save(newVehicle);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Vehicle[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.vehicleRepo.findAndCount({
      loadRelationIds: true,
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: this.vehicleRelations,
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    const updateVehicle = this.vehicleRepo.merge(vehicle, updateVehicleDto);
    return await this.vehicleRepo.save(updateVehicle);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.findOne(id);
    await this.vehicleRepo.delete(id);
    return { deleted: true };
  }
}
