import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { BookingsService } from "./bookings.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import * as jwtPayloadInterface from "../../common/interfaces/jwt-payload.interface";
import { BookingFilterDto, BookingResponseDto, CancelBookingDto, CreateBookingDto } from "./dto/create-booking.dto";

@ApiTags("Bookings")
@ApiBearerAuth("JWT-auth")
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: "Yangi bron yaratish" })
  @ApiResponse({ status: 201, type: BookingResponseDto })
  create(
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.sub, dto);
  }

  @Get("my")
  @ApiOperation({ summary: "Mening bronlarim" })
  @ApiResponse({ status: 200, type: BookingResponseDto, isArray: true })
  findMyBookings(
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
    @Query() filter: BookingFilterDto,
  ) {
    return this.bookingsService.findMyBookings(user.sub, filter);
  }

  @Get(":id")
  @ApiOperation({ summary: "Bitta bron ma'lumoti" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
  ) {
    return this.bookingsService.findOneForUser(id, user.sub);
  }

  @Post(":id/cancel")
  @ApiOperation({ summary: "Bronni bekor qilish" })
  @ApiParam({ name: "id", type: String })
  @HttpCode(HttpStatus.OK)
  cancel(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, user.sub, dto);
  }
}