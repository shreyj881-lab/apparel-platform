import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Style } from './style.entity';

@Entity('style_images')
export class StyleImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ length: 200, nullable: true })
  publicId: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ nullable: true, length: 200 })
  altText: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @ManyToOne(() => Style, (style) => style.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'styleId' })
  style: Style;

  @Column()
  styleId: string;

  @CreateDateColumn()
  createdAt: Date;
}
