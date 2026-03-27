import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tour, TourStatus } from "./entities/tour.entity";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { generateSlug, generateUniqueSlug } from "../../utils/slug.util";
import { paginateQuery, paginate, PaginationQuery } from "../../utils/pagination.util";

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
  ) {}

  async create(dto: CreateTourDto, userId: string): Promise<Tour> {
    const slug = generateUniqueSlug(dto.title);

    const tour = this.tourRepository.create({
      ...dto,
      slug,
      status: TourStatus.DRAFT,
      location: dto.locationId ? { id: dto.locationId } as any : null,
      category: dto.categoryId ? { id: dto.categoryId } as any : null,
      createdBy: { id: userId } as any,
      tags: dto.tagIds?.map((id) => ({ id })) as any,
    });

    return this.tourRepository.save(tour);
  }

  async findAll(query: PaginationQuery & {
    city?: string;
    categoryId?: string;
    difficulty?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const { skip, take } = paginateQuery(query);

    const qb = this.tourRepository
      .createQueryBuilder("tour")
      .leftJoinAndSelect("tour.location", "location")
      .leftJoinAndSelect("tour.category", "category")
      .leftJoinAndSelect("tour.tags", "tags")
      .where("tour.status = :status", { status: TourStatus.ACTIVE })
      .andWhere("tour.isActive = :isActive", { isActive: true });

    if (query.city) {
      qb.andWhere("location.city ILIKE :city", { city: `%${query.city}%` });
    }

    if (query.categoryId) {
      qb.andWhere("category.id = :categoryId", { categoryId: query.categoryId });
    }

    if (query.difficulty) {
      qb.andWhere("tour.difficulty = :difficulty", { difficulty: query.difficulty });
    }

    if (query.minPrice) {
      qb.andWhere("tour.price >= :minPrice", { minPrice: query.minPrice });
    }

    if (query.maxPrice) {
      qb.andWhere("tour.price <= :maxPrice", { maxPrice: query.maxPrice });
    }

    qb.orderBy("tour.createdAt", "DESC").skip(skip).take(take);

    const [data, total] = await qb.getManyAndCount();

    return paginate(data, total, query);
  }

  async findOne(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: { id },
      relations: ["location", "category", "tags", "createdBy"],
    });

    if (!tour) throw new NotFoundException("Tur topilmadi");

    return tour;
  }

  async findBySlug(slug: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: { slug },
      relations: ["location", "category", "tags"],
    });

    if (!tour) throw new NotFoundException("Tur topilmadi");

    return tour;
  }

  async update(id: string, dto: UpdateTourDto): Promise<Tour> {
    const tour = await this.findOne(id);

    if (dto.title && dto.title !== tour.title) {
      tour.slug = generateUniqueSlug(dto.title);
    }

    if (dto.locationId) {
      tour.location = { id: dto.locationId } as any;
    }

    if (dto.categoryId) {
      tour.category = { id: dto.categoryId } as any;
    }

    if (dto.tagIds) {
      tour.tags = dto.tagIds.map((id) => ({ id })) as any;
    }

    Object.assign(tour, {
      ...dto,
      locationId: undefined,
      categoryId: undefined,
      tagIds: undefined,
    });

    return this.tourRepository.save(tour);
  }

  async publish(id: string): Promise<Tour> {
    const tour = await this.findOne(id);
    tour.status = TourStatus.ACTIVE;
    return this.tourRepository.save(tour);
  }

  async unpublish(id: string): Promise<Tour> {
    const tour = await this.findOne(id);
    tour.status = TourStatus.INACTIVE;
    return this.tourRepository.save(tour);
  }

  async remove(id: string): Promise<{ message: string }> {
    const tour = await this.findOne(id);
    await this.tourRepository.softDelete(tour.id);
    return { message: "Tur o'chirildi" };
  }

  async findFeatured(): Promise<Tour[]> {
    return this.tourRepository.find({
      where: { isFeatured: true, isActive: true, status: TourStatus.ACTIVE },
      relations: ["location", "category"],
      take: 10,
    });
  }
}