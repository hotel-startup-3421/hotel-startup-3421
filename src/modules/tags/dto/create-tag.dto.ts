import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsHexColor, IsOptional } from "class-validator";

export class CreateTagDto {
  @ApiProperty({ example: 'Tarixiy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'tarixiy' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: '#6366f1', required: false })
  @IsHexColor()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 'Joylashuv turi' })
  @IsString()
  @IsNotEmpty()
  category: string;
}