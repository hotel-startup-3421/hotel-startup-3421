import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Property } from "./entities/property.entity";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  create(dto: CreatePropertyDto) {
    const property = this.propertyRepo.create(dto);
    return this.propertyRepo.save(property);
  }

  findAll() {
    return this.propertyRepo.find();
  }

  findFeatured() {
    return this.propertyRepo.find({
      where: { isFeatured: true },
    });
  }

  findOne(id: number) {
    return this.propertyRepo.findOne({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.propertyRepo.findOne({ where: { slug } });
  }

  update(id: number, dto: UpdatePropertyDto) {
    return this.propertyRepo.update(id, dto);
  }

  publish(id: number) {
    return this.propertyRepo.update(id, { isActive: true });
  }

  remove(id: number) {
    return this.propertyRepo.delete(id);
  }
}