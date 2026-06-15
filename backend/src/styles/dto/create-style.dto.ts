import { IsString, IsEnum, IsOptional, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Gender, WearCategory } from '../../database/entities/style.entity';

export class CreateStyleDto {
  @ApiProperty({ example: 'Classic Polo Shirt' })
  @IsString() @MaxLength(200)
  name: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: WearCategory })
  @IsEnum(WearCategory)
  wearCategory: WearCategory;

  @ApiProperty({ example: 'Shirt' })
  @IsString() @MaxLength(100)
  brickName: string;

  @ApiProperty({ example: 'Poplin' })
  @IsString() @MaxLength(100)
  fabricUsed: string;

  @ApiPropertyOptional({ example: 140 })
  @IsOptional() @Type(() => Number) @IsNumber() @Min(50) @Max(2000)
  gsm?: number;

  @ApiPropertyOptional({ example: '100% Cotton' })
  @IsOptional() @IsString() @MaxLength(200)
  fabricContent?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Top Wear' })
  @IsOptional() @IsString() @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'ST-2024-001' })
  @IsOptional() @IsString() @MaxLength(50)
  styleCode?: string;
}
