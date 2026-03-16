import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {

  @ApiProperty({
    example: '65f2c3a1b22d9b11c5f9c222',
  })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    example: 'Historical place nearby',
  })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiProperty({
    example: 'You are near Registan Square',
  })
  @IsString()
  @MaxLength(500)
  message: string;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.LOCATION,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    example: '/places/registan',
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;

}