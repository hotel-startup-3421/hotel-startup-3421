import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly repo: Repository<Coupon>,
  ) {}

  async create(dto: CreateCouponDto, userId: string) {
    const coupon = this.repo.create({
      ...dto,
      createdBy: { id: userId } as any,
    });
    return await this.repo.save(coupon);
  }

  async findAll() {
    return await this.repo.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

 async validate(code: string, amount: number) {
  // 1. Agar code yoki amount kelmasa, darrov xato qaytarish
  if (!code || amount === undefined) {
    throw new BadRequestException('Kupon kodi va summa kiritilishi shart');
  }

  const coupon = await this.repo.findOne({ where: { code, isActive: true } });

  if (!coupon) {
    throw new NotFoundException('Kupon topilmadi yoki faol emas');
  }
  
  // Qolgan tekshiruvlar...
  const now = new Date();
  if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
    throw new BadRequestException('Kupon muddati yaroqsiz');
  }

  if (Number(coupon.usedCount) >= Number(coupon.maxUses)) {
    throw new BadRequestException('Kupon foydalanish limiti tugagan');
  }

  if (Number(amount) < Number(coupon.minOrderAmount)) {
    throw new BadRequestException(`Minimal buyurtma miqdori: ${coupon.minOrderAmount}`);
  }

  return coupon;
}

  async update(id: number, dto: UpdateCouponDto) {
    const coupon = await this.repo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Kupon topilmadi');
    
    Object.assign(coupon, dto);
    return await this.repo.save(coupon);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Kupon topilmadi');
    return { success: true };
  }
}