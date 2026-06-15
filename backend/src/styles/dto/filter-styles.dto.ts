import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, WearCategory } from '../../database/entities/style.entity';

export class FilterStylesDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
  @ApiPropertyOptional({ enum: WearCategory }) @IsOptional() @IsEnum(WearCategory) wearCategory?: WearCategory;
  @ApiPropertyOptional() @IsOptional() @IsString() brickName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fabricUsed?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fabricContent?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() gsmMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() gsmMax?: number;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsNumber() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsNumber() limit?: number = 20;
  @ApiPropertyOptional({ default: 'createdAt' }) @IsOptional() @IsString() sortBy?: string = 'createdAt';
  @ApiPropertyOptional({ default: 'DESC' }) @IsOptional() @IsString() sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
