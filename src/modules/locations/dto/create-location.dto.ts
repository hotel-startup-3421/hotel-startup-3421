import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from "class-validator";

export class CreateLocationDto {
  @ApiProperty({ example: "O'zbekiston" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ example: "Samarqand viloyati" })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ example: "Samarqand" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: "Registon tumani" })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: "Registon ko'chasi, 1" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 39.6542 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ example: 66.9758 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({ example: "140100" })
  @IsOptional()
  @IsString()
  zipCode?: string;
}