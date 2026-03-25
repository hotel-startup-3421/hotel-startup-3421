import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AttractionCategory {
  HISTORICAL = 'historical',
  NATURE = 'nature',
  MODERN = 'modern',
}

@Entity('attractions')
export class Attraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AttractionCategory,
  })
  category: AttractionCategory;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column('decimal', { default: 0 })
  entranceFee: number;

  @Column()
  openingHours: string;

  @Column({ nullable: true })
  image: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column({ type: 'float', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}