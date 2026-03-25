import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attraction } from './entities/attraction.entity';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';

@Injectable()
export class AttractionsService {
  constructor(
    @InjectRepository(Attraction)
    private attractionRepo: Repository<Attraction>,
  ) {}

  async create(dto: CreateAttractionDto) {
    const attraction = this.attractionRepo.create(dto);
    return this.attractionRepo.save(attraction);
  }

  async findAll() {
    return this.attractionRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const attraction = await this.attractionRepo.findOne({
      where: { id },
    });

    if (!attraction) {
      throw new NotFoundException('Attraction not found');
    }

    return attraction;
  }

  async update(id: number, dto: UpdateAttractionDto) {
    const attraction = await this.findOne(id);

    Object.assign(attraction, dto);

    return this.attractionRepo.save(attraction);
  }

  async remove(id: number) {
    const attraction = await this.findOne(id);

    await this.attractionRepo.remove(attraction);

    return { message: 'Attraction deleted successfully' };
  }
}