import { Injectable } from '@nestjs/common';
import { CreateTourBookingDto } from './dto/create-tour-booking.dto';
import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';

@Injectable()
export class TourBookingsService {
  create(createTourBookingDto: CreateTourBookingDto) {
    return 'This action adds a new tourBooking';
  }

  findAll() {
    return `This action returns all tourBookings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourBooking`;
  }

  update(id: number, updateTourBookingDto: UpdateTourBookingDto) {
    return `This action updates a #${id} tourBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourBooking`;
  }
}
