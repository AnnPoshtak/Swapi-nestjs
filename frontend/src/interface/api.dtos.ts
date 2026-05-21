export interface ICreateFilmDTO {
  title: string;
  episodeId?: number;
  openingCrawl?: string;
  director?: string;
  producer?: string;
  releaseDate?: string;
  url: string;
}

export interface IUpdateFilmDTO {
  title?: string;
  episodeId?: number;
  openingCrawl?: string;
  director?: string;
  producer?: string;
  releaseDate?: string;
  url?: string;
}

export interface ICreatePersonDTO {
  name: string;
  height?: string;
  mass?: string;
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  birthYear?: string;
  gender?: string;
  url: string;
  homeworldId?: number;
}


export interface IUpdatePersonDTO {
  name?: string;
  height?: string;
  mass?: string;
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  birthYear?: string;
  gender?: string;
  url?: string;
  homeworldId?: number;
}


export interface ICreatePlanetDTO {
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
}

export interface IUpdatePlanetDTO {
  name?: string;
  rotationPeriod?: string;
  orbitalPeriod?: string;
  diameter?: string;
  climate?: string;
  gravity?: string;
  terrain?: string;
  surfaceWater?: string;
  population?: string;
  url?: string;
}

export interface ICreateSpeciesDTO {
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
  homeworldId?: number;
}

export interface IUpdateSpeciesDTO {
  name?: string;
  classification?: string;
  designation?: string;
  averageHeight?: string;
  skinColors?: string;
  hairColors?: string;
  eyeColors?: string;
  averageLifespan?: string;
  language?: string;
  url?: string;
  homeworldId?: number;
}

export interface ICreateStarshipDTO {
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
}

export interface IUpdateStarshipDTO {
  name?: string;
  model?: string;
  manufacturer?: string;
  costInCredits?: string;
  length?: string;
  maxAtmospheringSpeed?: string;
  crew?: string;
  passengers?: string;
  cargoCapacity?: string;
  consumables?: string;
  hyperdriveRating?: string;
  MGLT?: string;
  starshipClass?: string;
  url?: string;
}

export interface ICreateVehicleDTO {
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
}

export interface IUpdateVehicleDTO {
  name?: string;
  model?: string;
  manufacturer?: string;
  costInCredits?: string;
  length?: string;
  maxAtmospheringSpeed?: string;
  crew?: string;
  passengers?: string;
  cargoCapacity?: string;
  consumables?: string;
  vehicleClass?: string;
  url?: string;
}
