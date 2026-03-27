import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  country: string;

  @Column({ type: "varchar", nullable: true })
  region: string | null;

  @Column({ type: "varchar" })
  @Index()
  city: string;

  @Column({ type: "varchar", nullable: true })
  district: string | null;

  @Column({ type: "varchar", nullable: true })
  address: string | null;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude: number | null;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude: number | null;

  @Column({ type: "varchar", nullable: true })
  zipCode: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations — keyinroq ochiladi
  // @OneToMany(() => Property, (property) => property.location)
  // properties: Property[];

  // @OneToMany(() => Attraction, (attraction) => attraction.location)
  // attractions: Attraction[];

  // @OneToMany(() => Restaurant, (restaurant) => restaurant.location)
  // restaurants: Restaurant[];

  // @OneToMany(() => Tour, (tour) => tour.location)
  // tours: Tour[];
}