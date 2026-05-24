import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany
} from 'typeorm';
import { Character } from './people';
import { Planet } from './planets';
import { Starship } from './starship';
import { Vehicle } from './vehicles';
import { Species } from './species';
import { FilmImage } from './film-image';

@Entity('films')
export class Film {
  @PrimaryColumn()
  id: number; 

  @Column({ nullable: true })
  title: string; 

  @Column({ name: 'episode_id', nullable: true })
  episodeId?: number;

  @Column({ name: 'opening_crawl', type: 'text', nullable: true }) 
  openingCrawl?: string;

  @Column({ nullable: true })
  director?: string;

  @Column({ nullable: true })
  producer?: string;

  @Column({ name: 'release_date', nullable: true })
  releaseDate?: string;

  @Column()
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; 

  @UpdateDateColumn({ name: 'edited_at' })
  editedAt: Date;

  @ManyToMany(() => Character, (character) => character.films)
  @JoinTable({ name: 'films_characters' })
  characters: Character[]; 

  @ManyToMany(() => Planet, (planet) => planet.films)
  @JoinTable({ name: 'films_planets' })
  planets: Planet[];

  @ManyToMany(() => Starship, (starship) => starship.films)
  @JoinTable({ name: 'films_starships' })
  starships: Starship[];

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.films)
  @JoinTable({ name: 'films_vehicles' })
  vehicles: Vehicle[];

  @ManyToMany(() => Species, (species) => species.films)
  @JoinTable({ name: 'films_species' })
  species: Species[];

  @OneToMany(() => FilmImage, (image) => image.film, { cascade: true })
  images: FilmImage[];
}