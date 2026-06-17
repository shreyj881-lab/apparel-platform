import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, UseGuards, UploadedFiles, UseInterceptors, Header,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
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
  exportAll() { return this.fabricsService.bulkExport(); }

  @Get(':id') @Public()
  findOne(@Param('id') id: string) { return this.fabricsService.findOne(id); }

  @Post() @ApiBearerAuth('JWT')
  create(@Body() dto: CreateFabricDto, @CurrentUser('sub') userId: string) {
    return this.fabricsService.create(dto, userId);
  }

  @Put(':id') @ApiBearerAuth('JWT')
  update(@Param('id') id: string, @Body() dto: UpdateFabricDto) {
    return this.fabricsService.update(id, dto);
  }

  @Delete(':id') @ApiBearerAuth('JWT')
  remove(@Param('id') id: string) { return this.fabricsService.remove(id); }

  @Post(':id/images') @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    const uploaded = await Promise.all(files.map((f) => this.uploadService.uploadImage(f, 'fabrics')));
    return this.fabricsService.addImages(id, uploaded);
  }

  @Post(':id/colorways') @ApiBearerAuth('JWT')
  @UseInterceptors(FilesInterceptor('image', 1))
  async addColorway(
    @Param('id') id: string,
    @Body() body: { colorName: string; colorCode?: string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageData = {};
    if (files?.length) {
      const uploaded = await this.uploadService.uploadImage(files[0], 'colorways');
      imageData = { imageUrl: uploaded.url, publicId: uploaded.publicId };
    }
    return this.fabricsService.addColorway(id, { ...body, ...imageData });
  }

  @Delete(':id/colorways/:colorwayId') @ApiBearerAuth('JWT')
  removeColorway(@Param('id') id: string, @Param('colorwayId') colorwayId: string) {
    return this.fabricsService.removeColorway(id, colorwayId);
  }
}