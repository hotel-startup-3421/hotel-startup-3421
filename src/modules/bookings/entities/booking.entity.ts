import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { Room } from "../../rooms/entities/room.entity";
import { BookingStatus } from "../../../common/enums/booking-status.enum";

@Entity("bookings")
export class Booking {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // ─── Foydalanuvchi ────────────────────────────────────────────────────────

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  // ─── Xona ─────────────────────────────────────────────────────────────────

  @ManyToOne(() => Room, { onDelete: "CASCADE" })
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Column()
  roomId: string;

  // ─── Sana ─────────────────────────────────────────────────────────────────

  @ApiProperty({ example: "2024-06-01" })
  @Column({ type: "date" })
  checkIn: Date;

  @ApiProperty({ example: "2024-06-05" })
  @Column({ type: "date" })
  checkOut: Date;

  @ApiProperty({ example: 4 })
  @Column()
  nights: number;

  // ─── Mehmonlar ────────────────────────────────────────────────────────────

  @ApiProperty({ example: 2 })
  @Column({ default: 1 })
  adults: number;

  @ApiPropertyOptional({ example: 1 })
  @Column({ default: 0 })
  children: number;

  // ─── Narx ─────────────────────────────────────────────────────────────────

  @ApiProperty({ example: 120.0 })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerNight: number;

  @ApiProperty({ example: 480.0 })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  @ApiPropertyOptional({ example: 10 })
  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @ApiProperty({ example: 432.0 })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  finalPrice: number;

  // ─── Status ───────────────────────────────────────────────────────────────

  @ApiProperty({ enum: BookingStatus })
  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  // ─── Kupon ────────────────────────────────────────────────────────────────

  @ApiPropertyOptional()
  @Column({ nullable: true })
  couponCode: string;

  // ─── Qo'shimcha ───────────────────────────────────────────────────────────

  @ApiPropertyOptional()
  @Column({ nullable: true, type: "text" })
  guestNote: string;

  @ApiPropertyOptional()
  @Column({ nullable: true, type: "text" })
  adminNote: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  cancelledAt: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true, type: "text" })
  cancelReason: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}