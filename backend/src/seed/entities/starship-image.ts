import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Starship } from 'src/seed/entities/starship';

@Entity('starship_images')
export class StarshipImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({name: "original-name"})
  originalName: string;

  @ManyToOne(() => Starship, (starship) => starship.images, { onDelete: 'CASCADE' })
  starship: Starship;
}
