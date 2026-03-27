import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { PropertiesService } from "./properties.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("featured")
  findFeatured() {
    return this.service.findFeatured();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.service.findOne(id);
  }

  @Get("slug/:slug")
  findSlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() dto: UpdatePropertyDto) {
    return this.service.update(id, dto);
  }

  @Patch(":id/publish")
  publish(@Param("id") id: number) {
    return this.service.publish(id);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.service.remove(id);
  }
}