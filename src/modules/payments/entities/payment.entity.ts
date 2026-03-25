export class Payment {
}

@Entity("payments")
export class Payment {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // ─── Foydalanuvchi ────────────────────────────────────────────────────────

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  // ─── Bron ─────────────────────────────────────────────────────────────────

  @OneToOne(() => Booking, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Column()
  bookingId: string;

  // ─── To'lov ma'lumotlari ──────────────────────────────────────────────────

  @ApiProperty({ example: 432.0 })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ example: "USD" })
  @Column({ default: "USD" })
  currency: string;

  @ApiProperty({ enum: PaymentStatus })
  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({ enum: PaymentProvider })
  @Column({
    type: "enum",
    enum: PaymentProvider,
    default: PaymentProvider.MANUAL,
  })
  provider: PaymentProvider;

  @ApiProperty({ enum: PaymentMethod })
  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.CARD,
  })
  method: PaymentMethod;

  // ─── Provider ma'lumotlari ────────────────────────────────────────────────

  @ApiPropertyOptional({ example: "payme_txn_123456" })
  @Column({ nullable: true })
  transactionId: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  providerOrderId: string;

  @ApiPropertyOptional()
  @Column({ nullable: true, type: "jsonb" })
  providerResponse: Record<string, unknown>;

  // ─── Vaqtlar ──────────────────────────────────────────────────────────────

  @ApiPropertyOptional()
  @Column({ nullable: true })
  paidAt: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  refundedAt: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true, type: "text" })
  failReason: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}