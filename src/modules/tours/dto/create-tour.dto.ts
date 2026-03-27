import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
} from "class-validator";
import { TourDifficulty } from "../entities/tour.entity";

export class CreateTourDto {
  @ApiProperty({ example: "Samarqand 3 kunlik tur" })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: "Samarqand shahridagi tarixiy joylarni ziyorat..." })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ example: "kun" })
  @IsOptional()
  @IsString()
  durationUnit?: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(1)
  @Max(100)
  maxGroupSize: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minGroupSize?: number;

  @ApiPropertyOptional({ enum: TourDifficulty })
  @IsOptional()
  @IsEnum(TourDifficulty)
  difficulty?: TourDifficulty;

  @ApiPropertyOptional({ example: "uuid" })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({ example: "uuid" })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: ["uuid1", "uuid2"] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  tagIds?: string[];

  @ApiPropertyOptional({ example: "Ovqat, transport, gid kiradi" })
  @IsOptional()
  @IsString()
  includes?: string;

  @ApiPropertyOptional({ example: "Viza, sug'urta kirmaydi" })
  @IsOptional()
  @IsString()
  excludes?: string;

  @ApiPropertyOptional({ example: "Yurish qobiliyati talab etiladi" })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}