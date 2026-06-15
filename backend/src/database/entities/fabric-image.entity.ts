import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Fabric } from './fabric.entity';

@Entity('fabric_images')
export class FabricImage {
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

  @ManyToOne(() => Fabric, (fabric) => fabric.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fabricId' })
  fabric: Fabric;

  @Column()
  fabricId: string;

  @CreateDateColumn()
  createdAt: Date;
}
