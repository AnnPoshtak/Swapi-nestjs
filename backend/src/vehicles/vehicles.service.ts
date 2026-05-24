import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Vehicle } from 'src/seed/entities/vehicles';
import { VehicleImage } from 'src/seed/entities/vehicle-image';
import { Repository } from 'typeorm';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class VehiclesService {
  private vehicleRelations = ['pilots', 'films', 'images'];
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Vehicle) private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleImage) private readonly imageRepo: Repository<VehicleImage>,
  ) { }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const newVehicle = this.vehicleRepo.create(createVehicleDto);
    return await this.vehicleRepo.save(newVehicle);
  }

  async addImage(vehicleId: number, file: Express.Multer.File) {
    const vehicle = await this.findOne(vehicleId);
    const newImage = this.imageRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      vehicle: vehicle,
    });

    await this.imageRepo.save(newImage);

    return {
      id: newImage.id,
      filename: newImage.filename,
      url: `/vehicles/image/${newImage.filename}`
    };
  }

  async removeImage(imageId: number) {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    const filePath = join(this.uploadPath, image.filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`File not found on disk: ${filePath}`);
    }

    await this.imageRepo.delete(imageId);

    return { deleted: true };
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Vehicle[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.vehicleRepo.findAndCount({
      relations: this.vehicleRelations,
      relationLoadStrategy: 'query',
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
    const vehicle = await this.findOne(id);
    if (vehicle.images && vehicle.images.length > 0) {
      const deletePromises = vehicle.images.map(async (image) => {
        const filePath = join(this.uploadPath, image.filename);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`File not found: ${filePath}`);
        }
      });
      await Promise.all(deletePromises);
    }

    await this.vehicleRepo.delete(id);
    return { deleted: true };
  }
}
