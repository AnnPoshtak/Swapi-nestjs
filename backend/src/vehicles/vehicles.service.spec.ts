import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from 'src/seed/entities/vehicles';
import { VehicleImage } from 'src/seed/entities/vehicle-image';
import { NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs') as any;
  return {
    ...originalModule,
    promises: {
      ...originalModule.promises,
      unlink: jest.fn().mockResolvedValue(undefined),
    },
  };
});

describe('VehiclesService', () => {
  let service: VehiclesService;

  const mockVehicleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  const mockImageRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepository,
        },
        {
          provide: getRepositoryToken(VehicleImage),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create and save a new Vehicle', async () => {
      const dto = { name: 'Millennium Falcon', model: 'YT-1300' };
      const createdVehicle = { id: 1, ...dto };

      mockVehicleRepository.create.mockReturnValue(createdVehicle);
      mockVehicleRepository.save.mockResolvedValue(createdVehicle);

      const result = await service.create(dto as any);

      expect(result).toEqual(createdVehicle);
      expect(mockVehicleRepository.create).toHaveBeenCalledWith(dto);
      expect(mockVehicleRepository.save).toHaveBeenCalledWith(createdVehicle);
    });
  });

  describe('findOne', () => {
    it('should return a Vehicle if it exists', async () => {
      const fakeVehicle = { id: 1, name: 'Millennium Falcon' };
      mockVehicleRepository.findOne.mockResolvedValue(fakeVehicle);

      const result = await service.findOne(1);

      expect(result).toEqual(fakeVehicle);
      expect(mockVehicleRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if Vehicle does not exist', async () => {
      mockVehicleRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an object with data array and total count', async () => {
      const fakeVehicles = [{ id: 1, name: 'Millennium Falcon' }];
      const totalCount = 1;
      
      mockVehicleRepository.findAndCount.mockResolvedValue([fakeVehicles, totalCount]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ data: fakeVehicles, total: totalCount });
      expect(mockVehicleRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });
  });

  describe('addImage', () => {
    it('should add an image to an existing Vehicle', async () => {
      const fakeVehicle = { id: 1, name: 'Millennium Falcon' };
      const fakeFile = { filename: 'falcon.jpg', originalname: 'original.jpg' };
      const fakeImage = { id: 5, filename: 'falcon.jpg', originalName: 'original.jpg', Vehicle: fakeVehicle };

      mockVehicleRepository.findOne.mockResolvedValue(fakeVehicle);
      mockImageRepository.create.mockReturnValue(fakeImage);
      mockImageRepository.save.mockResolvedValue(fakeImage);

      const result = await service.addImage(1, fakeFile as any);

      expect(result).toEqual({
        id: 5,
        filename: 'falcon.jpg',
        url: '/vehicles/image/falcon.jpg',
      });
    });
  });

  describe('removeImage', () => {
    it('should successfully remove image and unlink file from disk', async () => {
      const fakeImage = { id: 5, filename: 'avatar.png' };
      mockImageRepository.findOne.mockResolvedValue(fakeImage);
      mockImageRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.removeImage(5);

      expect(result).toEqual({ deleted: true });
      expect(fs.unlink).toHaveBeenCalled();
      expect(mockImageRepository.delete).toHaveBeenCalledWith(5);
    });

    it('should throw NotFoundException if image to remove does not exist', async () => {
      mockImageRepository.findOne.mockResolvedValue(null);

      await expect(service.removeImage(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update a Vehicle', async () => {
      const fakeVehicle = { id: 1, name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const mergedVehicle = { id: 1, name: 'New Name' };

      mockVehicleRepository.findOne.mockResolvedValue(fakeVehicle);
      mockVehicleRepository.merge.mockReturnValue(mergedVehicle);
      mockVehicleRepository.save.mockResolvedValue(mergedVehicle);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mergedVehicle);
      expect(mockVehicleRepository.merge).toHaveBeenCalledWith(fakeVehicle, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete Vehicle and all its associated images from disk', async () => {
      const fakeVehicle = { 
        id: 1, 
        name: 'To Delete', 
        images: [{ filename: 'img1.jpg' }, { filename: 'img2.jpg' }] 
      };
      
      mockVehicleRepository.findOne.mockResolvedValue(fakeVehicle);
      mockVehicleRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(mockVehicleRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});