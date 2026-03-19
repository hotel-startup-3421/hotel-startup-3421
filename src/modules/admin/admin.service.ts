import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, ILike } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Booking } from "../bookings/entities/booking.entity";
import { Payment } from "../payments/entities/payment.entity";
import { Property } from "../properties/entities/property.entity";
import { Review } from "../reviews/entities/review.entity";
import {
  AdminUpdateUserDto,
  AdminUsersFilterDto,
  AdminBookingsFilterDto,
  AdminPaymentsFilterDto,
  AdminPropertiesFilterDto,
  AdminStatsQueryDto,
  AdminBanUserDto,
  AdminUpdateBookingDto,
  AdminVerifyPropertyDto,
} from "./dto/admin.dto";
import { UserRole } from "../../common/enums/user-role.enum";
import { BookingStatus } from "../../common/enums/booking-status.enum";
import { PaymentStatus } from "../../common/enums/payment-status.enum";
import { StatsPeriod } from "src/common/enums/admin-action.enum";
import { paginateQuery } from "src/utils/pagination.util";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboardStats(query: AdminStatsQueryDto) {
    const dateRange = this.getDateRange(query.period ?? StatsPeriod.MONTH);

    const [
      totalUsers,
      newUsersToday,
      activeUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalProperties,
      pendingProperties,
      totalReviews,
    ] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({
        where: { createdAt: Between(this.startOfDay(), new Date()) },
      }),
      this.userRepo.count({ where: { isActive: true } }),
      this.bookingRepo.count(),
      this.bookingRepo.count({ where: { status: BookingStatus.PENDING } }),
      this.bookingRepo.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.bookingRepo.count({ where: { status: BookingStatus.CANCELLED } }),
      this.propertyRepo.count(),
      this.propertyRepo.count({ where: { isVerified: false } }),
      this.reviewRepo.count(),
    ]);

    const revenueResult = await this.paymentRepo
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.status = :status", { status: PaymentStatus.PAID })
      .getRawOne<{ total: string }>();

    const monthlyRevenueResult = await this.paymentRepo
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.status = :status", { status: PaymentStatus.PAID })
      .andWhere("payment.createdAt BETWEEN :from AND :to", {
        from: dateRange.from,
        to: dateRange.to,
      })
      .getRawOne<{ total: string }>();

    const totalPayments = await this.paymentRepo.count({
      where: { status: PaymentStatus.PAID },
    });

    return {
      totalUsers,
      newUsersToday,
      activeUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue: parseFloat(revenueResult?.total ?? "0"),
      revenueThisMonth: parseFloat(monthlyRevenueResult?.total ?? "0"),
      totalProperties,
      pendingProperties,
      totalReviews,
      totalPayments,
      totalTours: 0,
    };
  }

  async getRevenueChart(period: StatsPeriod = StatsPeriod.MONTH) {
    const { from, to } = this.getDateRange(period);

    const raw = await this.paymentRepo
      .createQueryBuilder("payment")
      .select("DATE(payment.createdAt)", "date")
      .addSelect("SUM(payment.amount)", "revenue")
      .addSelect("COUNT(payment.id)", "bookings")
      .where("payment.status = :status", { status: PaymentStatus.PAID })
      .andWhere("payment.createdAt BETWEEN :from AND :to", { from, to })
      .groupBy("DATE(payment.createdAt)")
      .orderBy("DATE(payment.createdAt)", "ASC")
      .getRawMany<{ date: string; revenue: string; bookings: string }>();

    return {
      labels: raw.map((r) => r.date),
      revenue: raw.map((r) => parseFloat(r.revenue)),
      bookings: raw.map((r) => parseInt(r.bookings)),
    };
  }

  // ─── Users ─────────────────────────────────────────────────────────────────

  async getAllUsers(filter: AdminUsersFilterDto) {
    const { skip, take } = paginateQuery(filter);

    const where: Record<string, unknown> = {};
    if (filter.role) where.role = filter.role;
    if (filter.isActive !== undefined) where.isActive = filter.isActive;
    if (filter.isVerified !== undefined) where.isVerified = filter.isVerified;

    const qb = this.userRepo.createQueryBuilder("user");

    if (filter.search) {
      qb.where(
        "user.firstName ILIKE :s OR user.lastName ILIKE :s OR user.email ILIKE :s",
        { s: `%${filter.search}%` },
      );
    } else {
      qb.where(where);
    }

    const [data, total] = await qb
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return this.buildPaginated(data, total, filter);
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } as any });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");
    return user;
  }

  async updateUser(id: string, dto: AdminUpdateUserDto) {
    const user = await this.getUserById(id);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async banUser(id: string, dto: AdminBanUserDto, adminId: string) {
    const user = await this.getUserById(id);
    if (user.id === adminId)
      throw new ForbiddenException("O'zingizni ban qila olmaysiz");
    if (user.role === UserRole.ADMIN)
      throw new ForbiddenException("Admin foydalanuvchini ban qilib bo'lmaydi");

    user.isActive = false;
    return this.userRepo.save(user);
  }

  async unbanUser(id: string) {
    const user = await this.getUserById(id);
    user.isActive = true;
    return this.userRepo.save(user);
  }

  async deleteUser(id: string, adminId: string) {
    const user = await this.getUserById(id);
    if (user.id === adminId)
      throw new ForbiddenException("O'zingizni o'chira olmaysiz");
    if (user.role === UserRole.ADMIN)
      throw new ForbiddenException("Admin foydalanuvchini o'chirib bo'lmaydi");
    await this.userRepo.remove(user);
    return { message: "Foydalanuvchi o'chirildi" };
  }

  // ─── Bookings ──────────────────────────────────────────────────────────────

  async getAllBookings(filter: AdminBookingsFilterDto) {
    const { skip, take } = paginateQuery(filter);
    const qb = this.bookingRepo
      .createQueryBuilder("booking")
      .leftJoinAndSelect("booking.user", "user")
      .leftJoinAndSelect("booking.room", "room")
      .leftJoinAndSelect("room.property", "property");

    if (filter.status) qb.andWhere("booking.status = :status", { status: filter.status });
    if (filter.fromDate) qb.andWhere("booking.checkIn >= :from", { from: filter.fromDate });
    if (filter.toDate) qb.andWhere("booking.checkOut <= :to", { to: filter.toDate });
    if (filter.search) {
      qb.andWhere(
        "user.firstName ILIKE :s OR user.email ILIKE :s OR property.name ILIKE :s",
        { s: `%${filter.search}%` },
      );
    }

    const [data, total] = await qb
      .orderBy("booking.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return this.buildPaginated(data, total, filter);
  }

  async getBookingById(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id } as any,
      relations: ["user", "room", "room.property"],
    });
    if (!booking) throw new NotFoundException("Bron topilmadi");
    return booking;
  }

  async updateBookingStatus(id: string, dto: AdminUpdateBookingDto) {
    const booking = await this.getBookingById(id);
    booking.status = dto.status;
    return this.bookingRepo.save(booking);
  }

  async cancelBooking(id: string) {
    const booking = await this.getBookingById(id);
    if (booking.status === BookingStatus.CANCELLED)
      throw new BadRequestException("Bron allaqachon bekor qilingan");
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepo.save(booking);
  }

  // ─── Payments ──────────────────────────────────────────────────────────────

  async getAllPayments(filter: AdminPaymentsFilterDto) {
    const { skip, take } = paginateQuery(filter);
    const qb = this.paymentRepo
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.user", "user")
      .leftJoinAndSelect("payment.booking", "booking");

    if (filter.status) qb.andWhere("payment.status = :status", { status: filter.status });
    if (filter.fromDate) qb.andWhere("payment.createdAt >= :from", { from: filter.fromDate });
    if (filter.toDate) qb.andWhere("payment.createdAt <= :to", { to: filter.toDate });

    const [data, total] = await qb
      .orderBy("payment.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return this.buildPaginated(data, total, filter);
  }

  async refundPayment(id: string) {
    const payment = await this.paymentRepo.findOne({ where: { id } as any });
    if (!payment) throw new NotFoundException("To'lov topilmadi");
    if (payment.status !== PaymentStatus.PAID)
      throw new BadRequestException("Faqat to'langan to'lovni qaytarish mumkin");
    payment.status = PaymentStatus.REFUNDED;
    return this.paymentRepo.save(payment);
  }

  // ─── Properties ────────────────────────────────────────────────────────────

  async getAllProperties(filter: AdminPropertiesFilterDto) {
    const { skip, take } = paginateQuery(filter);
    const qb = this.propertyRepo
      .createQueryBuilder("property")
      .leftJoinAndSelect("property.owner", "owner");

    if (filter.isVerified !== undefined)
      qb.andWhere("property.isVerified = :v", { v: filter.isVerified });
    if (filter.search)
      qb.andWhere("property.name ILIKE :s OR owner.email ILIKE :s", { s: `%${filter.search}%` });

    const [data, total] = await qb
      .orderBy("property.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return this.buildPaginated(data, total, filter);
  }

  async verifyProperty(id: string, dto: AdminVerifyPropertyDto) {
    const property = await this.propertyRepo.findOne({ where: { id } as any });
    if (!property) throw new NotFoundException("Mulk topilmadi");
    property.isVerified = dto.isVerified;
    return this.propertyRepo.save(property);
  }

  async deleteProperty(id: string) {
    const property = await this.propertyRepo.findOne({ where: { id } as any });
    if (!property) throw new NotFoundException("Mulk topilmadi");
    await this.propertyRepo.remove(property);
    return { message: "Mulk o'chirildi" };
  }

  // ─── Reviews ───────────────────────────────────────────────────────────────

  async getAllReviews(filter: AdminPaginationDto) {
    const { skip, take } = paginateQuery(filter);
    const [data, total] = await this.reviewRepo.findAndCount({
      relations: ["user", "property"],
      order: { createdAt: "DESC" },
      skip,
      take,
    });
    return this.buildPaginated(data, total, filter);
  }

  async deleteReview(id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } as any });
    if (!review) throw new NotFoundException("Sharh topilmadi");
    await this.reviewRepo.remove(review);
    return { message: "Sharh o'chirildi" };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private buildPaginated<T>(
    data: T[],
    total: number,
    filter: { page?: number; limit?: number },
  ) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  private getDateRange(period: StatsPeriod): { from: Date; to: Date } {
    const to = new Date();
    const from = new Date();

    switch (period) {
      case StatsPeriod.TODAY:
        from.setHours(0, 0, 0, 0);
        break;
      case StatsPeriod.WEEK:
        from.setDate(from.getDate() - 7);
        break;
      case StatsPeriod.MONTH:
        from.setMonth(from.getMonth() - 1);
        break;
      case StatsPeriod.YEAR:
        from.setFullYear(from.getFullYear() - 1);
        break;
      case StatsPeriod.ALL:
        from.setFullYear(2000);
        break;
    }

    return { from, to };
  }

  private startOfDay(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}

// ─── Dummy import to keep TS happy (replace with actual pagination util) ─────
interface AdminPaginationDto {
  page?: number;
  limit?: number;
}