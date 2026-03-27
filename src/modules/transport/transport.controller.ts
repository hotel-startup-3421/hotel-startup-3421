import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TransportService } from './transport.service';
import { Transport } from './entities/transport.entity';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.transportService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(id);
  }

  @Post()
  create(@Body() transport: Partial<Transport>) {
    return this.transportService.create(transport);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Transport>) {
    return this.transportService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportService.remove(id);
  }
}