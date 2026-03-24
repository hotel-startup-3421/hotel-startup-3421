import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
  IsUUID,
  Min,
  Max,
  IsInt,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { BookingStatus } from "../../../common/enums/booking-status.enum";

// ─── Create ───────────────────────────────────────────────────────────────────

export class CreateBookingDto {
  @ApiProperty({ example: "uuid-room-id" })
  @IsUUID()
  roomId: string;

  @ApiProperty({ example: "2024-06-01" })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: "2024-06-05" })
  @IsDateString()
  checkOut: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(10)
  adults: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  children?: number;

  @ApiPropertyOptional({ example: "SUMMER10" })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ example: "Erta kirish so'rayman" })
  @IsOptional()
  @IsString()
  guestNote?: string;
}

// ─── Cancel ───────────────────────────────────────────────────────────────────

export class CancelBookingDto {
  @ApiPropertyOptional({ example: "Rejalarim o'zgardi" })
  @IsOptional()
  @IsString()
  @MinLength(3)
  reason?: string;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export class BookingFilterDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ example: "2024-01-01" })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: "2024-12-31" })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export class BookingResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() roomId: string;
  @ApiProperty() checkIn: Date;
  @ApiProperty() checkOut: Date;
  @ApiProperty() nights: number;
  @ApiProperty() adults: number;
  @ApiProperty() children: number;
  @ApiProperty() pricePerNight: number;
  @ApiProperty() totalPrice: number;
  @ApiProperty() discountPercent: number;
  @ApiProperty() finalPrice: number;
  @ApiProperty({ enum: BookingStatus }) status: BookingStatus;
  @ApiPropertyOptional() couponCode?: string;
  @ApiPropertyOptional() guestNote?: string;
  @ApiProperty() createdAt: Date;
}