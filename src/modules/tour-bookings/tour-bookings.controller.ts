import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourBookingsService } from './tour-bookings.service';
import { CreateTourBookingDto } from './dto/create-tour-booking.dto';
import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';

@Controller('tour-bookings')
export class TourBookingsController {
  constructor(private readonly tourBookingsService: TourBookingsService) {}

  @Post()
  create(@Body() createTourBookingDto: CreateTourBookingDto) {
    return this.tourBookingsService.create(createTourBookingDto);
  }

  @Get()
  findAll() {
    return this.tourBookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourBookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourBookingDto: UpdateTourBookingDto) {
    return this.tourBookingsService.update(+id, updateTourBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourBookingsService.remove(+id);
  }
}
