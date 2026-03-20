import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { Amenity } from "./entities/amenity.entity";
import { AmenityFilterDto, CreateAmenityDto } from "./dto/create-amenity.dto";
import { UpdateAmenityDto } from "./dto/update-amenity.dto";

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepo: Repository<Amenity>,
  ) {}

  // ─── Yaratish ─────────────────────────────────────────────────────────────

  async create(dto: CreateAmenityDto): Promise<Amenity> {
    const existing = await this.amenityRepo.findOne({
      where: { name: dto.name } as any,
    });
    if (existing) {
      throw new ConflictException(`"${dto.name}" nomli qulaylik allaqachon mavjud`);
    }

    const amenity = this.amenityRepo.create({
      ...dto,
      category: dto.category ?? "general",
    });

    return this.amenityRepo.save(amenity);
  }

  // ─── Barchasi ─────────────────────────────────────────────────────────────

  async findAll(filter: AmenityFilterDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.amenityRepo.createQueryBuilder("amenity");

    if (filter.search) {
      qb.andWhere(
        "amenity.name ILIKE :s OR amenity.description ILIKE :s",
        { s: `%${filter.search}%` },
      );
    }

    if (filter.category) {
      qb.andWhere("amenity.category = :category", { category: filter.category });
    }

    if (filter.isActive !== undefined) {
      qb.andWhere("amenity.isActive = :isActive", { isActive: filter.isActive });
    }

    const [data, total] = await qb
      .orderBy("amenity.category", "ASC")
      .addOrderBy("amenity.name", "ASC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // ─── Kategoriya bo'yicha ───────────────────────────────────────────────────

  async findByCategory(): Promise<Record<string, Amenity[]>> {
    const amenities = await this.amenityRepo.find({
      where: { isActive: true } as any,
      order: { name: "ASC" },
    });

    return amenities.reduce(
      (acc, amenity) => {
        const cat = amenity.category ?? "general";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(amenity);
        return acc;
      },
      {} as Record<string, Amenity[]>,
    );
  }

  // ─── Bitta ────────────────────────────────────────────────────────────────

  async findOne(id: string): Promise<Amenity> {
    const amenity = await this.amenityRepo.findOne({
      where: { id } as any,
    });
    if (!amenity) throw new NotFoundException("Qulaylik topilmadi");
    return amenity;
  }

  // ─── Yangilash ────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateAmenityDto): Promise<Amenity> {
    const amenity = await this.findOne(id);

    if (dto.name && dto.name !== amenity.name) {
      const existing = await this.amenityRepo.findOne({
        where: { name: dto.name } as any,
      });
      if (existing) {
        throw new ConflictException(`"${dto.name}" nomli qulaylik allaqachon mavjud`);
      }
    }

    Object.assign(amenity, dto);
    return this.amenityRepo.save(amenity);
  }

  // ─── O'chirish ────────────────────────────────────────────────────────────

  async remove(id: string): Promise<{ message: string }> {
    const amenity = await this.findOne(id);
    await this.amenityRepo.remove(amenity);
    return { message: `"${amenity.name}" qulaylik o'chirildi` };
  }

  // ─── Aktivlashtirish / O'chirish ──────────────────────────────────────────

  async toggleActive(id: string): Promise<Amenity> {
    const amenity = await this.findOne(id);
    amenity.isActive = !amenity.isActive;
    return this.amenityRepo.save(amenity);
  }

  // ─── ID lar bo'yicha topish (Property/Room uchun) ─────────────────────────

  async findByIds(ids: string[]): Promise<Amenity[]> {
    if (!ids || ids.length === 0) return [];
    return this.amenityRepo
      .createQueryBuilder("amenity")
      .whereInIds(ids)
      .getMany();
  }
}