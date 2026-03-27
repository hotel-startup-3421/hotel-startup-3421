import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from "@nestjs/swagger";
import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { UserRole } from "../../common/enums/user-role.enum";

@ApiTags("Locations")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Barcha manzillar" })
  findAll() {
    return this.locationsService.findAll();
  }

  @Get("cities")
  @Public()
  @ApiOperation({ summary: "Barcha shaharlar" })
  findCities() {
    return this.locationsService.findCities();
  }

  @Get("countries")
  @Public()
  @ApiOperation({ summary: "Barcha mamlakatlar" })
  findCountries() {
    return this.locationsService.findCountries();
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Bitta manzil" })
  findOne(@Param("id") id: string) {
    return this.locationsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Yangi manzil qo'shish (admin)" })
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Manzilni tahrirlash (admin)" })
  update(@Param("id") id: string, @Body() dto: UpdateLocationDto) {
    return this.locationsService.update(id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Manzilni o'chirish (admin)" })
  remove(@Param("id") id: string) {
    return this.locationsService.remove(id);
  }
}