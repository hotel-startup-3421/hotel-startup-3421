import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';

import { Restaurant, Tag } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private repo: Repository<Restaurant>,

    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateRestaurantDto) {
    let tags: Tag[] = [];

    if (dto.tags && dto.tags.length > 0) {
      tags = await this.tagRepo.findBy({
        id: In(dto.tags),
      });
    }

    const restaurant = this.repo.create({
      ...dto,
      tags,
    });

    return this.repo.save(restaurant);
  }

  async findAll(query: any) {
    const {
      cuisine,
      price,
      search,
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (cuisine) where.cuisineType = cuisine;
    if (price) where.priceRange = price;

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['tags'],
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findFeatured() {
    return this.repo.find({
      where: { isFeatured: true },
      relations: ['tags'],
    });
  }

  async findOne(id: string) {
    const restaurant = await this.repo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant topilmadi');
    }

    return restaurant;
  }

  async findBySlug(slug: string) {
    const restaurant = await this.repo.findOne({
      where: { slug },
      relations: ['tags'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant topilmadi');
    }

    return restaurant;
  }

  async update(id: string, dto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);

    if (dto.tags) {
      restaurant.tags = await this.tagRepo.findBy({
        id: In(dto.tags),
      });
    }

    Object.assign(restaurant, dto);

    return this.repo.save(restaurant);
  }

  async publish(id: string) {
    const restaurant = await this.findOne(id);

    restaurant.isActive = true;

    return this.repo.save(restaurant);
  }

  async remove(id: string) {
    const restaurant = await this.findOne(id);

    return this.repo.remove(restaurant);
  }
}