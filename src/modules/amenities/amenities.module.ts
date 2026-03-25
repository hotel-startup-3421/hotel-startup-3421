import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AmenitiesController } from "./amenities.controller";
import { AmenitiesService } from "./amenities.service";
import { Amenity } from "./entities/amenity.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  controllers: [AmenitiesController],
  providers: [AmenitiesService],
  exports: [AmenitiesService], // Property va Room modulelar uchun
})
export class AmenitiesModule {}