import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsUUID, IsEmail, IsBoolean, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuideDto {
  @ApiProperty({ example: 'Shahriyor' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Qadirov ' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Experienced guide in historical tours', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'shahriyor-qadirov-guide' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsOptional()
  experience?: number;

  @ApiProperty({ example: ['uz', 'en'], description: 'Supported languages' })
  @IsArray()
  @IsOptional()
  languages?: string[];

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsOptional()
  pricePerDay?: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Location UUID', required: false })
  @IsUUID()
  @IsOptional()
  locationId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'User UUID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: ['tag1', 'tag2'], description: 'Array of tag UUIDs', required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: '+998901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'shahriyor@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}