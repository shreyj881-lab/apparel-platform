import { Controller, Post, UploadedFiles, UseInterceptors, UseGuards, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Upload')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'upload', version: '1' })
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('images')
  @ApiOperation({ summary: 'Upload multiple images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(@UploadedFiles() files: Express.Multer.File[], @Body('folder') folder = 'general') {
    return this.uploadService.uploadMultiple(files, folder);
  }
}
