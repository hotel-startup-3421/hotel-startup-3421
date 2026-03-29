// src/modules/transport/transport.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from './entities/transport.entity';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { Tag } from '../tags/entities/tag.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Transport, Tag])], 
  providers: [TransportService],
  controllers: [TransportController],
  exports: [TransportService],
})
export class TransportModule {}