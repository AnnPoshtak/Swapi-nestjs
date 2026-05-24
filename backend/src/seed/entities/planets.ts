import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany
} from 'typeorm';
import { Character } from './people';
import { Film } from './films';
import { PlanetImage } from './planet-image';

@Entity('planets')
export class Planet {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'rotation_period', nullable: true })
  rotationPeriod: string;

  @Column({ name: 'orbital_period', nullable: true })
  orbitalPeriod: string;

  @Column({ nullable: true })
  diameter: string;

  @Column({ nullable: true })
  climate: string;

  @Column({ nullable: true })
  gravity: string;

  @Column({ nullable: true })
  terrain: string;

  @Column({ name: 'surface_water', nullable: true })
  surfaceWater: string;

  @Column({ nullable: true })
  population: string;

  @Column({ nullable: true })
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'edited_at' })
  editedAt: Date;

  @ManyToMany(() => Film, (film) => film.planets)
  films: Film[];

  @OneToMany(() => Character, (character) => character.homeworld)
  residents: Character[];

  @OneToMany(() => PlanetImage, (planetImage) => planetImage.planet)
  images: PlanetImage[];
}