import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from './entities/films';
import { Character } from './entities/people';
import { Planet } from './entities/planets';
import { Species } from './entities/species';
import { Starship } from './entities/starship';
import { Vehicle } from './entities/vehicles';

import { extractId } from './utils/helper';


@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Film) private readonly filmRepo: Repository<Film>,
    @InjectRepository(Character) private readonly characterRepo: Repository<Character>,
    @InjectRepository(Planet) private readonly planetRepo: Repository<Planet>,
    @InjectRepository(Species) private readonly speciesRepo: Repository<Species>,
    @InjectRepository(Starship) private readonly starshipRepo: Repository<Starship>,
    @InjectRepository(Vehicle) private readonly vehicleRepo: Repository<Vehicle>,
  ) { }


  async load(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch data from ${url}`);
    const data = await res.json();
    return data;
  }

  async run() {
    const repositories = [this.filmRepo, this.characterRepo, this.speciesRepo, this.starshipRepo, this.vehicleRepo, this.planetRepo,];

    for (const repo of repositories) {
      const tableName = repo.metadata.tableName;
      await repo.query(`TRUNCATE TABLE "${tableName}" CASCADE;`);
    }

    const apiUrl = process.env.SWAPI_URL;
    const [filmsData, peopleData, planetsData, speciesData, starshipsData, vehiclesData] = await Promise.all([this.load(`${apiUrl}films`),this.load(`${apiUrl}people`),this.load(`${apiUrl}planets`),this.load(`${apiUrl}species`),this.load(`${apiUrl}starships`),this.load(`${apiUrl}vehicles`),]);

    //planets
    const planets = planetsData.map((p: any) => ({...p,id: extractId(p.url),}));
    await this.planetRepo.save(this.planetRepo.create(planets));

    //starships
    const starships = starshipsData.map((s: any) => ({...s,id: extractId(s.url),}));
    await this.starshipRepo.save(this.starshipRepo.create(starships));

    //vehicles
    const vehicles = vehiclesData.map((v: any) => ({...v,id: extractId(v.url),}));
    await this.vehicleRepo.save(this.vehicleRepo.create(vehicles));

    //ізусшуі
    const species = speciesData.map((s: any) => ({...s,id: extractId(s.url),homeworld: s.homeworld ? { id: extractId(s.homeworld) } : null,}));
    await this.speciesRepo.save(this.speciesRepo.create(species));

    //chapters
    const characters = peopleData.map((c: any) => ({...c,id: extractId(c.url),homeworld: c.homeworld ? { id: extractId(c.homeworld) } : null,vehicles: (c.vehicles || []).map((url: string) => ({ id: extractId(url) })),starships: (c.starships || []).map((url: string) => ({ id: extractId(url) })),species: (c.species || []).map((url: string) => ({ id: extractId(url) })),}));
    await this.characterRepo.save(this.characterRepo.create(characters));

    //films
    const films = filmsData.map((f: any) => ({...f,id: extractId(f.url),characters: (f.characters || []).map((url: string) => ({ id: extractId(url) })),planets: (f.planets || []).map((url: string) => ({ id: extractId(url) })),starships: (f.starships || []).map((url: string) => ({ id: extractId(url) })),vehicles: (f.vehicles || []).map((url: string) => ({ id: extractId(url) })),species: (f.species || []).map((url: string) => ({ id: extractId(url) })),}));
    await this.filmRepo.save(this.filmRepo.create(films));

    return {
      status: 'success',
      message: 'database filled with data from swapi',
    };
  }
}