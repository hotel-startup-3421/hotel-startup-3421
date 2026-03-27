import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { AvailabilityService } from "./availability.service";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";

@Controller("availability")
export class AvailabilityController {

  constructor(private readonly service: AvailabilityService) {}

  @Get("room/:roomId")
  findByRoom(
    @Param("roomId") roomId: number,
    @Query("startDate") startDate: Date,
    @Query("endDate") endDate: Date,
  ) {
    return this.service.findByRoom(roomId, startDate, endDate);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAvailabilityDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.service.remove(id);
  }
}