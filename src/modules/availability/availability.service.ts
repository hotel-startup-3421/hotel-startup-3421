import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Availability } from "./entities/availability.entity";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";
import { Room } from "../rooms/entities/room.entity";

@Injectable()
export class AvailabilityService {

  constructor(
    @InjectRepository(Availability)
    private availabilityRepo: Repository<Availability>,

    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
  ) {}

  async create(dto: CreateAvailabilityDto) {

    const room = await this.roomRepo.findOne({
      where: { id: dto.roomId },
    });

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const availability = this.availabilityRepo.create({
      date: dto.date,
      price: dto.price,
      room,
    });

    return this.availabilityRepo.save(availability);
  }

  findByRoom(roomId: number, startDate: Date, endDate: Date) {

    return this.availabilityRepo.find({
      where: {
        room: { id: roomId },
        date: Between(startDate, endDate),
      },
      relations: ["room"],
    });
  }

  findOne(id: number) {

    return this.availabilityRepo.findOne({
      where: { id },
      relations: ["room"],
    });
  }

  async update(id: number, dto: UpdateAvailabilityDto) {

    const availability = await this.availabilityRepo.findOne({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException("Availability not found");
    }

    Object.assign(availability, dto);

    return this.availabilityRepo.save(availability);
  }

  remove(id: number) {
    return this.availabilityRepo.delete(id);
  }
}