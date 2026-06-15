import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterFabricsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brickName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fabricUsed?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fabricContent?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supplierName?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() gsmMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() gsmMax?: number;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string = 'createdAt';
  @ApiPropertyOptional() @IsOptional() @IsString() sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
