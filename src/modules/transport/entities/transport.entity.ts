import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from '../../locations/entities/location.entity';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('transport')
export class Transport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['taxi', 'bus', 'transfer', 'rent'],
  })
  type: string;

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @Column({ type: 'float', default: 0 })
  pricePerDay: number;

  @Column({ type: 'float', default: 0 })
  pricePerKm: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Location, { nullable: true })
  location: Location;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: 'transport_tags',
    joinColumn: { name: 'transport_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}