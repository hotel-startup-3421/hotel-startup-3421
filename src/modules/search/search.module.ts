import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SearchEntity, TagEntity } from './entities/search.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([SearchEntity, TagEntity]) // Ikkala entity ham shu yerda bo'lishi shart
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}