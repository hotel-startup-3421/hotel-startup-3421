import { IsString, IsEnum, IsNumber, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Sharh matni', example: 'Menga juda yoqdi!' })
  @IsString()
  @MinLength(2)
  text: string;

  @ApiProperty({ enum: ['attraction', 'tour', 'restaurant'], example: 'tour' })
  @IsEnum(['attraction', 'tour', 'restaurant'])
  entityType: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  entityId: number;

  @ApiProperty({ required: false, example: null, description: 'Agar javob bo’lsa, asosiy sharh IDsi' })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}