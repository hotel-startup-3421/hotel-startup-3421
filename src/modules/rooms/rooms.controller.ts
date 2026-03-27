import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";

@Controller("rooms")
export class RoomsController {
  constructor(private readonly service: RoomsService) {}

  @Get("property/:propertyId")
  findByProperty(@Param("propertyId") propertyId: number) {
    return this.service.findByProperty(propertyId);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() dto: UpdateRoomDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.service.remove(id);
  }
}