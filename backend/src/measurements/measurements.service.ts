import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { Mannequin } from './entities/mannequin.entity';
import { SpecSheet } from './entities/spec-sheet.entity';
import { CreateMannequinDto } from './dto/create-mannequin.dto';
import { AnalyzeImageDto } from './dto/analyze-image.dto';
import { UploadService } from '../upload/upload.service';

const GARMENT_MASTER_PROMPT = `You are a Senior Garment Pattern Master with over 30 years of experience in men's and women's knit and woven apparel manufacturing.

ANALYSIS PROCESS:
Step 1 - Identify:
- Garment Type
- Gender
- Knit or Woven
- Fabric Weight (GSM estimate)
- Construction details

Step 2 - Estimate Fit Type (choose one):
Skinny / Slim / Regular / Relaxed / Boxy / Oversized / Drop Shoulder / Cropped / Longline

Step 3 - Estimate Ease (numerical values in cm):
Chest ease, Waist ease, Hip ease, Shoulder ease, Sleeve ease, Armhole ease, Length ease, Bottom ease

Step 4 - Generate complete production garment measurements.

Step 5 - Output MUST be valid JSON in this exact structure:
{
  "garmentType": "string",
  "gender": "men|women|unisex",
  "fabricType": "knit|woven",
  "fitType": "string",
  "estimatedGsm": "string (e.g. 180-200)",
  "ease": {
    "chest": number,
    "waist": number,
    "hip": number,
    "shoulder": number,
    "sleeve": number,
    "armhole": number,
    "length": number,
    "bottom": number
  },
  "productionMeasurements": {
    "chest": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "waist": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "hip": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "shoulder": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "acrossChest": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "acrossBack": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "armhole": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "sleeveLength": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "sleeveOpening": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "bicep": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "neckWidth": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "frontNeckDrop": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "backNeckDrop": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "frontLength": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "backLength": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" },
    "hemWidth": { "value": number, "unit": "cm", "confidence": "High|Medium|Low", "note": "string" }
  },
  "constructionNotes": "string",
  "patternNotes": "string",
  "riskAreas": "string",
  "confidenceScore": number
}

IMAGE ANALYSIS RULES:
- Never copy measurements from another brand
- Estimate using: silhouette, drape, wrinkle behavior, seam position, shoulder drop, sleeve volume, neck opening, body proportion, fabric weight, stitching style
- If one side is hidden, infer using garment symmetry
- Always prioritize production feasibility
- Never produce impossible measurements
- Output ONLY the JSON object, no other text`;

@Injectable()
export class MeasurementsService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Mannequin) private mannequinRepo: Repository<Mannequin>,
    @InjectRepository(SpecSheet) private specSheetRepo: Repository<SpecSheet>,
    private config: ConfigService,
    private uploadService: UploadService,
  ) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // ── Mannequins ──────────────────────────────────────────────────────────────

  async createMannequin(dto: CreateMannequinDto) {
    if (dto.isDefault) {
      await this.mannequinRepo.update({ gender: dto.gender }, { isDefault: false });
    }
    const m = this.mannequinRepo.create(dto);
    return this.mannequinRepo.save(m);
  }

  async findAllMannequins() {
    return this.mannequinRepo.find({ order: { gender: 'ASC', createdAt: 'ASC' } });
  }

  async findMannequin(id: string) {
    const m = await this.mannequinRepo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Mannequin not found');
    return m;
  }

  async updateMannequin(id: string, dto: Partial<CreateMannequinDto>) {
    const m = await this.findMannequin(id);
    if (dto.isDefault) {
      await this.mannequinRepo.update({ gender: m.gender }, { isDefault: false });
    }
    Object.assign(m, dto);
    return this.mannequinRepo.save(m);
  }

  async deleteMannequin(id: string) {
    const m = await this.findMannequin(id);
    await this.mannequinRepo.remove(m);
    return { message: 'Deleted' };
  }

  // ── Spec Sheets ─────────────────────────────────────────────────────────────

  async analyzeImage(file: Express.Multer.File, dto: AnalyzeImageDto) {
    if (!this.genAI) throw new BadRequestException('GEMINI_API_KEY not configured in environment variables');

    // Upload image to Cloudinary
    const uploaded = await this.uploadService.uploadImage(file, 'measurements');

    // Get mannequin context if provided
    let mannequinContext = '';
    if (dto.mannequinId) {
      try {
        const mannequin = await this.findMannequin(dto.mannequinId);
        mannequinContext = `\n\nMANNEQUIN BASE MEASUREMENTS (${mannequin.gender} - ${mannequin.name}):\n${JSON.stringify(mannequin.measurements, null, 2)}\n\nApply appropriate wearing ease on top of these base measurements.`;
      } catch {}
    }

    // Call Gemini Vision
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const imagePart: Part = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype as any,
      },
    };

    const result = await model.generateContent([
      GARMENT_MASTER_PROMPT + mannequinContext,
      imagePart,
    ]);

    const rawText = result.response.text();

    // Parse JSON from response
    let parsed: any = {};
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch {
      parsed = { rawAnalysis: rawText };
    }

    // Save spec sheet
    const specSheet = this.specSheetRepo.create({
      title: dto.title || `${parsed.garmentType || 'Garment'} - ${new Date().toLocaleDateString()}`,
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
      garmentType: parsed.garmentType,
      gender: parsed.gender,
      fabricType: parsed.fabricType,
      fitType: parsed.fitType,
      estimatedGsm: parsed.estimatedGsm,
      ease: parsed.ease,
      productionMeasurements: parsed.productionMeasurements,
      constructionNotes: parsed.constructionNotes,
      patternNotes: parsed.patternNotes,
      riskAreas: parsed.riskAreas,
      confidenceScore: parsed.confidenceScore,
      rawAnalysis: rawText,
      mannequinId: dto.mannequinId || null,
    });

    return this.specSheetRepo.save(specSheet);
  }

  async findAllSpecSheets() {
    return this.specSheetRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findSpecSheet(id: string) {
    const s = await this.specSheetRepo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Spec sheet not found');
    return s;
  }

  async deleteSpecSheet(id: string) {
    const s = await this.findSpecSheet(id);
    if (s.imagePublicId) {
      try { await this.uploadService.deleteImage(s.imagePublicId); } catch {}
    }
    await this.specSheetRepo.remove(s);
    return { message: 'Deleted' };
  }
}
