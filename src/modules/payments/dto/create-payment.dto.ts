import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { PaymentProvider, PaymentMethod } from "../entities/payment.entity";
import { PaymentStatus } from "../../../common/enums/payment-status.enum";

// ─── Create (ichki — service tomonidan) ──────────────────────────────────────

export class CreatePaymentDto {
  @ApiProperty() bookingId: string;
  @ApiProperty() userId: string;
  @ApiProperty() amount: number;
  @ApiPropertyOptional() currency?: string;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}

// ─── Payme callback ───────────────────────────────────────────────────────────

export class PaymeCallbackDto {
  @ApiProperty() method: string;
  @ApiProperty() params: Record<string, unknown>;
}

// ─── Click callback ───────────────────────────────────────────────────────────

export class ClickCallbackDto {
  @ApiProperty() click_trans_id: number;
  @ApiProperty() service_id: number;
  @ApiProperty() click_paydoc_id: number;
  @ApiProperty() merchant_trans_id: string;
  @ApiProperty() amount: number;
  @ApiProperty() action: number;
  @ApiProperty() error: number;
  @ApiProperty() error_note: string;
  @ApiProperty() sign_time: string;
  @ApiProperty() sign_string: string;
  @ApiPropertyOptional() merchant_prepare_id?: number;
}

// ─── To'lov boshlash ──────────────────────────────────────────────────────────

export class InitiatePaymentDto {
  @ApiProperty({ example: "uuid-booking-id" })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ enum: PaymentProvider, example: PaymentProvider.PAYME })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ example: "USD" })
  @IsOptional()
  @IsString()
  currency?: string;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export class PaymentFilterDto {
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  limit?: number = 10;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ enum: PaymentProvider })
  @IsOptional()
  @IsEnum(PaymentProvider)
  provider?: PaymentProvider;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export class PaymentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() bookingId: string;
  @ApiProperty() amount: number;
  @ApiProperty() currency: string;
  @ApiProperty({ enum: PaymentStatus }) status: PaymentStatus;
  @ApiProperty({ enum: PaymentProvider }) provider: PaymentProvider;
  @ApiProperty({ enum: PaymentMethod }) method: PaymentMethod;
  @ApiPropertyOptional() transactionId?: string;
  @ApiPropertyOptional() paidAt?: Date;
  @ApiProperty() createdAt: Date;
}

export class InitiatePaymentResponseDto {
  @ApiProperty() paymentId: string;
  @ApiProperty({ description: "To'lov sahifasi URL" }) paymentUrl: string;
  @ApiProperty() amount: number;
  @ApiProperty() currency: string;
  @ApiProperty({ enum: PaymentProvider }) provider: PaymentProvider;
}

// Re-export for convenience
export { PaymentProvider, PaymentMethod };