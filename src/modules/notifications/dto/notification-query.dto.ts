import {
  IsOptional,
  IsEnum,
  IsBooleanString,
  IsNumberString,
  IsMongoId,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../entities/notification.entity';

export class NotificationQueryDto {

  @ApiPropertyOptional({
    description: 'Filter notifications by user',
    example: '65f2c3a1b22d9b11c5f9c222',
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;


  @ApiPropertyOptional({
    description: 'Filter read/unread notifications',
    example: 'false',
  })
  @IsOptional()
  @IsBooleanString()
  isRead?: string;


  @ApiPropertyOptional({
    description: 'Filter by notification type',
    enum: NotificationType,
    example: NotificationType.LOCATION,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;


  @ApiPropertyOptional({
    description: 'Pagination page number',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;


  @ApiPropertyOptional({
    description: 'Pagination limit',
    example: '10',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;


  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
  })
  @IsOptional()
  sortBy?: string;


  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
  })
  @IsOptional()
  order?: 'asc' | 'desc';

}