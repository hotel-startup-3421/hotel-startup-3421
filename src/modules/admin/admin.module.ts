// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { AdminController } from "./admin.controller";
// import { AdminService } from "./admin.service";
// import { User } from "../users/entities/user.entity";
// import { Booking } from "../bookings/entities/booking.entity";
// import { Payment } from "../payments/entities/payment.entity";
// import { Property } from "../properties/entities/property.entity";
// import { Review } from "../reviews/entities/review.entity";

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User, Booking, Payment, Property, Review]),
//   ],
//   controllers: [AdminController],
//   providers: [AdminService],
//   exports: [AdminService],
// })
export class AdminModule {}