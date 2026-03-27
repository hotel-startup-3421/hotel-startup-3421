import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { Guide } from './entities/guide.entity';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.guidesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.guidesService.findBySlug(slug);
  }

  @Post()
  create(@Body() guide: Partial<Guide>) {
    return this.guidesService.create(guide);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Guide>) {
    return this.guidesService.update(id, data);
  }

  @Patch(':id/verify')
  verify(@Param('id') id: string) {
    return this.guidesService.verify(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guidesService.remove(id);
  }
}