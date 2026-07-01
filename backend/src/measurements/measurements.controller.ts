import {
  Controller, Get, Post, Put, Delete, Body, Param,
  UseGuards, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { MeasurementsService } from './measurements.service';
import { CreateMannequinDto } from './dto/create-mannequin.dto';
import { AnalyzeImageDto } from './dto/analyze-image.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Measurements')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'measurements', version: '1' })
export class MeasurementsController {
  constructor(private service: MeasurementsService) {}

  // ── Mannequins ──────────────────────────────────────────────────────────────

  @Get('mannequins')
  @Public()
  @ApiOperation({ summary: 'Get all mannequins' })
  findAllMannequins() { return this.service.findAllMannequins(); }

  @Post('mannequins')
  @ApiOperation({ summary: 'Create mannequin' })
  createMannequin(@Body() dto: CreateMannequinDto) { return this.service.createMannequin(dto); }

  @Put('mannequins/:id')
  @ApiOperation({ summary: 'Update mannequin' })
  updateMannequin(@Param('id') id: string, @Body() dto: Partial<CreateMannequinDto>) {
    return this.service.updateMannequin(id, dto);
  }

  @Delete('mannequins/:id')
  @ApiOperation({ summary: 'Delete mannequin' })
  deleteMannequin(@Param('id') id: string) { return this.service.deleteMannequin(id); }

  // ── Spec Sheets ─────────────────────────────────────────────────────────────

  @Get('spec-sheets')
  @ApiOperation({ summary: 'Get all spec sheets' })
  findAllSpecSheets() { return this.service.findAllSpecSheets(); }

  @Get('spec-sheets/:id')
  @ApiOperation({ summary: 'Get spec sheet by ID' })
  findSpecSheet(@Param('id') id: string) { return this.service.findSpecSheet(id); }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze garment image and generate spec sheet' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  analyzeImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AnalyzeImageDto,
  ) { return this.service.analyzeImage(file, dto); }

  @Delete('spec-sheets/:id')
  @ApiOperation({ summary: 'Delete spec sheet' })
  deleteSpecSheet(@Param('id') id: string) { return this.service.deleteSpecSheet(id); }
}
