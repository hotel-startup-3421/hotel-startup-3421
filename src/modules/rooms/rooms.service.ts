import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Room } from "./entities/room.entity";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Property } from "../properties/entities/property.entity";

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  async create(dto: CreateRoomDto) {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
    });

    if (!property) throw new NotFoundException("Property not found");

    const room = this.roomRepo.create({
      ...dto,
      property,
    });

    return this.roomRepo.save(room);
  }

  findByProperty(propertyId: number) {
    return this.roomRepo.find({
      where: {
        property: { id: propertyId },
      },
      relations: ["property"],
    });
  }

  findOne(id: number) {
    return this.roomRepo.findOne({
      where: { id },
      relations: ["property"],
    });
  }

  async update(id: number, dto: UpdateRoomDto) {
    const room = await this.roomRepo.findOne({ where: { id } });

    if (!room) throw new NotFoundException("Room not found");

    Object.assign(room, dto);

    return this.roomRepo.save(room);
  }

  remove(id: number) {
    return this.roomRepo.delete(id);
  }
}