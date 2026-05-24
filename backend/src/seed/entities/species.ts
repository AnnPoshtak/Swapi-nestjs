import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Character } from './people';
import { Film } from './films';
import { Planet } from './planets';
import { SpeciesImage } from './species-image';

@Entity('species')
export class Species {
  @PrimaryColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  classification: string;

  @Column({nullable: true})
  designation: string;

  @Column({ name: 'average_height', nullable: true })
  averageHeight: string;

  @Column({ name: 'skin_colors', nullable: true })
  skinColors: string;

  @Column({ name: 'hair_colors', nullable: true })
  hairColors: string;

  @Column({ name: 'eye_colors', nullable: true })
  eyeColors: string;

  @Column({ name: 'average_lifespan', nullable: true })
  averageLifespan: string;

  @Column({nullable: true})
  language: string;

  @Column({nullable: true})
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'edited_at' })
  editedAt: Date;

  @ManyToOne(() => Planet, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'homeworld_id' })
  homeworld?: Planet | null;

  @ManyToMany(() => Character, (character) => character.species)
  people: Character[];

  @ManyToMany(() => Film, (film) => film.species)
  films: Film[];

  @OneToMany(() => SpeciesImage, (image) => image.species, { cascade: true })
  images: SpeciesImage[];
}