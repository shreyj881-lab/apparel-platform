import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StylesController } from './styles.controller';
import { StylesService } from './styles.service';
import { Style } from '../database/entities/style.entity';
import { StyleImage } from '../database/entities/style-image.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Style, StyleImage]), UploadModule],
  controllers: [StylesController],
  providers: [StylesService],
  exports: [StylesService],
})
export class StylesModule {}
