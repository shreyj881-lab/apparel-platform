'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Trash2 } from 'lucide-react';
import { Style } from '@/types';

const schema = z.object({
  name: z.string().min(2).max(200),
  gender: z.enum(['men', 'women']),
  wearCategory: z.enum(['top_wear', 'bottom_wear']),
  brickName: z.string().min(1).max(100),
  fabricUsed: z.string().min(1).max(100),
  gsm: z.coerce.number().optional(),
  fabricContent: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  styleCode: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  style?: Style | null;
  onSubmit: (data: FormData, images: File[]) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export function StyleForm({ style, onSubmit, onClose, loading }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: style ? {
      name: style.name, gender: style.gender, wearCategory: style.wearCategory,
      brickName: style.brickName, fabricUsed: style.fabricUsed,
      gsm: style.gsm, fabricContent: style.fabricContent || '',
      description: style.description || '', category: style.category || '',
      styleCode: style.