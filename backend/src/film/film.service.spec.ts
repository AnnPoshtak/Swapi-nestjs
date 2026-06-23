import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmService } from './film.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Film } from '../seed/entities/films';
import { FilmImage } from '../seed/entities/film-image';
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

describe('FilmService', () => {
  let service: FilmService;

  const mockFilmRepository = {
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
        FilmService,
        {
          provide: getRepositoryToken(Film),
          useValue: mockFilmRepository,
        },
        {
          provide: getRepositoryToken(FilmImage),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<FilmService>(FilmService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create and save a new film', async () => {
      const dto = { title: 'A New Hope', episode_id: 4 };
      const createdFilm = { id: 1, ...dto };

      mockFilmRepository.create.mockReturnValue(createdFilm);
      mockFilmRepository.save.mockResolvedValue(createdFilm);

      const result = await service.create(dto as any);

      expect(result).toEqual(createdFilm);
      expect(mockFilmRepository.create).toHaveBeenCalledWith(dto);
      expect(mockFilmRepository.save).toHaveBeenCalledWith(createdFilm);
    });
  });

  describe('findOne', () => {
    it('should return a film if it exists', async () => {
      const fakeFilm = { id: 1, title: 'The Empire Strikes Back' };
      mockFilmRepository.findOne.mockResolvedValue(fakeFilm);

      const result = await service.findOne(1);

      expect(result).toEqual(fakeFilm);
      expect(mockFilmRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if film does not exist', async () => {
      mockFilmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an object with data array and total count', async () => {
      const fakeFilms = [{ id: 1, title: 'Star Wars' }];
      const totalCount = 1;
      
      mockFilmRepository.findAndCount.mockResolvedValue([fakeFilms, totalCount]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ data: fakeFilms, total: totalCount });
      expect(mockFilmRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });
  });

  describe('addImage', () => {
    it('should add an image to an existing film', async () => {
      const fakeFilm = { id: 1, title: 'Star Wars' };
      const fakeFile = { filename: 'cover.jpg', originalname: 'original.jpg' };
      const fakeImage = { id: 5, filename: 'cover.jpg', originalName: 'original.jpg', film: fakeFilm };

      mockFilmRepository.findOne.mockResolvedValue(fakeFilm);
      mockImageRepository.create.mockReturnValue(fakeImage);
      mockImageRepository.save.mockResolvedValue(fakeImage);

      const result = await service.addImage(1, fakeFile as any);

      expect(result).toEqual({
        id: 5,
        filename: 'cover.jpg',
        url: '/images/cover.jpg',
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
    it('should successfully update a film', async () => {
      const fakeFilm = { id: 1, title: 'Old Title' };
      const updateDto = { title: 'New Title' };
      const mergedFilm = { id: 1, title: 'New Title' };

      mockFilmRepository.findOne.mockResolvedValue(fakeFilm);
      mockFilmRepository.merge.mockReturnValue(mergedFilm);
      mockFilmRepository.save.mockResolvedValue(mergedFilm);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mergedFilm);
      expect(mockFilmRepository.merge).toHaveBeenCalledWith(fakeFilm, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete film and all its associated images from disk', async () => {
      const fakeFilm = { 
        id: 1, 
        title: 'To Delete', 
        images: [{ filename: 'img1.jpg' }, { filename: 'img2.jpg' }] 
      };
      
      mockFilmRepository.findOne.mockResolvedValue(fakeFilm);
      mockFilmRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(mockFilmRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});