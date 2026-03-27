import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import databaseConfig from "./config/database.config";
import jwtConfig from "./config/jwt.config";
import appConfig from "./config/app.config";
import storageConfig from "./config/storage.config";

import { MailModule } from "./modules/mail/mail.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CouponsModule } from "./modules/coupons/coupons.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { AttractionsModule } from "./modules/attractions/attractions.module";
import { ToursModule } from "./modules/tours/tours.module";
import { RestaurantsModule } from "./modules/restaurants/restaurants.module";
import { GuidesModule } from "./modules/guides/guides.module";
import { LocationsModule } from "./modules/locations/locations.module";
import { AmenitiesModule } from "./modules/amenities/amenities.module";
import { ImagesModule } from "./modules/images/images.module";
import { PropertiesModule } from "./modules/properties/properties.module";
import { RoomsModule } from "./modules/rooms/rooms.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { PricingModule } from "./modules/pricing/pricing.module";
import { TourBookingsModule } from "./modules/tour-bookings/tour-bookings.module";
import { RatingsModule } from "./modules/ratings/ratings.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { SearchModule } from "./modules/search/search.module";
import { WishlistsModule } from "./modules/wishlists/wishlists.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ChatModule } from "./modules/chat/chat.module";
import { AdminModule } from "./modules/admin/admin.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { BookingsModule } from "./modules/bookings/bookings.module";

@Module({
  imports: [
    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, storageConfig],
    }),

    // TypeORM setup
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>("database");
        return {
          ...dbConfig,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),

    // App modules
    MailModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    AttractionsModule,
    ToursModule,
    RestaurantsModule,
    GuidesModule,
    LocationsModule,
    PropertiesModule,
    RoomsModule,
    AmenitiesModule,
    ImagesModule,
    AvailabilityModule,
    PricingModule,
    TourBookingsModule,
    ReviewsModule,
    RatingsModule,
    WishlistsModule,
    NotificationsModule,
    ChatModule,
    SearchModule,
    CouponsModule,
    AdminModule,
    PaymentsModule,
    BookingsModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}