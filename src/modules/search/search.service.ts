import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchEntity, TagEntity } from './entities/search.entity';
import { UpdateSearchDto } from './dto/update-search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchEntity)
    private readonly searchRepository: Repository<SearchEntity>,
    
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  // ================= TAGS (TEGLAR) QISMI =================

  async getTagsGrouped() {
    const tags = await this.tagRepository.find();
    return tags.reduce((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      acc[tag.category].push(tag);
      return acc;
    }, {});
  }

  async createTag(data: any) {
    const tag = this.tagRepository.create(data);
    return await this.tagRepository.save(tag);
  }

  // ================= SEARCH (QIDIRUV) QISMI =================

  async executeSearch(query: string) {
    const log = this.searchRepository.create({ query });
    await this.searchRepository.save(log);

    return {
      query,
      results: [],
      message: "Qidiruv muvaffaqiyatli bajarildi va tarixga saqlandi"
    };
  }

  async getHistory() {
    return await this.searchRepository.find({ 
      order: { createdAt: 'DESC' } 
    });
  }

  async updateHistory(id: number, updateSearchDto: UpdateSearchDto) {
    const history = await this.searchRepository.findOne({ where: { id } });
    
    if (!history) {
      throw new NotFoundException("Tarix topilmadi");
    }
    
    if (updateSearchDto.q) {
      history.query = updateSearchDto.q;
    }
    
    return await this.searchRepository.save(history);
  }

  async deleteHistory(id: number) {
    const result = await this.searchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("ID topilmadi");
    }
    return { success: true };
  }
}
