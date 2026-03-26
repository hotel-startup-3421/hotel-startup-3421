import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  async findAllGrouped() {
    const tags = await this.tagRepository.find();
    
    // Teglarni kategoriyalar bo'yicha guruhlash
    return tags.reduce((acc, tag) => {
      const category = tag.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tag);
      return acc;
    }, {});
  }

  async remove(id: number) {
    const result = await this.tagRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Teg topilmadi');
    return { success: true };
  }
}
