import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Style } from '../database/entities/style.entity';
import { Fabric } from '../database/entities/fabric.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Style, Fabric, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
