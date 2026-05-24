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
import { StarshipImage } from './starship-image';

@Entity('starships')
export class Starship {
  @PrimaryColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  model: string;

  @Column({nullable: true})
  manufacturer: string;

  @Column({ name: 'cost_in_credits', nullable: true })
  costInCredits: string;

  @Column({nullable: true})
  length: string;

  @Column({ name: 'max_atmosphering_speed', nullable: true })
  maxAtmospheringSpeed: string;

  @Column({nullable: true})
  crew: string;

  @Column({nullable: true})
  passengers: string;

  @Column({ name: 'cargo_capacity', nullable: true })
  cargoCapacity: string;

  @Column({nullable: true})
  consumables: string;

  @Column({ name: 'hyperdrive_rating', nullable: true })
  hyperdriveRating: string;

  @Column({nullable: true})
  MGLT: string;

  @Column({ name: 'starship_class', nullable: true })
  starshipClass: string;

  @Column({nullable: true})
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'edited_at' })
  editedAt: Date;

  @ManyToMany(() => Character, (character) => character.starships)
  pilots: Character[];

  @ManyToMany(() => Film, (film) => film.starships)
  films: Film[];

  @OneToMany(() => StarshipImage, (image) => image.starship, { cascade: true })
  images: StarshipImage[];
}