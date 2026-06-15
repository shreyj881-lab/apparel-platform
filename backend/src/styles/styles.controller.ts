import {
  Controller, Get, Post, Put, Patch, Delete, Body, Param,
  Query, UseGuards, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { StylesService } from './styles.service';
import { CreateStyleDto } from './dto/create-style.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
import { FilterStylesDto } from './dto/filter-styles.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../database/entities/user.entity';
import { UploadService } from '../upload/upload.service';

@ApiTags('Styles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'styles', version: '1' })
export class StylesController {
  constructor(
    private stylesService: StylesService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all styles with filters' })
  findAll(@Query() filters: FilterStylesDto) {
    return this.stylesService.findAll(filters);
  }

  @Get('filter-options')
  @Public()
  @ApiOperation({ summary: 'Get available filter options' })
  getFilterOptions() { return this.stylesService.getFilterOptions(); }

  @Get('export')
  @ApiBearerAuth('JWT')
  @Roles(UserRole.ADMIN)
  export() { return this.stylesService.bulkExport(); }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get style by ID' })
  findOne(@Param('id') id: string) { return this.stylesService.findOne(id); }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create new style' })
  create(@Body() dto: CreateStyleDto, @CurrentUser('sub') userId: string) {
    return this.stylesService.create(dto, userId);
  }

  @Put(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update style' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStyleDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: string,
  ) { return this.stylesService.update(id, dto, userId, userRole); }

  @Delete(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete style' })
  remove(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: string,
  ) { return this.stylesService.remove(id, userId, userRole); }

  @Post(':id/images')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Upload images for style' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    const uploaded = await Promise.all(
      files.map((f) => this.uploadService.uploadImage(f, 'styles')),
    );
    return this.stylesService.addImages(id, uploaded);
  }

  @Delete(':id/images/:imageId')
  @ApiBearerAuth('JWT')
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.stylesService.removeImage(id, imageId);
  }
}
