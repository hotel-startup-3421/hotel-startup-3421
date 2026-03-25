import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { EntityType } from '../entities/image.entity';

export class CreateImageDto {

  @IsString()
  url: string;

  @IsEnum(EntityType)
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsNumber()
  size: number;

  @IsString()
  mimeType: string;
}