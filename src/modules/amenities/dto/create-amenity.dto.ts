import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

// ─── Create ───────────────────────────────────────────────────────────────────

export class CreateAmenityDto {
  @ApiProperty({ example: "Wifi" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: "Bepul internet ulanish" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: "wifi" })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    example: "general",
    description: "general | comfort | safety | food | transport",
  })
  @IsOptional()
  @IsString()
  category?: string;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export class UpdateAmenityDto {
  @ApiPropertyOptional({ example: "Wifi" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: "Bepul internet ulanish" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: "wifi" })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: "general" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export class AmenityFilterDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: "wifi" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: "general" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export class AmenityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() icon?: string;
  @ApiProperty() category: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}