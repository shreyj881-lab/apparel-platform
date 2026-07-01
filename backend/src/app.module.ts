import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StylesModule } from './styles/styles.module';
import { FabricsModule } from './fabrics/fabrics.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { User } from './database/entities/user.entity';
import { Style } from './database/entities/style.entity';
import { StyleImage } from './database/entities/style-image.entity';
import { Fabric } from './database/entities/fabric.entity';
import { FabricImage } from './database/entities/fabric-image.entity';
import { FabricColorway } from './database/entities/fabric-colorway.entity';
import { AuditLog } from './database/entities/audit-log.entity';
import { Mannequin } from './measurements/entities/mannequin.entity';
import { SpecSheet } from './measurements/entities/spec-sheet.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [User, Style, StyleImage, Fabric, FabricImage, FabricColorway, AuditLog, Mannequin, SpecSheet],
        synchronize: true,
        logging: false,
        ssl: { rejectUnauthorized: false },
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: false,
      }),
    }),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    AuthModule,
    UsersModule,
    StylesModule,
    FabricsModule,
    UploadModule,
    SearchModule,
    DashboardModule,
    HealthModule,
    MeasurementsModule,
  ],
})
export class AppModule {}
