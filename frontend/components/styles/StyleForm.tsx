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
      styleCode: style.styleCode || '',
    } : { gender: 'men', wearCategory: 'top_wear' },
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => { if (style) reset({ ...style }); }, [style]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const F = ({ label, name, error, ...rest }: any) => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input {...register(name)} {...rest}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      {error && <p className="text-xs text-destructive mt-0.5">{error.message}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-card border border-border shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-foreground">{style ? 'Edit Style' : 'Add Style'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted transition"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => onSubmit(d, images))} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <F label="Style Name *" name="name" placeholder="e.g. Slim Fit Blazer" error={errors.name} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Gender *</label>
              <select {...register('gender')} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Wear Category *</label>
              <select {...register('wearCategory')} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="top_wear">Top Wear</option>
                <option value="bottom_wear">Bottom Wear</option>
              </select>
            </div>
            <F label="Brick Name *" name="brickName" placeholder="e.g. Jackets & Coats" error={errors.brickName} />
            <F label="Fabric Used *" name="fabricUsed" placeholder="e.g. Tweed Boucle" error={errors.fabricUsed} />
            <F label="GSM" name="gsm" type="number" placeholder="300" error={errors.gsm} />
            <F label="Style Code" name="styleCode" placeholder="e.g. ST-001" error={errors.styleCode} />
            <div className="col-span-2">
              <F label="Fabric Content" name="fabricContent" placeholder="e.g. 70% Poly 30% Viscose" error={errors.fabricContent} />
            </div>
            <F label="Category" name="category" placeholder="e.g. Casual" error={errors.category} />
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
              <textarea {...register('description')} rows={3} placeholder="Style description..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-2">Images</label>
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border border-border">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition">
                <Upload className="h-4 w-4" />
                <span>Click to upload images</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-border px-5 py-2 text-sm hover:bg-muted transition">Cancel</button>
            <button type="submit" disabled={loading}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">
              {loading ? 'Saving...' : style ? 'Update Style' : 'Create Style'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}