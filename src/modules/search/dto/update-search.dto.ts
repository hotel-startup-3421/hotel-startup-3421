import { PartialType } from '@nestjs/swagger';
import { SearchQueryDto } from './create-search.dto';

export class UpdateSearchDto extends PartialType(SearchQueryDto) {}