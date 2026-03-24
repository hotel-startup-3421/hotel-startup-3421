import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment, PaymentProvider, PaymentMethod } from "./entities/payment.entity";
import { PaymentStatus } from "../../common/enums/payment-status.enum";
import { ClickCallbackDto, InitiatePaymentDto, PaymeCallbackDto, PaymentFilterDto } from "./dto/create-payment.dto";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  // ─── To'lovni boshlash ────────────────────────────────────────────────────

  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
    // Mavjud pending to'lovni tekshirish
    const existing = await this.paymentRepo
      .createQueryBuilder("payment")
      .where("payment.bookingId = :bookingId", { bookingId: dto.bookingId })
      .andWhere("payment.status = :status", { status: PaymentStatus.PENDING })
      .getOne();

    if (existing) {
      return this.buildPaymentUrl(existing);
    }

    // Bron narxini olish — BookingService orqali yoki join bilan
    const booking = await this.paymentRepo.manager.findOne("Booking", {
      where: { id: dto.bookingId } as any,
    }) as any;

    if (!booking) throw new NotFoundException("Bron topilmadi");
    if (booking.userId !== userId) {
      throw new BadRequestException("Bu bron sizga tegishli emas");
    }

    const payment = this.paymentRepo.create({
      userId,
      bookingId: dto.bookingId,
      amount: booking.finalPrice,
      currency: dto.currency ?? "USD",
      provider: dto.provider,
      method: dto.method,
      status: PaymentStatus.PENDING,
    });

    const saved = await this.paymentRepo.save(payment);
    return this.buildPaymentUrl(saved);
  }

  // ─── Payme callback ───────────────────────────────────────────────────────

  async handlePaymeCallback(dto: PaymeCallbackDto) {
    const { method, params } = dto;

    switch (method) {
      case "CheckPerformTransaction":
        return this.paymeCheck(params);
      case "CreateTransaction":
        return this.paymeCreate(params);
      case "PerformTransaction":
        return this.paymePerform(params);
      case "CancelTransaction":
        return this.paymeCancel(params);
      case "CheckTransaction":
        return this.paymeCheckTransaction(params);
      default:
        return { error: { code: -32601, message: "Method not found" } };
    }
  }

  private async paymeCheck(params: Record<string, unknown>) {
    const orderId = (params.account as Record<string, unknown>)?.order_id as string;
    const payment = await this.paymentRepo.findOne({ where: { id: orderId } as any });
    if (!payment) return { error: { code: -31050, message: "Order not found" } };
    return { result: { allow: true } };
  }

  private async paymeCreate(params: Record<string, unknown>) {
    const orderId = (params.account as Record<string, unknown>)?.order_id as string;
    const payment = await this.paymentRepo.findOne({ where: { id: orderId } as any });
    if (!payment) return { error: { code: -31050, message: "Order not found" } };

    (payment as any).transactionId = params.id as string;
    (payment as any).providerOrderId = params.id as string;
    await this.paymentRepo.save(payment);

    return {
      result: {
        create_time: Date.now(),
        transaction: params.id,
        state: 1,
      },
    };
  }

  private async paymePerform(params: Record<string, unknown>) {
    const payment = await this.paymentRepo.findOne({
      where: { transactionId: params.id as string } as any,
    });
    if (!payment) return { error: { code: -31003, message: "Transaction not found" } };

    (payment as any).status = PaymentStatus.PAID;
    (payment as any).paidAt = new Date();
    (payment as any).providerResponse = params;
    await this.paymentRepo.save(payment);

    return {
      result: {
        transaction: params.id,
        perform_time: Date.now(),
        state: 2,
      },
    };
  }

  private async paymeCancel(params: Record<string, unknown>) {
    const payment = await this.paymentRepo.findOne({
      where: { transactionId: params.id as string } as any,
    });
    if (!payment) return { error: { code: -31003, message: "Transaction not found" } };

    (payment as any).status = PaymentStatus.FAILED;
    (payment as any).failReason = `Payme cancel: reason ${params.reason}`;
    await this.paymentRepo.save(payment);

    return {
      result: {
        transaction: params.id,
        cancel_time: Date.now(),
        state: -1,
      },
    };
  }

  private async paymeCheckTransaction(params: Record<string, unknown>) {
    const payment = await this.paymentRepo.findOne({
      where: { transactionId: params.id as string } as any,
    });
    if (!payment) return { error: { code: -31003, message: "Transaction not found" } };
    return { result: { create_time: 0, perform_time: 0, cancel_time: 0, transaction: params.id, state: 1, reason: null } };
  }

  // ─── Click callback ───────────────────────────────────────────────────────

  async handleClickCallback(dto: ClickCallbackDto) {
    const payment = await this.paymentRepo.findOne({
      where: { id: dto.merchant_trans_id } as any,
    });

    if (!payment) {
      return { error: -5, error_note: "Payment not found" };
    }

    // action=0 → prepare, action=1 → complete
    if (dto.action === 0) {
      (payment as any).providerOrderId = String(dto.click_trans_id);
      await this.paymentRepo.save(payment);
      return {
        click_trans_id: dto.click_trans_id,
        merchant_trans_id: dto.merchant_trans_id,
        merchant_prepare_id: (payment as any).id,
        error: 0,
        error_note: "Success",
      };
    }

    if (dto.action === 1) {
      if (dto.error < 0) {
        (payment as any).status = PaymentStatus.FAILED;
        (payment as any).failReason = dto.error_note;
      } else {
        (payment as any).status = PaymentStatus.PAID;
        (payment as any).paidAt = new Date();
        (payment as any).transactionId = String(dto.click_trans_id);
      }
      await this.paymentRepo.save(payment);
      return {
        click_trans_id: dto.click_trans_id,
        merchant_trans_id: dto.merchant_trans_id,
        error: 0,
        error_note: "Success",
      };
    }

    return { error: -3, error_note: "Action not supported" };
  }

  // ─── Foydalanuvchi to'lovlari ─────────────────────────────────────────────

  async findMyPayments(userId: string, filter: PaymentFilterDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.paymentRepo
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.booking", "booking")
      .where("payment.userId = :userId", { userId });

    if (filter.status) qb.andWhere("payment.status = :status", { status: filter.status });
    if (filter.provider) qb.andWhere("payment.provider = :provider", { provider: filter.provider });

    const [data, total] = await qb
      .orderBy("payment.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }

  // ─── Bitta to'lov ─────────────────────────────────────────────────────────

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id } as any,
      relations: ["booking", "user"],
    });
    if (!payment) throw new NotFoundException("To'lov topilmadi");
    return payment;
  }

  // ─── To'lov URL yaratish ──────────────────────────────────────────────────

  private buildPaymentUrl(payment: Payment) {
    const amountInTiyin = Math.round((payment as any).amount * 100);
    const paymeBase = process.env.PAYME_URL ?? "https://checkout.paycom.uz";
    const clickBase = process.env.CLICK_URL ?? "https://my.click.uz/services/pay";

    let paymentUrl = "";

    switch ((payment as any).provider) {
      case PaymentProvider.PAYME:
        const paymeParams = Buffer.from(
          `m=${process.env.PAYME_MERCHANT_ID};ac.order_id=${(payment as any).id};a=${amountInTiyin}`,
        ).toString("base64");
        paymentUrl = `${paymeBase}/${paymeParams}`;
        break;

      case PaymentProvider.CLICK:
        paymentUrl =
          `${clickBase}?service_id=${process.env.CLICK_SERVICE_ID}` +
          `&merchant_id=${process.env.CLICK_MERCHANT_ID}` +
          `&amount=${(payment as any).amount}` +
          `&transaction_param=${(payment as any).id}` +
          `&return_url=${process.env.FRONTEND_URL}/bookings`;
        break;

      default:
        paymentUrl = `${process.env.FRONTEND_URL}/payment/${(payment as any).id}`;
    }

    return {
      paymentId: (payment as any).id,
      paymentUrl,
      amount: (payment as any).amount,
      currency: (payment as any).currency,
      provider: (payment as any).provider,
    };
  }
}