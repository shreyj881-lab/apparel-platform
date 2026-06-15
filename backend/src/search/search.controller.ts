import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get() @Public()
  @ApiOperation({ summary: 'Global search across styles and fabrics' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'limit', required: false })
  search(@Query('q') query: string, @Query('limit') limit = 10) {
    return this.searchService.globalSearch(query, +limit);
  }
}
