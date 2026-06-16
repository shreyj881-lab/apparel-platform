import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, UseGuards, UploadedFiles, UseInterceptors, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FabricsService } from './fabrics.service';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
import { FilterFabricsDto } from './dto/filter-fabrics.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UploadService } from '../upload/upload.service';

@ApiTags('Fabrics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'fabrics', version: '1' })
export class FabricsController {
  constructor(private fabricsService: FabricsService, private uploadService: UploadService) {}

  @Get() @Public()
  findAll(@Query() filters: FilterFabricsDto) { return this.fabricsService.findAll(filters); }

  @Get('filter-options') @Public()
  getFilterOptions() { return this.fabricsService.getFilterOptions(); }

  @Get('export') @ApiBearerAuth('JWT')
  async exportAll(@Res() res: Response) {
    const fabrics = await this.fabricsService.bulkExport();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=fabrics-export.json');
    return res.json(fabrics);
  }

  @Get(':id') @Public()
  findOne(@Param('id') id: string) { return this.fabricsService.findOne(id); }

  @Post() @ApiBearerAuth('JWT')
  create(@Body() dto: CreateFabricDto, @CurrentUser('sub') userId: string) {
    return this.fabricsService.create(dto, userId);
  }

  @Put(':id') @ApiBearerAuth('JWT')
  update(@Param('id') id: string, @Body() dto: UpdateFabricDto) {
    return this.fabricsService.update(id,