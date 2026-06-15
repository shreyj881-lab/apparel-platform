import { IsString, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFabricDto {
  @ApiProperty() @IsString() @MaxLength(200) name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) brickName?: string;
  @ApiProperty() @IsString() @MaxLength(100) fabricUsed: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(50) gsm?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) fabricContent?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) supplierName?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() width?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) widthUnit?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() moq?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) moqUnit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) articleNumber?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() pricePerMeter?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(10) currency?: string;
}
