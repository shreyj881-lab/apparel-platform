import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'uploads') {
    if (!file) throw new BadRequestException('No file provided');
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) throw new BadRequestException('File too large (max 10MB)');
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPG, PNG, WEBP allowed');
    }

    return new Promise<{ url: string; thumbnailUrl: string; publicId: string; width: number; height: number }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `apparel-platform/${folder}`,
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(new BadRequestException(`Upload failed: ${error.message}`));
            else {
              const thumbnailUrl = cloudinary.url(result.public_id, {
                width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto',
              });
              resolve({
                url: result.secure_url,
                thumbnailUrl,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
              });
            }
          },
        );
        stream.end(file.buffer);
      },
    );
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  async uploadMultiple(files: Express.Multer.File[], folder: string) {
    return Promise.all(files.map((f) => this.uploadImage(f, folder)));
  }
}
