import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Availability } from "./entities/availability.entity";
import { Room } from "../rooms/entities/room.entity";
import { AvailabilityService } from "./availability.service";
import { AvailabilityController } from "./availability.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Availability, Room])],
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
})
export class AvailabilityModule {}