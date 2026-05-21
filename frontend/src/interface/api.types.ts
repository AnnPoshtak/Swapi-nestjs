export interface IFilm {
  id: number;
  title: string;
  episodeId?: number;
  openingCrawl?: string;
  director?: string;
  producer?: string;
  releaseDate?: string;
  url: string;
  createdAt: Date | string;
  editedAt: Date | string;
  characters?: IPerson[];
  planets?: IPlanet[];
  starships?: IStarship[];
  vehicles?: IVehicle[];
  species?: ISpecies[];
}

export interface IPerson {
  id: number;
  name: string;
  height?: string;
  mass?: string;
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  birthYear?: string;
  gender?: string;
  url: string;
  createdAt: Date | string;
  editedAt: Date | string;
  homeworld?: IPlanet | null;
  films?: IFilm[];
  vehicles?: IVehicle[];
  starships?: IStarship[];
  species?: ISpecies[];
}


export interface IPlanet {
  id: number;
  name: string;
  rotationPeriod: string;
  orbitalPeriod: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surfaceWater: string;
  population: string;
  url: string;
  createdAt: Date | string;
  editedAt: Date | string;
  films?: IFilm[];
  residents?: IPerson[];
}

export interface ISpecies {
  id: number;
  name: string;
  classification: string;
  designation: string;
  averageHeight: string;
  skinColors: string;
  hairColors: string;
  eyeColors: string;
  averageLifespan: string;
  language: string;
  url: string;
  createdAt: Date | string;
  editedAt: Date | string;
  homeworld?: IPlanet | null;
  people?: IPerson[];
  films?: IFilm[];
}

export interface IStarship {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  costInCredits: string;
  length: string;
  maxAtmospheringSpeed: string;
  crew: string;
  passengers: string;
  cargoCapacity: string;
  consumables: string;
  hyperdriveRating: string;
  MGLT: string;
  starshipClass: string;
  url: string;
  createdAt: Date | string;
  editedAt: Date | string;
  pilots?: IPerson[];
  films?: IFilm[];
}

export interface IVehicle {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  costInCredits: string;
  length: string;
  maxAtmospheringSpeed: string;
  crew: string;
  passengers: string;
  cargoCapacity: string;
  consumables: string;
  vehicleClass: string;
  url: string;
  createdAt: Date | string;
  editedAt: Date | string;
  pilots?: IPerson[];
  films?: IFilm[];
}


export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

export interface IApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
