import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationsService {

  private notifications: NotificationEntity[] = [];

  create(createNotificationDto: CreateNotificationDto): NotificationEntity {

    const notification: NotificationEntity ={
      id: Date.now().toString(),
      ...createNotificationDto,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.notifications.push(notification);

    return notification;
  }

  findAll(query: NotificationQueryDto): NotificationEntity[] {

    let result = [...this.notifications];

    if (query.userId) {
      result = result.filter(
        (n) => n.userId === query.userId,
      );
    }

    if (query.type) {
      result = result.filter(
        (n) => n.type === query.type,
      );
    }

    if (query.isRead !== undefined) {
      const isRead = query.isRead === 'true';
      result = result.filter(
        (n) => n.isRead === isRead,
      );
    }

    return result;
  }

  findOne(id: string): NotificationEntity {

    const notification = this.notifications.find(
      (n) => n.id === id,
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): NotificationEntity {

    const notification = this.findOne(id);

    Object.assign(notification, updateNotificationDto, {
      updatedAt: new Date(),
    });

    return notification;
  }

  remove(id: string) {

    const index = this.notifications.findIndex(
      (n) => n.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Notification not found');
    }

    this.notifications.splice(index, 1);

    return { message: 'Notification deleted successfully' };
  }

}