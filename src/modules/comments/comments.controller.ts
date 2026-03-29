import { 
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments (Sharhlar)')
@Controller('comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi sharh yoki javob qoldirish' })
  @ApiResponse({ status: 201, description: 'Sharh yaratildi.' })
  create(@Body() dto: CreateCommentDto) {
    return this.service.create(dto);
  }

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Entity bo\'yicha tasdiqlangan barcha sharhlarni olish' })
  @ApiParam({ name: 'entityType', enum: ['attraction', 'tour', 'restaurant'] })
  findAll(
    @Param('entityType') type: string, 
    @Param('entityId', ParseIntPipe) id: number
  ) {
    return this.service.findAllByEntity(type, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sharh matnini tahrirlash' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateCommentDto
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Sharhni tasdiqlash (Faqat Admin uchun)' })
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.service.approve(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Sharhni butunlay o\'chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
