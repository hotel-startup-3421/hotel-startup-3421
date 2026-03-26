import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@ApiTags('Search & Tags')
@Controller('search')
export class SearchController { // <--- Mana shu EXPORT so'zi bo'lishi shart!
  constructor(private readonly searchService: SearchService) {}

  @Get('tags')
  @ApiOperation({ summary: 'Teglarni guruhlangan holda olish' })
  async getTags() {
    return this.searchService.getTagsGrouped();
  }

  @Post('tags')
  @ApiOperation({ summary: 'Yangi teg qo`shish' })
  async createTag(@Body() body: any) {
    return this.searchService.createTag(body);
  }

  @Get()
  @ApiOperation({ summary: 'Global qidiruv' })
  async search(@Query() queryDto: SearchQueryDto) {
    return this.searchService.executeSearch(queryDto.q);
  }

  @Get('history')
  @ApiOperation({ summary: 'Qidiruv tarixini ko`rish' })
  async findAll() {
    return this.searchService.getHistory();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Tarixni tahrirlash' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSearchDto: UpdateSearchDto) {
    return this.searchService.updateHistory(id, updateSearchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Tarixni o`chirish' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.searchService.deleteHistory(id);
  }
}