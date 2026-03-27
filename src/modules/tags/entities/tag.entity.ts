export class Tag {}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('tags')
export class TagEntity {
  @ApiProperty({ example: 1, description: 'ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tarixiy', description: 'Teg nomi' })
  @Column()
  name: string;

  @ApiProperty({ example: 'tarixiy', description: 'Slug (URL uchun)' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ example: '#6366f1', description: 'Rang kodi' })
  @Column({ default: '#6366f1' })
  color: string;

  @ApiProperty({ example: 'Joylashuv turi', description: 'Kategoriya' })
  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}