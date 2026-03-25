import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { AmenitiesService } from "./amenities.service";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { UserRole } from "../../common/enums/user-role.enum";
import { AmenityFilterDto, AmenityResponseDto, CreateAmenityDto, UpdateAmenityDto } from "./dto/create-amenity.dto";

@ApiTags("Amenities")
@Controller("amenities")
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  // ─── Public endpoints ─────────────────────────────────────────────────────

  @Get()
  @Public()
  @ApiOperation({ summary: "Barcha qulayliklar ro'yxati (filter bilan)" })
  @ApiResponse({ status: 200, type: AmenityResponseDto, isArray: true })
  findAll(@Query() filter: AmenityFilterDto) {
    return this.amenitiesService.findAll(filter);
  }

  @Get("by-category")
  @Public()
  @ApiOperation({ summary: "Qulayliklarni kategoriya bo'yicha guruhlash" })
  @ApiResponse({
    status: 200,
    description: "{ general: [...], comfort: [...], food: [...] }",
  })
  findByCategory() {
    return this.amenitiesService.findByCategory();
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Bitta qulaylik ma'lumoti" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: AmenityResponseDto })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.amenitiesService.findOne(id);
  }

  // ─── Admin endpoints ──────────────────────────────────────────────────────

  @Post()
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "[ADMIN] Yangi qulaylik qo'shish" })
  @ApiResponse({ status: 201, type: AmenityResponseDto })
  create(@Body() dto: CreateAmenityDto) {
    return this.amenitiesService.create(dto);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "[ADMIN] Qulaylikni tahrirlash" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: AmenityResponseDto })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateAmenityDto,
  ) {
    return this.amenitiesService.update(id, dto);
  }

  @Patch(":id/toggle")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "[ADMIN] Qulaylikni aktiv/passiv qilish" })
  @ApiParam({ name: "id", type: String })
  @HttpCode(HttpStatus.OK)
  toggleActive(@Param("id", ParseUUIDPipe) id: string) {
    return this.amenitiesService.toggleActive(id);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "[ADMIN] Qulaylikni o'chirish" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.amenitiesService.remove(id);
  }
}