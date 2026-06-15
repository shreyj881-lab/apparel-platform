import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Style, Gender, WearCategory } from '../database/entities/style.entity';
import { Fabric } from '../database/entities/fabric.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Style) private stylesRepo: Repository<Style>,
    @InjectRepository(Fabric) private fabricsRepo: Repository<Fabric>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async getStats() {
    const [totalStyles, menStyles, womenStyles, topWear, bottomWear,
           totalFabrics, totalUsers] = await Promise.all([
      this.stylesRepo.count({ where: { isActive: true } }),
      this.stylesRepo.count({ where: { isActive: true, gender: Gender.MEN } }),
      this.stylesRepo.count({ where: { isActive: true, gender: Gender.WOMEN } }),
      this.stylesRepo.count({ where: { isActive: true, wearCategory: WearCategory.TOP_WEAR } }),
      this.stylesRepo.count({ where: { isActive: true, wearCategory: WearCategory.BOTTOM_WEAR } }),
      this.fabricsRepo.count({ where: { isActive: true } }),
      this.usersRepo.count({ where: { isActive: true } }),
    ]);
    return { totalStyles, menStyles, womenStyles, topWear, bottomWear, totalFabrics, totalUsers };
  }

  async getRecentStyles(limit = 8) {
    return this.stylesRepo.find({
      where: { isActive: true },
      relations: ['images'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRecentFabrics(limit = 8) {
    return this.fabricsRepo.find({
      where: { isActive: true },
      relations: ['images'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getMostUsedFabrics() {
    return this.stylesRepo.createQueryBuilder('style')
      .select('style.fabricUsed', 'fabric')
      .addSelect('COUNT(*)', 'count')
      .where('style.isActive = true')
      .groupBy('style.fabricUsed')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getBrickNameDistribution() {
    return this.stylesRepo.createQueryBuilder('style')
      .select('style.brickName', 'brickName')
      .addSelect('COUNT(*)', 'count')
      .where('style.isActive = true')
      .groupBy('style.brickName')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getUploadTrends() {
    return this.stylesRepo.createQueryBuilder('style')
      .select("DATE_TRUNC('week', style.createdAt)", 'week')
      .addSelect('COUNT(*)', 'count')
      .where("style.createdAt >= NOW() - INTERVAL '12 weeks'")
      .groupBy('week')
      .orderBy('week', 'ASC')
      .getRawMany();
  }
}
