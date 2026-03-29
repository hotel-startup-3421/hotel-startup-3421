import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({ enum: ['property', 'tour', 'restaurant', 'attraction'] })
  @IsNotEmpty()
  @IsEnum(['property', 'tour', 'restaurant', 'attraction'])
  entityType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  entityId: number;
}