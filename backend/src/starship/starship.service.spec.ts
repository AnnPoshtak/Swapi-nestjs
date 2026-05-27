import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { StarshipService } from './starship.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Starship } from 'src/seed/entities/starship';
import { StarshipImage } from 'src/seed/entities/starship-image';
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

describe('StarshipService', () => {
  let service: StarshipService;

  const mockStarshipRepository = {
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
        StarshipService,
        {
          provide: getRepositoryToken(Starship),
          useValue: mockStarshipRepository,
        },
        {
          provide: getRepositoryToken(StarshipImage),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<StarshipService>(StarshipService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create and save a new Starship', async () => {
      const dto = { name: 'Millennium Falcon', model: 'YT-1300' };
      const createdStarship = { id: 1, ...dto };

      mockStarshipRepository.create.mockReturnValue(createdStarship);
      mockStarshipRepository.save.mockResolvedValue(createdStarship);

      const result = await service.create(dto as any);

      expect(result).toEqual(createdStarship);
      expect(mockStarshipRepository.create).toHaveBeenCalledWith(dto);
      expect(mockStarshipRepository.save).toHaveBeenCalledWith(createdStarship);
    });
  });

  describe('findOne', () => {
    it('should return a Starship if it exists', async () => {
      const fakeStarship = { id: 1, name: 'Millennium Falcon' };
      mockStarshipRepository.findOne.mockResolvedValue(fakeStarship);

      const result = await service.findOne(1);

      expect(result).toEqual(fakeStarship);
      expect(mockStarshipRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if Starship does not exist', async () => {
      mockStarshipRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an object with data array and total count', async () => {
      const fakeStarships = [{ id: 1, name: 'Millennium Falcon' }];
      const totalCount = 1;
      
      mockStarshipRepository.findAndCount.mockResolvedValue([fakeStarships, totalCount]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ data: fakeStarships, total: totalCount });
      expect(mockStarshipRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });
  });

  describe('addImage', () => {
    it('should add an image to an existing Starship', async () => {
      const fakeStarship = { id: 1, name: 'Millennium Falcon' };
      const fakeFile = { filename: 'falcon.jpg', originalname: 'original.jpg' };
      const fakeImage = { id: 5, filename: 'falcon.jpg', originalName: 'original.jpg', starship: fakeStarship };

      mockStarshipRepository.findOne.mockResolvedValue(fakeStarship);
      mockImageRepository.create.mockReturnValue(fakeImage);
      mockImageRepository.save.mockResolvedValue(fakeImage);

      const result = await service.addImage(1, fakeFile as any);

      expect(result).toEqual({
        id: 5,
        filename: 'falcon.jpg',
        url: '/starship/image/falcon.jpg',
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
    it('should successfully update a Starship', async () => {
      const fakeStarship = { id: 1, name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const mergedStarship = { id: 1, name: 'New Name' };

      mockStarshipRepository.findOne.mockResolvedValue(fakeStarship);
      mockStarshipRepository.merge.mockReturnValue(mergedStarship);
      mockStarshipRepository.save.mockResolvedValue(mergedStarship);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mergedStarship);
      expect(mockStarshipRepository.merge).toHaveBeenCalledWith(fakeStarship, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete Starship and all its associated images from disk', async () => {
      const fakeStarship = { 
        id: 1, 
        name: 'To Delete', 
        images: [{ filename: 'img1.jpg' }, { filename: 'img2.jpg' }] 
      };
      
      mockStarshipRepository.findOne.mockResolvedValue(fakeStarship);
      mockStarshipRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(mockStarshipRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});