import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Room } from "../../rooms/entities/room.entity";

@Entity("availability")
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date: Date;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: "decimal", nullable: true })
  price: number;

  @ManyToOne(() => Room, { onDelete: "CASCADE" })
  room: Room;
}