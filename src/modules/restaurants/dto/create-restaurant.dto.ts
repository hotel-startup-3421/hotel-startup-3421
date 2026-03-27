import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsString()
  slug: string;

  @IsString()
  cuisineType: string;

  @IsEnum(['cheap', 'moderate', 'expensive'])
  priceRange: string;

  @IsString()
  openTime: string;

  @IsString()
  closeTime: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  coverImage?: string;

  @IsOptional()
  locationId?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}