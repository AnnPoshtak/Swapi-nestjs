import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Species } from 'src/seed/entities/species';

@Entity('species_images')
export class SpeciesImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({name: "original-name"})
  originalName: string;

  @ManyToOne(() => Species, (species) => species.images, { onDelete: 'CASCADE' })
  species: Species;
}
