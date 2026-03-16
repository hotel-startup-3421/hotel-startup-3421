import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  LOCATION = 'location',
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
  GUIDE = 'guide',
  SYSTEM = 'system',
}

export class NotificationEntity {

  @ApiProperty({
    example: '65f2c3a1b22d9b11c5f9c111',
  })
  id: string;

  @ApiProperty({
    example: '65f2c3a1b22d9b11c5f9c222',
  })
  userId: string;

  @ApiProperty({
    example: 'Historical place nearby',
  })
  title: string;

  @ApiProperty({
    example: 'You are near Registan Square',
  })
  message: string;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.LOCATION,
  })
  type: NotificationType;

  @ApiProperty({
    example: false,
  })
  isRead: boolean;

  @ApiProperty({
    example: '/places/registan',
    required: false,
  })
  link?: string;

  @ApiProperty({
    example: '2026-03-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-03-15T10:05:00.000Z',
  })
  updatedAt: Date;

}