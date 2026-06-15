import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricsController } from './fabrics.controller';
import { FabricsService } from './fabrics.service';
import { Fabric } from '../database/entities/fabric.entity';
import { FabricImage } from '../database/entities/fabric-image.entity';
import { FabricColorway } from '../database/entities/fabric-colorway.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fabric, FabricImage, FabricColorway]), UploadModule],
  controllers: [FabricsController],
  providers: [FabricsService],
  exports: [FabricsService],
})
export class FabricsModule {}
