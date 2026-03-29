import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@ApiTags('Wishlists')
@ApiBearerAuth()
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly service: WishlistsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Wishlistga qo\'shish' })
  create(@Body() dto: CreateWishlistDto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'O\'zining wishlistlarini ko\'rish' })
  findAll(@Req() req) {
    return this.service.findAll(req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Wishlistdan o\'chirish' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.service.remove(id, req.user.id);
  }
}
