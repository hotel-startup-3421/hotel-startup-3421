import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BookingStatus } from "src/common/enums/booking-status.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { UserRole } from "src/common/enums/user-role.enum";

// ─── User ─────────────────────────────────────────────────────────────────────

export class AdminUserResponseDto {
  @ApiProperty({ example: "uuid-here" })
  id: string;

  @ApiProperty({ example: "alisher@gmail.com" })
  email: string;

  @ApiProperty({ example: "Alisher" })
  firstName: string;

  @ApiProperty({ example: "Navoiy" })
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.GUEST })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isVerified: boolean;

  @ApiProperty({ example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiPropertyOptional({ example: "+998901234567" })
  phone?: string;

  @ApiPropertyOptional({ example: "https://..." })
  avatar?: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export class AdminBookingResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: BookingStatus }) status: BookingStatus;
  @ApiProperty() checkIn: Date;
  @ApiProperty() checkOut: Date;
  @ApiProperty() totalPrice: number;
  @ApiProperty() createdAt: Date;
  @ApiPropertyOptional() user?: AdminUserResponseDto;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export class AdminPaymentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: PaymentStatus }) status: PaymentStatus;
  @ApiProperty() amount: number;
  @ApiProperty() currency: string;
  @ApiProperty() createdAt: Date;
  @ApiPropertyOptional() user?: AdminUserResponseDto;
}

// ─── Property ─────────────────────────────────────────────────────────────────

export class AdminPropertyResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() isVerified: boolean;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: Date;
  @ApiPropertyOptional() owner?: AdminUserResponseDto;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export class DashboardStatsDto {
  @ApiProperty({ example: 1240 }) totalUsers: number;
  @ApiProperty({ example: 12 })   newUsersToday: number;
  @ApiProperty({ example: 980 })  activeUsers: number;
  @ApiProperty({ example: 340 })  totalBookings: number;
  @ApiProperty({ example: 45 })   pendingBookings: number;
  @ApiProperty({ example: 210 })  confirmedBookings: number;
  @ApiProperty({ example: 85 })   cancelledBookings: number;
  @ApiProperty({ example: 58000 }) totalRevenue: number;
  @ApiProperty({ example: 4200 }) revenueThisMonth: number;
  @ApiProperty({ example: 120 })  totalProperties: number;
  @ApiProperty({ example: 8 })    pendingProperties: number;
  @ApiProperty({ example: 60 })   totalTours: number;
  @ApiProperty({ example: 530 })  totalReviews: number;
  @ApiProperty({ example: 290 })  totalPayments: number;
}

// ─── Revenue Chart ────────────────────────────────────────────────────────────

export class RevenueChartDto {
  @ApiProperty({ example: ["2024-01-01", "2024-01-02"], isArray: true })
  labels: string[];

  @ApiProperty({ example: [1200, 3400], isArray: true })
  revenue: number[];

  @ApiProperty({ example: [5, 12], isArray: true })
  bookings: number[];
}

// ─── Paginated response ───────────────────────────────────────────────────────

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })   page: number;
  @ApiProperty({ example: 10 })  limit: number;
  @ApiProperty({ example: 100 }) total: number;
  @ApiProperty({ example: 10 })  totalPages: number;
  @ApiProperty({ example: true }) hasNext: boolean;
  @ApiProperty({ example: false }) hasPrev: boolean;
}

// Generic wrapper — Swagger uchun konkret classlarni ishlatish tavsiya qilinadi
export class AdminPaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

// Swagger @ApiResponse uchun tayyor konkret classlar
export class PaginatedUsersResponseDto extends AdminPaginatedResponseDto<AdminUserResponseDto> {
  @ApiProperty({ type: AdminUserResponseDto, isArray: true })
  declare data: AdminUserResponseDto[];
}

export class PaginatedBookingsResponseDto extends AdminPaginatedResponseDto<AdminBookingResponseDto> {
  @ApiProperty({ type: AdminBookingResponseDto, isArray: true })
  declare data: AdminBookingResponseDto[];
}

export class PaginatedPaymentsResponseDto extends AdminPaginatedResponseDto<AdminPaymentResponseDto> {
  @ApiProperty({ type: AdminPaymentResponseDto, isArray: true })
  declare data: AdminPaymentResponseDto[];
}

export class PaginatedPropertiesResponseDto extends AdminPaginatedResponseDto<AdminPropertyResponseDto> {
  @ApiProperty({ type: AdminPropertyResponseDto, isArray: true })
  declare data: AdminPropertyResponseDto[];
}