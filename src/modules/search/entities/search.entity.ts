import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('search_history')
export class SearchEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tours' })
  @Column()
  query: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('tags')
export class TagEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tarixiy' })
  @Column()
  name: string;

  @ApiProperty({ example: 'tarixiy' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ example: '#FF5733' })
  @Column({ default: '#FF5733' })
  color: string;

  @ApiProperty({ example: 'Joylashuv turi' })
  @Column()
  category: string; // Masalan: "Joylashuv turi", "Narx", "Kimlar uchun"

  @CreateDateColumn()
  createdAt: Date;
}