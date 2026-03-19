import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { UserRole } from "src/common/enums/user-role.enum";
import { BookingStatus } from "src/common/enums/booking-status.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { ContentStatus, StatsPeriod } from "src/common/enums/admin-action.enum";

// ─── Admin Login ──────────────────────────────────────────────────────────────

export class AdminLoginDto {
  @ApiProperty({ example: "admin@visituzbekistan.uz" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Admin@12345" })
  @IsString()
  password: string;
}

// ─── Pagination (baza) ────────────────────────────────────────────────────────

export class AdminPaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export class AdminUpdateUserDto {
  @ApiPropertyOptional({ example: "Alisher" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: "Navoiy" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: "alisher@gmail.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.GUEST })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class AdminUsersFilterDto extends AdminPaginationDto {
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.GUEST })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ example: "alisher" })
  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminBanUserDto {
  @ApiPropertyOptional({ example: "Qoidalarni buzish" })
  @IsOptional()
  @IsString()
  reason?: string;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export class AdminBookingsFilterDto extends AdminPaginationDto {
  @ApiPropertyOptional({ enum: BookingStatus, example: BookingStatus.PENDING })
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

  @ApiPropertyOptional({ example: "Toshkent" })
  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminUpdateBookingDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiPropertyOptional({ example: "Admin tomonidan tasdiqlandi" })
  @IsOptional()
  @IsString()
  adminNote?: string;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export class AdminPaymentsFilterDto extends AdminPaginationDto {
  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.PAID })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ example: "2024-01-01" })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: "2024-12-31" })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}

// ─── Properties ───────────────────────────────────────────────────────────────

export class AdminPropertiesFilterDto extends AdminPaginationDto {
  @ApiPropertyOptional({ enum: ContentStatus, example: ContentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ example: "Samarqand" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVerified?: boolean;
}

export class AdminVerifyPropertyDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isVerified: boolean;

  @ApiPropertyOptional({ example: "Hujjatlar tekshirildi" })
  @IsOptional()
  @IsString()
  note?: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export class AdminStatsQueryDto {
  @ApiPropertyOptional({
    enum: StatsPeriod,
    default: StatsPeriod.MONTH,
    example: StatsPeriod.MONTH,
  })
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod = StatsPeriod.MONTH;
}