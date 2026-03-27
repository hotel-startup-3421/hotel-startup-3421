import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
  Index,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Location } from "../../locations/entities/location.entity";
import { Category } from "../../categories/entities/category.entity";
import { Tag } from "../../tags/entities/tag.entity";

export enum TourDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum TourStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("tours")
export class Tour {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar", unique: true })
  slug: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int" })
  duration: number;

  @Column({ type: "varchar", default: "kun" })
  durationUnit: string;

  @Column({ type: "int" })
  maxGroupSize: number;

  @Column({ type: "int", default: 0 })
  minGroupSize: number;

  @Column({ type: "enum", enum: TourDifficulty, default: TourDifficulty.EASY })
  difficulty: TourDifficulty;

  @Column({ type: "enum", enum: TourStatus, default: TourStatus.DRAFT })
  status: TourStatus;

  @Column({ type: "decimal", precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: "int", default: 0 })
  reviewCount: number;

  @Column({ type: "varchar", nullable: true })
  coverImage: string | null;

  @Column({ type: "text", nullable: true })
  includes: string | null;

  @Column({ type: "text", nullable: true })
  excludes: string | null;

  @Column({ type: "text", nullable: true })
  requirements: string | null;

  @Column({ type: "boolean", default: false })
  isFeatured: boolean;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @ManyToOne(() => Location, { nullable: true, eager: false })
  @JoinColumn()
  location: Location;

  @ManyToOne(() => Category, { nullable: true, eager: false })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn()
  createdBy: User;

  @ManyToMany(() => Tag, { eager: false })
  @JoinTable({ name: "tour_tags" })
  tags: Tag[];

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}