import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {

  @ApiPropertyOptional({
    description: 'Notification read status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

}