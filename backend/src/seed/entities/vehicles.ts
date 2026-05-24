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
import { VehicleImage } from './vehicle-image';

@Entity('vehicles')
export class Vehicle {
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

  @Column({ name: 'vehicle_class', nullable: true })
  vehicleClass: string;

  @Column({nullable: true})
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'edited_at' })
  editedAt: Date;

  @ManyToMany(() => Character, (character) => character.vehicles)
  pilots: Character[];

  @ManyToMany(() => Film, (film) => film.vehicles)
  films: Film[];

  @OneToMany(() => VehicleImage, (image) => image.vehicle, { cascade: true })
  images: VehicleImage[];
}