import { Controller, Get, Put, Delete, UseGuards, Body, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/utils/multer";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";


@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Mening profilim" })
  getMe(@CurrentUser() currentUser: User) {
    return this.usersService.findOne(currentUser.id);
  }

  @Put("profile")
  @ApiOperation({ summary: "Profilni yangilash" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("avatar", multerOptions))
  updateProfile(
    @CurrentUser() currentUser: User,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(currentUser.id, dto, file?.filename);
  }

  @Put("change-password")
  @ApiOperation({ summary: "Parolni almashtirish" })
  changePassword(@CurrentUser() currentUser: User, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(currentUser.id, dto);
  }

  @Delete("me")
  @ApiOperation({ summary: "Profilni o'chirish" })
  remove(@CurrentUser() currentUser: User) {
    return this.usersService.remove(currentUser.id);
  }
}
