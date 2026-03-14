import { Module } from '@nestjs/common';
import { TourBookingsService } from './tour-bookings.service';
import { TourBookingsController } from './tour-bookings.controller';

@Module({
  controllers: [TourBookingsController],
  providers: [TourBookingsService],
})
export class TourBookingsModule {}
