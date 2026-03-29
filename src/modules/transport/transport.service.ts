import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from './entities/transport.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport)
    private readonly transportRepo: Repository<Transport>,
  ) {}

  findAll(filters?: { type?: string; city?: string }) {
    const qb = this.transportRepo.createQueryBuilder('transport')
      .leftJoinAndSelect('transport.location', 'location')
      .leftJoinAndSelect('transport.tags', 'tags');

    if (filters?.type) qb.andWhere('transport.type = :type', { type: filters.type });
    if (filters?.city) qb.andWhere('location.city = :city', { city: filters.city });

    return qb.getMany();
  }

  findOne(id: string) {
    return this.transportRepo.findOne({
      where: { id },
      relations: ['location', 'user', 'tags'],
    });
  }

  create(transport: Partial<Transport>) {
    const newTransport = this.transportRepo.create(transport);
    return this.transportRepo.save(newTransport);
  }

  update(id: string, data: Partial<Transport>) {
    return this.transportRepo.update(id, data);
  }

  remove(id: string) {
    return this.transportRepo.delete(id);
  }
}