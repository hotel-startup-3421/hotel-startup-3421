import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guide } from './entities/guide.entity';

@Injectable()
export class GuidesService {
  constructor(
    @InjectRepository(Guide)
    private readonly guideRepo: Repository<Guide>,
  ) {}

  findAll(filters?: { city?: string; language?: string; price?: number }) {
    const qb = this.guideRepo.createQueryBuilder('guide')
      .leftJoinAndSelect('guide.location', 'location')
      .leftJoinAndSelect('guide.tags', 'tags');

    if (filters?.city) qb.andWhere('location.city = :city', { city: filters.city });
    if (filters?.language) qb.andWhere(':language = ANY (guide.languages)', { language: filters.language });
    if (filters?.price) qb.andWhere('guide.pricePerDay <= :price', { price: filters.price });

    return qb.getMany();
  }

  findOne(id: string) {
    return this.guideRepo.findOne({
      where: { id },
      relations: ['location', 'user', 'tags'],
    });
  }

  findBySlug(slug: string) {
    return this.guideRepo.findOne({
      where: { slug },
      relations: ['location', 'user', 'tags'],
    });
  }

  create(guide: Partial<Guide>) {
    const newGuide = this.guideRepo.create(guide);
    return this.guideRepo.save(newGuide);
  }

  update(id: string, updateData: Partial<Guide>) {
    return this.guideRepo.update(id, updateData);
  }

  verify(id: string) {
    return this.guideRepo.update(id, { isVerified: true });
  }

  remove(id: string) {
    return this.guideRepo.delete(id);
  }
}