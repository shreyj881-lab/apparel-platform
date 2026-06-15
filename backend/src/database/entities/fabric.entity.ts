import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { FabricImage } from './fabric-image.entity';
import { FabricColorway } from './fabric-colorway.entity';

@Entity('fabrics')
@Index(['fabricUsed'])
@Index(['supplierName'])
export class Fabric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 100, nullable: true })
  brickName: string;

  @Column({ length: 100 })
  fabricUsed: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  gsm: number;

  @Column({ length: 200, nullable: true })
  fabricContent: string;

  @Column({ length: 200, nullable: true })
  supplierName: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  width: number;

  @Column({ length: 20, nullable: true })
  widthUnit: string;

  @Column({ nullable: true })
  moq: number;

  @Column({ length: 50, nullable: true })
  moqUnit: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 100, nullable: true })
  articleNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerMeter: number;

  @Column({ length: 10, nullable: true })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @OneToMany(() => FabricImage, (img) => img.fabric, { cascade: true, eager: true })
  images: FabricImage[];

  @OneToMany(() => FabricColorway, (cw) => cw.fabric, { cascade: true, eager: true })
  colorways: FabricColorway[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
