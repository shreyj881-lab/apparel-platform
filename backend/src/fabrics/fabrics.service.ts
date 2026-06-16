import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fabric } from '../database/entities/fabric.entity';
import { FabricImage } from '../database/entities/fabric-image.entity';
import { FabricColorway } from '../database/entities/fabric-colorway.entity';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
import { FilterFabricsDto } from './dto/filter-fabrics.dto';

@Injectable()
export class FabricsService {
  constructor(
    @InjectRepository(Fabric) private fabricsRepo: Repository<Fabric>,
    @InjectRepository(FabricImage) private imagesRepo: Repository<FabricImage>,
    @InjectRepository(FabricColorway) private colorwaysRepo: Repository<FabricColorway>,
  ) {}

  async create(dto: CreateFabricDto, userId: string) {
    const fabric = this.fabricsRepo.create({ ...dto, createdById: userId });
    return this.fabricsRepo.save(fabric);
  }

  async findAll(filters: FilterFabricsDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC', search, ...rest } = filters;
    const qb = this.fabricsRepo.createQueryBuilder('fabric')
      .leftJoinAndSelect('fabric.images', 'images')
      .leftJoinAndSelect('fabric.colorways', 'colorways')
      .where('fabric.isActive = true');

    if (search) {
      qb.andWhere(
        '(fabric.name ILIKE :s OR fabric.fabricUsed ILIKE :s OR fabric.supplierName ILIKE :s)',
        { s: `%${search}%` },
      );
    }
    if (rest.brickName) qb.andWhere('fabric.brickName ILIKE :bn', { bn: `%${rest.brickName}%` });
    if (rest.fabricUsed) qb.andWhere('fabric.fabricUsed ILIKE :fu', { fu: `%${rest.fabricUsed}%` });
    if (rest.fabricContent) qb.andWhere('fabric.fabricContent ILIKE :fc', { fc: `%${rest.fabricContent}%` });
    if (rest.supplierName) qb.andWhere('fabric.supplierName ILIKE :sn', { sn: `%${rest.supplierName}%` });
    if (rest.gsmMin) qb.andWhere('fabric.gsm >= :gsmMin', { gsmMin: rest.gsmMin });
    if (rest.gsmMax) qb.andWhere('fabric.gsm <= :gsmMax', { gsmMax: rest.gsmMax });

    const validSort = ['createdAt', 'name', 'gsm', 'supplierName'];
    const safeSort = validSort.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`fabric.${safeSort}`, sortOrder).skip((page - 1) * limit).take(limit);

    const [fabrics, total] = await qb.getManyAndCount();
    return { fabrics, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const fabric = await this.fabricsRepo.findOne({
      where: { id, isActive: true },
      relations: ['images', 'colorways', 'createdBy'],
    });
    if (!fabric) throw new NotFoundException('Fabric not found');
    return fabric;
  }

  async update(id: string, dto: UpdateFabricDto) {
    const fabric = await this.fabricsRepo.findOne({ where: { id } });
    if (!fabric) throw new NotFoundException('Fabric not found');
    Object.assign(fabric, dto);
    return this.fabricsRepo.save(fabric);
  }

  async remove(id: string) {
    const fabric = await this.fabricsRepo.findOne({ where: { id } });
    if (!fabric) throw new NotFoundException('Fabric not found');
    fabric.isActive = false;
    await this.fabricsRepo.save(fabric);
    return { message: 'Fabric deleted successfully' };
  }

  async addImages(fabricId: string, images: { url: string; thumbnailUrl: string; publicId: string }[]) {
    const existing = await this.imagesRepo.count({ where: { fabricId } });
    const newImages = images.map((img, i) =>
      this.imagesRepo.create({ ...img, fabricId, isPrimary: existing === 0 && i === 0, sortOrder: existing + i }),
    );
    return this.imagesRepo.save(newImages);
  }

  async addColorway(fabricId: string, colorway: { colorName: string; colorCode?: string; imageUrl?: string; publicId?: string }) {
    const existing = await this.colorwaysRepo.count({ where: { fabricId } });
    const cw = this.colorwaysRepo.create({ ...colorway, fabricId, sortOrder: existing });
    return this.colorwaysRepo.save(cw);
  }

  async removeColorway(fabricId: string, colorwayId: string) {
    const cw = await this.colorwaysRepo.findOne({ where: { id: colorwayId, fabricId } });
    if (!cw) throw new NotFoundException('Colorway not found');
    await this.colorwaysRepo.remove(cw);
    return { message: 'Colorway removed' };
  }
async bulkExport() {
    const fabrics = await this.fabricsRepo.find({
      where: { isActive: true },
      relations: ['colorways'],
      order: { createdAt: 'DESC' },
    });
    return fabrics;
  }
  async getFilterOptions() {
    const fabricUsed = await this.fabricsRepo.createQueryBuilder('f')
      .select('DISTINCT f.fabricUsed', 'value').where('f.isActive = true').getRawMany();
    const suppliers = await this.fabricsRepo.createQueryBuilder('f')
      .select('DISTINCT f.supplierName', 'value').where('f.isActive = true AND f.supplierName IS NOT NULL').getRawMany();
    const fabricContent = await this.fabricsRepo.createQueryBuilder('f')
      .select('DISTINCT f.fabricContent', 'value').where('f.isActive = true AND f.fabricContent IS NOT NULL').getRawMany();
    return {
      fabricUsed: fabricUsed.map((r) => r.value).filter(Boolean).sort(),
      suppliers: suppliers.map((r) => r.value).filter(Boolean).sort(),
      fabricContent: fabricContent.map((r) => r.value).filter(Boolean).sort(),
    };
  }
}
