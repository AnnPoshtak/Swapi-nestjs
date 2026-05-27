import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from './planets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from '../seed/entities/planets';
import { PlanetImage } from '../seed/entities/planet-image';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs') as any;
  return {
    ...originalModule,
    existsSync: jest.fn().mockReturnValue(true),
    unlinkSync: jest.fn().mockImplementation(() => {}),
  };
});

describe('PlanetsService', () => {
  let service: PlanetsService;

  const mockPlanetRepository = {
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
        PlanetsService,
        {
          provide: getRepositoryToken(Planet),
          useValue: mockPlanetRepository,
        },
        {
          provide: getRepositoryToken(PlanetImage),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create and save a new Planet', async () => {
      const dto = { name: 'Tatooine', climate: 'arid' };
      const createdPlanet = { id: 1, ...dto };

      mockPlanetRepository.create.mockReturnValue(createdPlanet);
      mockPlanetRepository.save.mockResolvedValue(createdPlanet);

      const result = await service.create(dto as any);

      expect(result).toEqual(createdPlanet);
      expect(mockPlanetRepository.create).toHaveBeenCalledWith(dto);
      expect(mockPlanetRepository.save).toHaveBeenCalledWith(createdPlanet);
    });
  });

  describe('findOne', () => {
    it('should return a Planet if it exists', async () => {
      const fakePlanet = { id: 1, name: 'Tatooine' };
      mockPlanetRepository.findOne.mockResolvedValue(fakePlanet);

      const result = await service.findOne(1);

      expect(result).toEqual(fakePlanet);
      expect(mockPlanetRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if Planet does not exist', async () => {
      mockPlanetRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an object with data array and total count', async () => {
      const fakePlanets = [{ id: 1, name: 'Tatooine' }];
      const totalCount = 1;
      
      mockPlanetRepository.findAndCount.mockResolvedValue([fakePlanets, totalCount]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ data: fakePlanets, total: totalCount });
      expect(mockPlanetRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });
  });

  describe('addImage', () => {
    it('should add an image to an existing Planet', async () => {
      const fakePlanet = { id: 1, name: 'Tatooine' };
      const fakeFile = { filename: 'tatooine.jpg', originalname: 'original.jpg' };
      const fakeImage = { id: 5, filename: 'tatooine.jpg', originalName: 'original.jpg', Planet: fakePlanet };

      mockPlanetRepository.findOne.mockResolvedValue(fakePlanet);
      mockImageRepository.create.mockReturnValue(fakeImage);
      mockImageRepository.save.mockResolvedValue(fakeImage);

      const result = await service.addImage(1, fakeFile as any);

      expect(result).toEqual({
        id: 5,
        filename: 'tatooine.jpg',
        url: '/planets/image/tatooine.jpg',
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
      expect(fs.existsSync).toHaveBeenCalledWith(expect.any(String));
      expect(fs.unlinkSync).toHaveBeenCalledWith(expect.any(String));
      expect(mockImageRepository.delete).toHaveBeenCalledWith(5);
    });

    it('should throw NotFoundException if image to remove does not exist', async () => {
      mockImageRepository.findOne.mockResolvedValue(null);

      await expect(service.removeImage(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update a Planet', async () => {
      const fakePlanet = { id: 1, name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const mergedPlanet = { id: 1, name: 'New Name' };

      mockPlanetRepository.findOne.mockResolvedValue(fakePlanet);
      mockPlanetRepository.merge.mockReturnValue(mergedPlanet);
      mockPlanetRepository.save.mockResolvedValue(mergedPlanet);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mergedPlanet);
      expect(mockPlanetRepository.merge).toHaveBeenCalledWith(fakePlanet, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete Planet and all its associated images from disk', async () => {
      const fakePlanet = { 
        id: 1, 
        name: 'To Delete', 
        images: [{ filename: 'img1.jpg' }, { filename: 'img2.jpg' }] 
      };
      
      mockPlanetRepository.findOne.mockResolvedValue(fakePlanet);
      mockPlanetRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
      expect(fs.existsSync).toHaveBeenCalledTimes(2);
      expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
      expect(mockPlanetRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});