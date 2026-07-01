import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum MannequinGender { MALE = 'male', FEMALE = 'female' }

@Entity('mannequins')
export class Mannequin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MannequinGender })
  gender: MannequinGender;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'jsonb' })
  measurements: Record<string, any>;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
