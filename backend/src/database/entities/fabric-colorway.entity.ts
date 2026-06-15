import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Fabric } from './fabric.entity';

@Entity('fabric_colorways')
export class FabricColorway {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  colorName: string;

  @Column({ length: 20, nullable: true })
  colorCode: string;

  @Column({ length: 500, nullable: true })
  imageUrl: string;

  @Column({ length: 200, nullable: true })
  publicId: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Fabric, (fabric) => fabric.colorways, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fabricId' })
  fabric: Fabric;

  @Column()
  fabricId: string;

  @CreateDateColumn()
  createdAt: Date;
}
