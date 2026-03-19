// import {
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Param,
//   Body,
//   Query,
//   ParseUUIDPipe,
//   HttpCode,
//   HttpStatus,
// } from "@nestjs/common";
// import {
//   ApiTags,
//   ApiBearerAuth,
//   ApiOperation,
//   ApiResponse,
//   ApiParam,
// } from "@nestjs/swagger";
// import { AdminService } from "./admin.service";
// import {
//   AdminUpdateUserDto,
//   AdminUsersFilterDto,
//   AdminBookingsFilterDto,
//   AdminPaymentsFilterDto,
//   AdminPropertiesFilterDto,
//   AdminStatsQueryDto,
//   AdminBanUserDto,
//   AdminUpdateBookingDto,
//   AdminVerifyPropertyDto,
// } from "./dto/admin.dto";
// import {
//   DashboardStatsDto,
//   AdminUserResponseDto,
//   RevenueChartDto,
// } from "./dto/admin-response.dto";
// import { Roles } from "../../common/decorators/roles.decorator";
// import { CurrentUser } from "../../common/decorators/current-user.decorator";
// import { UserRole } from "../../common/enums/user-role.enum";
// import * as jwtPayloadInterface from "../../common/interfaces/jwt-payload.interface";
// import { StatsPeriod } from "src/common/enums/admin-action.enum";

// @ApiTags("Admin")
// @ApiBearerAuth("JWT-auth")
// @Roles(UserRole.ADMIN)
// @Controller("admin")
// export class AdminController {
//   constructor(private readonly adminService: AdminService) {}

//   // ─── Dashboard ────────────────────────────────────────────────────────────

//   @Get("dashboard/stats")
//   @ApiOperation({ summary: "Dashboard statistikasi" })
//   @ApiResponse({ status: 200, type: DashboardStatsDto })
//   getDashboardStats(@Query() query: AdminStatsQueryDto) {
//     return this.adminService.getDashboardStats(query);
//   }

//   @Get("dashboard/revenue-chart")
//   @ApiOperation({ summary: "Daromad grafigi" })
//   @ApiResponse({ status: 200, type: RevenueChartDto })
//   getRevenueChart(@Query("period") period: StatsPeriod) {
//     return this.adminService.getRevenueChart(period);
//   }

//   // ─── Users ─────────────────────────────────────────────────────────────────

//   @Get("users")
//   @ApiOperation({ summary: "Barcha foydalanuvchilar ro'yxati" })
//   @ApiResponse({ status: 200, description: "Foydalanuvchilar ro'yxati (paginated)" })
//   getAllUsers(@Query() filter: AdminUsersFilterDto) {
//     return this.adminService.getAllUsers(filter);
//   }

//   @Get("users/:id")
//   @ApiOperation({ summary: "Foydalanuvchi ma'lumotlari" })
//   @ApiParam({ name: "id", type: String })
//   @ApiResponse({ status: 200, type: AdminUserResponseDto })
//   getUserById(@Param("id", ParseUUIDPipe) id: string) {
//     return this.adminService.getUserById(id);
//   }

//   @Patch("users/:id")
//   @ApiOperation({ summary: "Foydalanuvchini tahrirlash" })
//   @ApiParam({ name: "id", type: String })
//   updateUser(
//     @Param("id", ParseUUIDPipe) id: string,
//     @Body() dto: AdminUpdateUserDto,
//   ) {
//     return this.adminService.updateUser(id, dto);
//   }

//   @Post("users/:id/ban")
//   @ApiOperation({ summary: "Foydalanuvchini ban qilish" })
//   @ApiParam({ name: "id", type: String })
//   @HttpCode(HttpStatus.OK)
//   banUser(
//     @Param("id", ParseUUIDPipe) id: string,
//     @Body() dto: AdminBanUserDto,
//     @CurrentUser() admin: jwtPayloadInterface.JwtPayload,
//   ) {
//     return this.adminService.banUser(id, dto, admin.sub);
//   }

//   @Post("users/:id/unban")
//   @ApiOperation({ summary: "Foydalanuvchini ban'dan chiqarish" })
//   @ApiParam({ name: "id", type: String })
//   @HttpCode(HttpStatus.OK)
//   unbanUser(@Param("id", ParseUUIDPipe) id: string) {
//     return this.adminService.unbanUser(id);
//   }

//   @Delete("users/:id")
//   @ApiOperation({ summary: "Foydalanuvchini o'chirish" })
//   @ApiParam({ name: "id", type: String })
//   deleteUser(
//     @Param("id", ParseUUIDPipe) id: string,
//     @CurrentUser() admin: jwtPayloadInterface.JwtPayload,
//   ) {
//     return this.adminService.deleteUser(id, admin.sub);
//   }

//   // ─── Bookings ──────────────────────────────────────────────────────────────

//   @Get("bookings")
//   @ApiOperation({ summary: "Barcha bronlar ro'yxati" })
//   getAllBookings(@Query() filter: AdminBookingsFilterDto) {
//     return this.adminService.getAllBookings(filter);
//   }

//   @Get("bookings/:id")
//   @ApiOperation({ summary: "Bron ma'lumotlari" })
//   @ApiParam({ name: "id", type: String })
//   getBookingById(@Param("id", ParseUUIDPipe) id: string) {
//     return this.adminService.getBookingById(id);
//   }

//   @Patch("bookings/:id/status")
//   @ApiOperation({ summary: "Bron statusini o'zgartirish" })
//   @ApiParam({ name: "id", type: String })
//   updateBookingStatus(
//     @Param("id", ParseUUIDPipe) id: string,
//     @Body() dto: AdminUpdateBookingDto,
//   ) {
//     return this.adminService.updateBookingStatus(id, dto);
//   }

//   @Post("bookings/:id/cancel")
//   @ApiOperation({ summary: "Bronni bekor qilish" })
//   @ApiParam({ name: "id", type: String })
//   @HttpCode(HttpStatus.OK)
//   cancelBooking(@Param("id", ParseUUIDPipe) id: string) {
//     return this.adminService.cancelBooking(id);
//   }

//   // ─── Payments ──────────────────────────────────────────────────────────────

//   @Get("payments")
//   @ApiOperation({ summary: "Barcha to'lovlar ro'yxati" })
//   getAllPayments(@Query() filter: AdminPaymentsFilterDto) {
//     return this.adminService.getAllPayments(filter);
//   }

//   @Post("payments/:id/refund")
//   @ApiOperation({ summary: "To'lovni qaytarish (refund)" })
//   @ApiParam({ name: "id", type: String })
//   @HttpCode(HttpStatus.OK)
//   refundPayment(@Param("id", ParseUUIDPipe) id: string) {
//     return this.adminService.refundPayment(id);
//   }

//   // ─── Properties ────────────────────────────────────────────────────────────

//   @Get("properties")
//   @ApiOperation({ summary: "Barcha mulklar ro'yxati" })
//   getAllProperties(@Query() filter: AdminPropertiesFilterDto) {
//     return this.adminService.getAllProperties(filter);
//   }

//   @Patch("properties/:id/verify")
//   @ApiOperation({ summary: "Mulkni tasdiqlash yoki rad etish" })
//   @ApiParam({ name: "id", type: String })
//   verifyProperty(
//     @Param("id", ParseUUIDPipe) id: string,
//     @Body() dto: AdminVerifyPropertyDto,
//   ) {
//     return this.adminService.verifyProperty(id, dto);
//   }

//   @Delete("properties/:id")
//   @ApiOperation({ summary: "Mulkni o'chirish" })
//   @ApiParam({ name: "id", type: String })
//   deleteProperty(@Param("id", ParseUUIDPipe) id: string) {
//     return this.adminService.deleteProperty(id);
//   }

//   // ─── Reviews ───────────────────────────────────────────────────────────────

//   @Get("reviews")
//   @ApiOperation({ summary: "Barcha sharhlar ro'yxati" })
//   getAllReviews(
//     @Query("page") page = 1,
//     @Query("limit") limit = 10,
//   ) {
//     return this.adminService.getAllReviews({ page: +page, limit: +limit });
//   }

//   @Delete("reviews/:id")
//   @ApiOperation({ summary: "Sharhni o'chirish" })
//   @ApiParam({ name: "id", type: String })
//   deleteReview(@Param("id", ParseUUIDPipe) id: string) {
//     return this.adminService.deleteReview(id);
//   }
// }