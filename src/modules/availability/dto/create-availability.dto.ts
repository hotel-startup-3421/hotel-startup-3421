import { ApiProperty } from "@nestjs/swagger";

export class CreateAvailabilityDto {

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty()
  roomId: number;

}