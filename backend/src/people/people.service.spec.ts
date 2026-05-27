import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Character } from '../seed/entities/people';
import { PeopleImage } from '../seed/entities/people-image';
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

describe('PeopleService', () => {
  let service: PeopleService;

  const mockCharacterRepository = {
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
        PeopleService,
        {
          provide: getRepositoryToken(Character),
          useValue: mockCharacterRepository,
        },
        {
          provide: getRepositoryToken(PeopleImage),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create and save a new Character', async () => {
      const dto = { name: 'Luke Skywalker', gender: 'male' };
      const createdCharacter = { id: 1, ...dto };

      mockCharacterRepository.create.mockReturnValue(createdCharacter);
      mockCharacterRepository.save.mockResolvedValue(createdCharacter);

      const result = await service.create(dto as any);

      expect(result).toEqual(createdCharacter);
      expect(mockCharacterRepository.create).toHaveBeenCalledWith(dto);
      expect(mockCharacterRepository.save).toHaveBeenCalledWith(createdCharacter);
    });
  });

  describe('findOne', () => {
    it('should return a Character if it exists', async () => {
      const fakeCharacter = { id: 1, name: 'Luke Skywalker' };
      mockCharacterRepository.findOne.mockResolvedValue(fakeCharacter);

      const result = await service.findOne(1);

      expect(result).toEqual(fakeCharacter);
      expect(mockCharacterRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if Character does not exist', async () => {
      mockCharacterRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an object with data array and total count', async () => {
      const fakeCharacters = [{ id: 1, name: 'Luke Skywalker' }];
      const totalCount = 1;
      
      mockCharacterRepository.findAndCount.mockResolvedValue([fakeCharacters, totalCount]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ data: fakeCharacters, total: totalCount });
      expect(mockCharacterRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });
  });

  describe('addImage', () => {
    it('should add an image to an existing Character', async () => {
      const fakeCharacter = { id: 1, name: 'Luke Skywalker' };
      const fakeFile = { filename: 'luke.jpg', originalname: 'original.jpg' };
      const fakeImage = { id: 5, filename: 'luke.jpg', originalName: 'original.jpg', character: fakeCharacter };

      mockCharacterRepository.findOne.mockResolvedValue(fakeCharacter);
      mockImageRepository.create.mockReturnValue(fakeImage);
      mockImageRepository.save.mockResolvedValue(fakeImage);

      const result = await service.addImage(1, fakeFile as any);

      expect(result).toEqual({
        id: 5,
        filename: 'luke.jpg',
        url: '/people/image/luke.jpg',
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
    it('should successfully update a Character', async () => {
      const fakeCharacter = { id: 1, name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const mergedCharacter = { id: 1, name: 'New Name' };

      mockCharacterRepository.findOne.mockResolvedValue(fakeCharacter);
      mockCharacterRepository.merge.mockReturnValue(mergedCharacter);
      mockCharacterRepository.save.mockResolvedValue(mergedCharacter);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mergedCharacter);
      expect(mockCharacterRepository.merge).toHaveBeenCalledWith(fakeCharacter, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete Character and all its associated images from disk', async () => {
      const fakeCharacter = { 
        id: 1, 
        name: 'To Delete', 
        images: [{ filename: 'img1.jpg' }, { filename: 'img2.jpg' }] 
      };
      
      mockCharacterRepository.findOne.mockResolvedValue(fakeCharacter);
      mockCharacterRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(mockCharacterRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});