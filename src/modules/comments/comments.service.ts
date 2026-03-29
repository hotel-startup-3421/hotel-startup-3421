import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  async create(dto: CreateCommentDto) {
    // Xatolikni oldini olish uchun obyektni tayyorlab olamiz
    const newComment = this.repo.create({
      text: dto.text,
      entityType: dto.entityType,
      entityId: dto.entityId,
      // Agar parentId bo'lsa, uni bog'laymiz
      parentComment: dto.parentId ? ({ id: dto.parentId } as any) : null,
    });

    return await this.repo.save(newComment);
  }

  async findAllByEntity(entityType: string, entityId: number) {
    return await this.repo.find({
      where: { 
        entityType, 
        entityId, 
        isApproved: true // Faqat tasdiqlanganlarni chiqaramiz
      },
      relations: ['replies'], // Ichma-ich javoblarni qo'shib chiqarish
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.repo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Sharh topilmadi');

    // Faqat ruxsat etilgan maydonlarni (text) yangilaymiz
    comment.text = dto.text;
    return await this.repo.save(comment);
  }

  async approve(id: number) {
    const comment = await this.repo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Sharh topilmadi');

    comment.isApproved = true;
    return await this.repo.save(comment);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Sharh topilmadi');
    return { success: true, message: 'Sharh o\'chirildi' };
  }
}
