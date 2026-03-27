import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Room } from "./entities/room.entity";
import { Property } from "../properties/entities/property.entity";
import { RoomsService } from "./rooms.service";
import { RoomsController } from "./rooms.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Property])],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}