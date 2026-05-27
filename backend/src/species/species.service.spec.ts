import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesService } from './species.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Species } from 'src/seed/entities/species';
import { SpeciesImage } from 'src/seed/entities/species-image';
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

describe('SpeciesService', () => {
  let service: SpeciesService;

  const mockSpeciesRepository = {
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
        SpeciesService,
        {
          provide: getRepositoryToken(Species),
          useValue: mockSpeciesRepository,
        },
        {
          provide: getRepositoryToken(SpeciesImage),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<SpeciesService>(SpeciesService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create and save a new species', async () => {
      const dto = { name: 'Wookiee', language: 'Shyriiwook' };
      const createdSpecies = { id: 1, ...dto };

      mockSpeciesRepository.create.mockReturnValue(createdSpecies);
      mockSpeciesRepository.save.mockResolvedValue(createdSpecies);

      const result = await service.create(dto as any);

      expect(result).toEqual(createdSpecies);
      expect(mockSpeciesRepository.create).toHaveBeenCalledWith(dto);
      expect(mockSpeciesRepository.save).toHaveBeenCalledWith(createdSpecies);
    });
  });

  describe('findOne', () => {
    it('should return a species if it exists', async () => {
      const fakeSpecies = { id: 1, name: 'Wookiee' };
      mockSpeciesRepository.findOne.mockResolvedValue(fakeSpecies);

      const result = await service.findOne(1);

      expect(result).toEqual(fakeSpecies);
      expect(mockSpeciesRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if species does not exist', async () => {
      mockSpeciesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an object with data array and total count', async () => {
      const fakeSpeciess = [{ id: 1, name: 'Wookiee' }];
      const totalCount = 1;
      
      mockSpeciesRepository.findAndCount.mockResolvedValue([fakeSpeciess, totalCount]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ data: fakeSpeciess, total: totalCount });
      expect(mockSpeciesRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });
  });

  describe('addImage', () => {
    it('should add an image to an existing species', async () => {
      const fakeSpecies = { id: 1, name: 'Wookiee' };
      const fakeFile = { filename: 'wookiee.jpg', originalname: 'original.jpg' };
      const fakeImage = { id: 5, filename: 'wookiee.jpg', originalName: 'original.jpg', species: fakeSpecies };

      mockSpeciesRepository.findOne.mockResolvedValue(fakeSpecies);
      mockImageRepository.create.mockReturnValue(fakeImage);
      mockImageRepository.save.mockResolvedValue(fakeImage);

      const result = await service.addImage(1, fakeFile as any);

      expect(result).toEqual({
        id: 5,
        filename: 'wookiee.jpg',
        url: '/species/image/wookiee.jpg',
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
    it('should successfully update a species', async () => {
      const fakeSpecies = { id: 1, name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const mergedSpecies = { id: 1, name: 'New Name' };

      mockSpeciesRepository.findOne.mockResolvedValue(fakeSpecies);
      mockSpeciesRepository.merge.mockReturnValue(mergedSpecies);
      mockSpeciesRepository.save.mockResolvedValue(mergedSpecies);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mergedSpecies);
      expect(mockSpeciesRepository.merge).toHaveBeenCalledWith(fakeSpecies, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete species and all its associated images from disk', async () => {
      const fakeSpecies = { 
        id: 1, 
        name: 'To Delete', 
        images: [{ filename: 'img1.jpg' }, { filename: 'img2.jpg' }] 
      };
      
      mockSpeciesRepository.findOne.mockResolvedValue(fakeSpecies);
      mockSpeciesRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(mockSpeciesRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});