import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Style } from '../database/entities/style.entity';
import { Fabric } from '../database/entities/fabric.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Style) private stylesRepo: Repository<Style>,
    @InjectRepository(Fabric) private fabricsRepo: Repository<Fabric>,
  ) {}

  async globalSearch(query: string, limit = 10) {
    const q = `%${query}%`;
    const [styles, fabrics] = await Promise.all([
      this.stylesRepo.createQueryBuilder('style')
        .leftJoinAndSelect('style.images', 'images')
        .where('style.isActive = true')
        .andWhere('(style.name ILIKE :q OR style.brickName ILIKE :q OR style.fabricUsed ILIKE :q)', { q })
        .take(limit).getMany(),
      this.fabricsRepo.createQueryBuilder('fabric')
        .leftJoinAndSelect('fabric.images', 'images')
        .where('fabric.isActive = true')
        .andWhere('(fabric.name ILIKE :q OR fabric.fabricUsed ILIKE :q OR fabric.supplierName ILIKE :q)', { q })
        .take(limit).getMany(),
    ]);
    return {
      query,
      results: {
        styles: styles.map((s) => ({ ...s, type: 'style' })),
        fabrics: fabrics.map((f) => ({ ...f, type: 'fabric' })),
        total: styles.length + fabrics.length,
      },
    };
  }
}
