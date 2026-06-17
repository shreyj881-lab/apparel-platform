import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Style } from '../database/entities/style.entity';
import { StyleImage } from '../database/entities/style-image.entity';
import { CreateStyleDto } from './dto/create-style.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
import { FilterStylesDto } from './dto/filter-styles.dto';
import { UserRole } from '../database/entities/user.entity';

@Injectable()
export class StylesService {
  constructor(
    @InjectRepository(Style) private stylesRepo: Repository<Style>,
    @InjectRepository(StyleImage) private imagesRepo: Repository<StyleImage>,
  ) {}

  async create(dto: CreateStyleDto, userId: string) {
    const style = this.stylesRepo.create({ ...dto, createdById: userId });
    return this.stylesRepo.save(style);
  }

  async findAll(filters: FilterStylesDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC', search, ...rest } = filters;
    const qb = this.stylesRepo.createQueryBuilder('style')
      .leftJoinAndSelect('style.images', 'images')
      .where('style.isActive = true');

    if (search) {
      qb.andWhere(
        '(style.name ILIKE :s OR style.brickName ILIKE :s OR style.fabricUsed ILIKE :s OR style.description ILIKE :s OR style.styleCode ILIKE :s)',
        { s: `%${search}%` },
      );
    }
    if (rest.gender) qb.andWhere('style.gender = :gender', { gender: rest.gender });
    if (rest.wearCategory) qb.andWhere('style.wearCategory = :wearCategory', { wearCategory: rest.wearCategory });
    if (rest.brickName) qb.andWhere('style.brickName ILIKE :bn', { bn: `%${rest.brickName}%` });
    if (rest.fabricUsed) qb.andWhere('style.fabricUsed ILIKE :fu', { fu: `%${rest.fabricUsed}%` });
    if (rest.fabricContent) qb.andWhere('style.fabricContent ILIKE :fc', { fc: `%${rest.fabricContent}%` });
    if (rest.gsmMin) qb.andWhere('style.gsm >= :gsmMin', { gsmMin: rest.gsmMin });
    if (rest.gsmMax) qb.andWhere('style.gsm <= :gsmMax', { gsmMax: rest.gsmMax });

    const validSortFields = ['createdAt', 'name', 'gsm', 'viewCount'];
    const safeSort = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`style.${safeSort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [styles, total] = await qb.getManyAndCount();
    return { styles, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const style = await this.stylesRepo.findOne({
      where: { id, isActive: true },
      relations: ['images', 'createdBy'],
    });
    if (!style) throw new NotFoundException('Style not found');
    style.viewCount++;
    await this.stylesRepo.save(style);
    return style;
  }

  async update(id: string, dto: UpdateStyleDto, userId: string, userRole: string) {
    const style = await this.stylesRepo.findOne({ where: { id } });
    if (!style) throw new NotFoundException('Style not found');
    if (userRole !== UserRole.ADMIN && style.createdById !== userId) {
      throw new ForbiddenException('Not authorized to update this style');
    }
    Object.assign(style, dto);
    return this.stylesRepo.save(style);
  }

  async remove(id: string, userId: string, userRole: string) {
    const style = await this.stylesRepo.findOne({ where: { id } });
    if (!style) throw new NotFoundException('Style not found');
    if (userRole !== UserRole.ADMIN && style.createdById !== userId) {
      throw new ForbiddenException('Not authorized to delete this style');
    }
    style.isActive = false;
    await this.stylesRepo.save(style);
    return { message: 'Style deleted successfully' };
  }

  async addImages(styleId: string, images: { url: string; thumbnailUrl: string; publicId: string }[]) {
    const style = await this.stylesRepo.findOne({ where: { id: styleId } });
    if (!style) throw new NotFoundException('Style not found');
    const existing = await this.imagesRepo.count({ where: { styleId } });
    const newImages = images.map((img, i) =>
      this.imagesRepo.create({ ...img, styleId, isPrimary: existing === 0 && i === 0, sortOrder: existing + i }),
    );
    return this.imagesRepo.save(newImages);
  }

  async removeImage(styleId: string, imageId: string) {
    const image = await this.imagesRepo.findOne({ where: { id: imageId, styleId } });
    if (!image) throw new NotFoundException('Image not found');
    await this.imagesRepo.remove(image);
    if (image.isPrimary) {
      const next = await this.imagesRepo.findOne({ where: { styleId }, order: { sortOrder: 'ASC' } });
      if (next) { next.isPrimary = true; await this.imagesRepo.save(next); }
    }
    return { message: 'Image removed' };
  }

  async getFilterOptions() {
    const brickNames = await this.stylesRepo.createQueryBuilder('s')
      .select('DISTINCT s.brickName', 'value').where('s.isActive = true AND s.brickName IS NOT NULL')
      .getRawMany();
    const fabricUsed = await this.stylesRepo.createQueryBuilder('s')
      .select('DISTINCT s.fabricUsed', 'value').where('s.isActive = true AND s.fabricUsed IS NOT NULL')
      .getRawMany();
    const fabricContent = await this.stylesRepo.createQueryBuilder('s')
      .select('DISTINCT s.fabricContent', 'value').where('s.isActive = true AND s.fabricContent IS NOT NULL')
      .getRawMany();
    return {
      brickNames: brickNames.map((r) => r.value).filter(Boolean).sort(),
      fabricUsed: fabricUsed.map((r) => r.value).filter(Boolean).sort(),
      fabricContent: fabricContent.map((r) => r.value).filter(Boolean).sort(),
    };
  }

  async bulkExport() {
    return this.stylesRepo.find({ where: { isActive: true }, relations: ['images'] });
  }
}
