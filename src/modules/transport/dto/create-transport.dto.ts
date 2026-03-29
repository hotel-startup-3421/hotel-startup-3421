import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsUUID, IsArray } from 'class-validator';

export class CreateTransportDto {
  @ApiProperty({ example: 'Tashkent Taxi', description: 'Transport nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Shahar ichidagi taksi', description: 'Transport tavsifi', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'taxi', enum: ['taxi', 'bus', 'transfer', 'rent'] })
  @IsEnum(['taxi', 'bus', 'transfer', 'rent'])
  type: string;

  @ApiProperty({ example: 4, description: 'Odam sig‘imi' })
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: 50, description: 'Kunlik narx', required: false })
  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @ApiProperty({ example: 2, description: 'Kilometr bo‘yicha narx', required: false })
  @IsOptional()
  @IsNumber()
  pricePerKm?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: 'http://example.com/image.png', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'uuid-of-location', required: false })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiProperty({ example: 'uuid-of-user', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: ['uuid-tag-1', 'uuid-tag-2'], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];
}