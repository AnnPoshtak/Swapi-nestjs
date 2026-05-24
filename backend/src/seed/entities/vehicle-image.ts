import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from 'src/seed/entities/vehicles';

@Entity('vehicle_images')
export class VehicleImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({name: "original-name"})
  originalName: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.images, { onDelete: 'CASCADE' })
  vehicle: Vehicle;
}
