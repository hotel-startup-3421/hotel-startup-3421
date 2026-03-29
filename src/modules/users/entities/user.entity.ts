import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { UserRole } from "../../../common/enums/user-role.enum";
import { Gender } from "src/common/enums/gender.enum";


@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ type: "varchar", unique: true })
  username: string;

  @Index({ unique: true })
  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", nullable: true, select: false })
  password: string | null;

  @Column({ type: "varchar", nullable: true })
  firstName: string | null;

  @Column({ type: "varchar", nullable: true })
  lastName: string | null;

  @Column({ type: "enum", enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Column({ type: "enum", enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "varchar", nullable: true })
  avatar: string | null;

  @Column({ type: "varchar", nullable: true })
  phone: string | null;

  @Column({ type: "varchar", unique: true, nullable: true })
  googleId: string | null;

  @Column({ type: "varchar", unique: true, nullable: true })
  githubId: string | null;

@Column({ type: "varchar", nullable: true,})
otpCode: string | null;

@Column({ type: "timestamp", nullable: true, select: false })
otpExpires: Date | null;

  @Column({ type: "varchar", nullable: true, select: false })
  resetPasswordToken: string | null;

  @Column({ type: "varchar", nullable: true, select: false })
  refreshToken: string | null;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
    wishlists: any;

  // relations — entity lar yozilgach commentdan chiqariladi
  // @OneToMany(() => Property, (property) => property.host)
  // properties: Property[];

  // @OneToMany(() => Booking, (booking) => booking.guest)
  // bookings: Booking[];

  // @OneToMany(() => Review, (review) => review.user)
  // reviews: Review[];

  // @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  // wishlists: Wishlist[];
}