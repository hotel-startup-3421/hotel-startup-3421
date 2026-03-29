import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto'

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repo: Repository<Wishlist>,
  ) {}

  async create(dto: CreateWishlistDto, userId: any) {
    // userId ni string ekanligiga ishonch hosil qilamiz
    const sUserId = String(userId);

    const existing = await this.repo.findOne({
      where: { 
        entityType: dto.entityType, 
        entityId: dto.entityId, 
        user: { id: sUserId } as any 
      }
    });

    if (existing) return existing;

    const wishlist = this.repo.create({
      entityType: dto.entityType,
      entityId: dto.entityId,
      user: { id: sUserId } as any
    });

    return await this.repo.save(wishlist);
  }

  async findAll(userId: any) {
    return await this.repo.find({
      where: { user: { id: String(userId) } as any },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number, userId: any) {
    const sUserId = String(userId);
    
    const wishlist = await this.repo.findOne({
      where: { id, user: { id: sUserId } as any }
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist topilmadi yoki sizga tegishli emas');
    }

    await this.repo.remove(wishlist);
    return { success: true };
  }
}