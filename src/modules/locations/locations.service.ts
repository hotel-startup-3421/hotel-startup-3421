import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "./entities/location.entity";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(dto);
    return this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find({
      order: { country: "ASC", city: "ASC" },
    });
  }

  async findCities(): Promise<string[]> {
    const locations = await this.locationRepository
      .createQueryBuilder("location")
      .select("DISTINCT location.city", "city")
      .orderBy("location.city", "ASC")
      .getRawMany();

    return locations.map((l) => l.city);
  }

  async findCountries(): Promise<string[]> {
    const locations = await this.locationRepository
      .createQueryBuilder("location")
      .select("DISTINCT location.country", "country")
      .orderBy("location.country", "ASC")
      .getRawMany();

    return locations.map((l) => l.country);
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });

    if (!location) throw new NotFoundException("Manzil topilmadi");

    return location;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);
    Object.assign(location, dto);
    return this.locationRepository.save(location);
  }

  async remove(id: string): Promise<{ message: string }> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
    return { message: "Manzil o'chirildi" };
  }
}