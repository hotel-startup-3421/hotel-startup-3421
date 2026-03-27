import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  ManyToMany 
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Restaurant } from "../../restaurants/entities/restaurant.entity";

@Entity('tags')
export class Tag {
  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'ID (UUID formatida)' 
  })
  @PrimaryGeneratedColumn('uuid') 
  id: string; 

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

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.tags)
  restaurants: Restaurant[];

  @CreateDateColumn()
  createdAt: Date;
}