import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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
