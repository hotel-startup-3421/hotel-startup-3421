import { ApiProperty } from "@nestjs/swagger";

export class CreatePropertyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  starRating: number;

  @ApiProperty()
  pricePerNight: number;

  @ApiProperty()
  totalRooms: number;

  @ApiProperty()
  checkInTime: string;

  @ApiProperty()
  checkOutTime: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  website: string;
}