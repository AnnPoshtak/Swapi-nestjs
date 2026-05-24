import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Character } from 'src/seed/entities/people';

@Entity('people_images')
export class PeopleImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({name: "original-name"})
  originalName: string;

  @ManyToOne(() => Character, (character) => character.images, { onDelete: 'CASCADE' })
  character: Character;
}