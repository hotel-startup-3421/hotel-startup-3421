import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Property } from "../../properties/entities/property.entity";

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  type: string; // single, double, twin, suite, family

  @Column({ type: "decimal", default: 0 })
  pricePerNight: number;

  @Column({ default: 1 })
  capacity: number;

  @Column({ default: 1 })
  totalRooms: number;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  size: number; // m²

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  coverImage: string;

  @ManyToOne(() => Property, { onDelete: "CASCADE" })
  property: Property;
}