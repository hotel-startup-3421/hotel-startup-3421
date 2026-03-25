import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Booking } from "./entities/booking.entity";
import { BookingStatus } from "../../common/enums/booking-status.enum";
import { BookingFilterDto, CancelBookingDto, CreateBookingDto } from "./dto/create-booking.dto";
import { APP_CONSTANTS } from "src/common/constants/app.constants";

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  // ─── Bron yaratish ────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateBookingDto): Promise<Booking> {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    // Sanani tekshirish
    if (checkIn >= checkOut) {
      throw new BadRequestException("Chiqish sanasi kirish sanasidan keyin bo'lishi kerak");
    }
    if (checkIn < new Date()) {
      throw new BadRequestException("O'tib ketgan sanaga bron qilib bo'lmaydi");
    }

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (nights < APP_CONSTANTS.BOOKING.MIN_NIGHTS) {
      throw new BadRequestException(`Minimum ${APP_CONSTANTS.BOOKING.MIN_NIGHTS} kecha bo'lishi kerak`);
    }
    if (nights > APP_CONSTANTS.BOOKING.MAX_NIGHTS) {
      throw new BadRequestException(`Maximum ${APP_CONSTANTS.BOOKING.MAX_NIGHTS} kecha bo'lishi mumkin`);
    }

    // Mavjud bronni tekshirish
    const conflict = await this.bookingRepo
      .createQueryBuilder("booking")
      .where("booking.roomId = :roomId", { roomId: dto.roomId })
      .andWhere("booking.status NOT IN (:...statuses)", {
        statuses: [BookingStatus.CANCELLED, BookingStatus.REJECTED],
      })
      .andWhere("booking.checkIn < :checkOut", { checkOut })
      .andWhere("booking.checkOut > :checkIn", { checkIn })
      .getOne();

    if (conflict) {
      throw new BadRequestException("Bu sanalar uchun xona allaqachon band");
    }

    // Xona narxini olish (Room service orqali yoki to'g'ridan)
    // Hozir default narx — keyin Room module bilan integratsiya qilinadi
    const pricePerNight = 100; // Room.pricePerNight dan keladi
    const totalPrice = pricePerNight * nights;

    // Kupon chegirmasi
    let discountPercent = 0;
    // TODO: CouponsService orqali kuponni tekshirish
    if (dto.couponCode) {
      discountPercent = 10; // placeholder
    }

    const finalPrice = totalPrice * (1 - discountPercent / 100);

    const booking = this.bookingRepo.create({
      userId,
      roomId: dto.roomId,
      checkIn,
      checkOut,
      nights,
      adults: dto.adults,
      children: dto.children ?? 0,
      pricePerNight,
      totalPrice,
      discountPercent,
      finalPrice,
      couponCode: dto.couponCode,
      guestNote: dto.guestNote,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  // ─── Foydalanuvchi bronlari ───────────────────────────────────────────────

  async findMyBookings(userId: string, filter: BookingFilterDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.bookingRepo
      .createQueryBuilder("booking")
      .leftJoinAndSelect("booking.room", "room")
      .leftJoinAndSelect("room.property", "property")
      .where("booking.userId = :userId", { userId });

    if (filter.status) {
      qb.andWhere("booking.status = :status", { status: filter.status });
    }
    if (filter.fromDate) {
      qb.andWhere("booking.checkIn >= :from", { from: filter.fromDate });
    }
    if (filter.toDate) {
      qb.andWhere("booking.checkOut <= :to", { to: filter.toDate });
    }

    const [data, total] = await qb
      .orderBy("booking.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return this.paginate(data, total, page, limit);
  }

  // ─── Bitta bron ───────────────────────────────────────────────────────────

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id } as any,
      relations: ["user", "room", "room.property"],
    });
    if (!booking) throw new NotFoundException("Bron topilmadi");
    return booking;
  }

  // ─── Foydalanuvchi o'z bronini ko'radi ───────────────────────────────────

  async findOneForUser(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id);
    if ((booking as any).userId !== userId) {
      throw new ForbiddenException("Bu bron sizga tegishli emas");
    }
    return booking;
  }

  // ─── Bronni bekor qilish ─────────────────────────────────────────────────

  async cancel(id: string, userId: string, dto: CancelBookingDto): Promise<Booking> {
    const booking = await this.findOneForUser(id, userId);

    if ((booking as any).status === BookingStatus.CANCELLED) {
      throw new BadRequestException("Bron allaqachon bekor qilingan");
    }
    if ((booking as any).status === BookingStatus.COMPLETED) {
      throw new BadRequestException("Yakunlangan bronni bekor qilib bo'lmaydi");
    }

    // 24 soat qoidasi
    const checkIn = new Date((booking as any).checkIn);
    const hoursLeft = (checkIn.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursLeft < APP_CONSTANTS.BOOKING.CANCELLATION_HOURS) {
      throw new BadRequestException(
        `Kirishdan ${APP_CONSTANTS.BOOKING.CANCELLATION_HOURS} soat oldin bekor qilish mumkin`,
      );
    }

    (booking as any).status = BookingStatus.CANCELLED;
    (booking as any).cancelledAt = new Date();
    (booking as any).cancelReason = dto.reason ?? null;

    return this.bookingRepo.save(booking);
  }

  // ─── Xona mavjudligini tekshirish ─────────────────────────────────────────

  async checkAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const conflict = await this.bookingRepo
      .createQueryBuilder("booking")
      .where("booking.roomId = :roomId", { roomId })
      .andWhere("booking.status NOT IN (:...statuses)", {
        statuses: [BookingStatus.CANCELLED, BookingStatus.REJECTED],
      })
      .andWhere("booking.checkIn < :checkOut", { checkOut })
      .andWhere("booking.checkOut > :checkIn", { checkIn })
      .getOne();

    return !conflict;
  }

  // ─── Helper ───────────────────────────────────────────────────────────────

  private paginate<T>(data: T[], total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }
}