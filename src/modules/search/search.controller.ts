import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';


@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService:SearchService) {}
  @Get()
  @ApiOperation({ summary: 'Global qidiruv'})
  async search(@Query() queryDto:SearchQueryDto){
  return this.searchService.executeSearch(queryDto.q);
}


@Get('history')
@ApiOperation({ summary:'qidiruv tarixi '})
async findAll(){
  return this.searchService.getHistory()
}

@Patch(':id')
@ApiOperation({ summary: 'Tarixni tahrirlash'})
async UpdateSearchDto(@Param('id',ParseIntPipe) id:number,@Body() updateSearchDto: UpdateSearchDto) {
  return this.searchService.deleteHistory
  }

  @Delete(':id')
  @ApiOperation({summary:'Tarixni o`chirish'})
  async remove(@Param('id',ParseIntPipe) id:number){
    return this.searchService.deleteHistory
  }

}
