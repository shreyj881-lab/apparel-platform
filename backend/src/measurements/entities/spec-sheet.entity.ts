import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('spec_sheets')
export class SpecSheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200, nullable: true })
  title: string;

  @Column({ length: 200, nullable: true })
  imageUrl: string;

  @Column({ length: 200, nullable: true })
  imagePublicId: string;

  @Column({ length: 100, nullable: true })
  garmentType: string;

  @Column({ length: 20, nullable: true })
  gender: string;

  @Column({ length: 20, nullable: true })
  fabricType: string;

  @Column({ length: 50, nullable: true })
  fitType: string;

  @Column({ length: 20, nullable: true })
  estimatedGsm: string;

  @Column({ type: 'jsonb', nullable: true })
  ease: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  productionMeasurements: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  constructionNotes: string;

  @Column({ type: 'text', nullable: true })
  patternNotes: string;

  @Column({ type: 'text', nullable: true })
  riskAreas: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  confidenceScore: number;

  @Column({ type: 'text', nullable: true })
  rawAnalysis: string;

  @Column({ nullable: true })
  mannequinId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
