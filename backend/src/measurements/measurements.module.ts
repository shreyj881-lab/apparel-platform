import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { Mannequin } from './entities/mannequin.entity';
import { SpecSheet } from './entities/spec-sheet.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mannequin, SpecSheet]), UploadModule],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
})
export class MeasurementsModule {}
