import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ToursService } from "./tours.service";
import { ToursController } from "./tours.controller";
import { Tour } from "./entities/tour.entity";
import { Tag } from "../tags/entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tour, Tag])],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}