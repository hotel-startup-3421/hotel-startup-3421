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
import { PaymentsService } from "./payments.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import * as jwtPayloadInterface from "../../common/interfaces/jwt-payload.interface";
import { Public } from "../../common/decorators/public.decorator";
import { ClickCallbackDto, InitiatePaymentDto, InitiatePaymentResponseDto, PaymeCallbackDto, PaymentFilterDto, PaymentResponseDto } from "./dto/create-payment.dto";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ─── To'lovni boshlash ────────────────────────────────────────────────────

  @Post("initiate")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "To'lovni boshlash (Payme/Click URL olish)" })
  @ApiResponse({ status: 201, type: InitiatePaymentResponseDto })
  initiate(
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiatePayment(user.sub, dto);
  }

  // ─── Foydalanuvchi to'lovlari ─────────────────────────────────────────────

  @Get("my")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Mening to'lovlarim" })
  @ApiResponse({ status: 200, type: PaymentResponseDto, isArray: true })
  findMyPayments(
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
    @Query() filter: PaymentFilterDto,
  ) {
    return this.paymentsService.findMyPayments(user.sub, filter);
  }

  @Get(":id")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Bitta to'lov ma'lumoti" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }

  // ─── Payme webhook (Public) ───────────────────────────────────────────────

  @Post("payme/callback")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Payme webhook callback" })
  paymeCallback(@Body() dto: PaymeCallbackDto) {
    return this.paymentsService.handlePaymeCallback(dto);
  }

  // ─── Click webhook (Public) ───────────────────────────────────────────────

  @Post("click/prepare")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Click prepare callback" })
  clickPrepare(@Body() dto: ClickCallbackDto) {
    return this.paymentsService.handleClickCallback(dto);
  }

  @Post("click/complete")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Click complete callback" })
  clickComplete(@Body() dto: ClickCallbackDto) {
    return this.paymentsService.handleClickCallback(dto);
  }
}