import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable
} from 'typeorm';
import { Film } from './films';
import { Vehicle } from './vehicles';
import { Starship } from './starship';
import { Species } from './species';
import { Planet } from './planets'; 

@Entity('characters')
export class Character {
  @PrimaryColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({ nullable: true })
  height?: string;

  @Column({ nullable: true })
  mass?: string;

  @Column({ name: 'hair_color', nullable: true })
  hairColor?: string;

  @Column({ name: 'skin_color', nullable: true })
  skinColor?: string;

  @Column({ name: 'eye_color', nullable: true })
  eyeColor?: string;

  @Column({ name: 'birth_year', nullable: true })
  birthYear?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({nullable: true})
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'edited_at' })
  editedAt: Date;

  @ManyToOne(() => Planet, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'homeworld_id' })
  homeworld?: Planet | null;

  @ManyToMany(() => Film, (film) => film.characters)
  films: Film[];

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.pilots) 
  @JoinTable({ name: 'characters_vehicles' })
  vehicles: Vehicle[];

  @ManyToMany(() => Starship, (starship) => starship.pilots)
  @JoinTable({ name: 'characters_starships' })
  starships: Starship[];

  @ManyToMany(() => Species, (species) => species.people)
  @JoinTable({ name: 'characters_species' })
  species: Species[];
}