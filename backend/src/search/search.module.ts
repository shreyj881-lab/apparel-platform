import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Style } from '../database/entities/style.entity';
import { Fabric } from '../database/entities/fabric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Style, Fabric])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
