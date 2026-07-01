import { IsEnum, IsString, IsBoolean, IsObject, IsOptional } from 'class-validator';
import { MannequinGender } from '../entities/mannequin.entity';

export class CreateMannequinDto {
  @IsEnum(MannequinGender)
  gender: MannequinGender;

  @IsString()
  name: string;

  @IsObject()
  measurements: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
