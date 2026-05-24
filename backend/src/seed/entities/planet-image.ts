import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Planet } from 'src/seed/entities/planets';

@Entity('planet_images')
export class PlanetImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({name: "original-name"})
  originalName: string;

  @ManyToOne(() => Planet, (planet) => planet.images, { onDelete: 'CASCADE' })
  planet: Planet;
}