import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity("amenities")
export class Amenity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ example: "Wifi" })
  @Column({ unique: true })
  name: string;

  @ApiPropertyOptional({ example: "Bepul internet ulanish" })
  @Column({ nullable: true })
  description: string;

  @ApiPropertyOptional({ example: "wifi" })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({ example: "general", default: "general" })
  @Column({ default: "general" })
  category: string;

  @ApiProperty({ default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}