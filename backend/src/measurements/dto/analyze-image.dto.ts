import { IsString, IsOptional } from 'class-validator';

export class AnalyzeImageDto {
  @IsString()
  @IsOptional()
  mannequinId?: string;

  @IsString()
  @IsOptional()
  title?: string;
}
