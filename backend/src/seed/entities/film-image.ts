import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Film } from 'src/seed/entities/films';

@Entity('film_images')
export class FilmImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({name: "original-name"})
  originalName: string;

  @ManyToOne(() => Film, (film) => film.images, { onDelete: 'CASCADE' })
  film: Film;
}
