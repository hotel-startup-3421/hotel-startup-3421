import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const exists = await this.categoryRepo.findOne({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Category already exists');
    }

    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.name && dto.name !== category.name) {
      const exists = await this.categoryRepo.findOne({
        where: { name: dto.name },
      });

      if (exists) {
        throw new ConflictException('Category name already exists');
      }
    }

    Object.assign(category, dto);

    return await this.categoryRepo.save(category);
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);

    await this.categoryRepo.remove(category);

    return { message: 'Category deleted successfully' };
  }
}