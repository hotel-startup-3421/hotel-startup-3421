import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Image, EntityType } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {

  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) {}

  async create(dto: CreateImageDto): Promise<Image> {

    const image = this.imageRepo.create({
      ...dto,
      isMain: dto.isMain ?? false,
      order: dto.order ?? 0,
    });

    return this.imageRepo.save(image);
  }

  async findByEntity(
    entityType: EntityType,
    entityId: string,
  ): Promise<Image[]> {

    return this.imageRepo.find({
      where: { entityType, entityId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Image> {

    const image = await this.imageRepo.findOneBy({ id });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return image;
  }

  async update(
    id: string,
    dto: UpdateImageDto,
  ): Promise<Image> {

    const image = await this.findOne(id);

    Object.assign(image, dto);

    return this.imageRepo.save(image);
  }

  async setMain(id: string): Promise<Image> {

    const image = await this.findOne(id);

    await this.imageRepo.update(
      {
        entityId: image.entityId,
        entityType: image.entityType,
      },
      { isMain: false },
    );

    image.isMain = true;

    return this.imageRepo.save(image);
  }

  async remove(id: string) {

    const image = await this.findOne(id);

    await this.imageRepo.remove(image);

    return { message: 'Image deleted successfully' };
  }
}