import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { ToursService } from "./tours.service";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "../../common/enums/user-role.enum";
import type { JwtPayload } from "../../common/interfaces/jwt-payload.interface";

@ApiTags("Tours")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("tours")
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Barcha turlar" })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "city", required: false })
  @ApiQuery({ name: "categoryId", required: false })
  @ApiQuery({ name: "difficulty", required: false })
  @ApiQuery({ name: "minPrice", required: false })
  @ApiQuery({ name: "maxPrice", required: false })
  findAll(@Query() query: any) {
    return this.toursService.findAll(query);
  }

  @Get("featured")
  @Public()
  @ApiOperation({ summary: "Featured turlar" })
  findFeatured() {
    return this.toursService.findFeatured();
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Bitta tur" })
  findOne(@Param("id") id: string) {
    return this.toursService.findOne(id);
  }

  @Get("slug/:slug")
  @Public()
  @ApiOperation({ summary: "Slug orqali tur" })
  findBySlug(@Param("slug") slug: string) {
    return this.toursService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN, UserRole.HOST)
  @ApiOperation({ summary: "Yangi tur yaratish" })
  create(
    @Body() dto: CreateTourDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.toursService.create(dto, user.sub);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN, UserRole.HOST)
  @ApiOperation({ summary: "Turni tahrirlash" })
  update(@Param("id") id: string, @Body() dto: UpdateTourDto) {
    return this.toursService.update(id, dto);
  }

  @Patch(":id/publish")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Turni nashr qilish (admin)" })
  publish(@Param("id") id: string) {
    return this.toursService.publish(id);
  }

  @Patch(":id/unpublish")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Turni yopish (admin)" })
  unpublish(@Param("id") id: string) {
    return this.toursService.unpublish(id);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Turni o'chirish (admin)" })
  remove(@Param("id") id: string) {
    return this.toursService.remove(id);
  }
}