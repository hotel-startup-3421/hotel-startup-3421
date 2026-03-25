import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { EntityType } from './entities/image.entity';

@Controller('images')
export class ImagesController {

  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  create(@Body() dto: CreateImageDto) {
    return this.imagesService.create(dto);
  }

  @Get(':entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: EntityType,
    @Param('entityId') entityId: string,
  ) {
    return this.imagesService.findByEntity(entityType, entityId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateImageDto,
  ) {
    return this.imagesService.update(id, dto);
  }

  @Patch(':id/main')
  setMain(@Param('id') id: string) {
    return this.imagesService.setMain(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}