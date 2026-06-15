import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { StyleImage } from './style-image.entity';

export enum Gender { MEN = 'men', WOMEN = 'women' }
export enum WearCategory { TOP_WEAR = 'top_wear', BOTTOM_WEAR = 'bottom_wear' }

@Entity('styles')
@Index(['gender', 'wearCategory'])
@Index(['brickName'])
@Index(['fabricUsed'])
export class Style {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: WearCategory })
  wearCategory: WearCategory;

  @Column({ length: 100 })
  brickName: string;

  @Column({ length: 100 })
  fabricUsed: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  gsm: number;

  @Column({ length: 200, nullable: true })
  fabricContent: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ length: 50, nullable: true })
  styleCode: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @OneToMany(() => StyleImage, (img) => img.style, { cascade: true, eager: true })
  images: StyleImage[];

  @Column({ type: 'tsvector', select: false, nullable: true })
  searchVector: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
