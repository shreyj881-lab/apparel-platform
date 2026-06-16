'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Trash2 } from 'lucide-react';
import { Fabric } from '@/types';

const schema = z.object({
  name: z.string().min(2).max(200),
  brickName: z.string().min(1),
  fabricUsed: z.string().min(1),
  gsm: z.coerce.number().optional(),
  fabricContent: z.string().optional(),
  supplierName: z.string().optional(),
  width: z.coerce.number().optional(),
  widthUnit: z.string().optional(),
  moq: z.coerce.number().optional(),
  moqUnit: z.string().optional(),
  articleNumber: z.string().optional(),
  pricePerMeter: z.coerce.number().optional(),
  currency: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props { fabric?: Fabric | null; onSubmit: (d: FormData, images: File[]) => Promise<void>; onClose: () => void; loading?: boolean; }

export function FabricForm({ fabric, onSubmit, onClose, loading }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: fabric ? { ...fabric } : {},
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => { if (fabric) reset({ ...fabric }); }, [fabric]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const F = ({ label, name, err, ...rest }: any) => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input {...register(name)} {...rest}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      {err && <p className="text-xs text-destructive mt-0.5">{err.message}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-card border border-border shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">{fabric ? 'Edit Fabric' : 'Add Fabric'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => onSubmit(d, images))} className="p-5 grid grid-cols-2 gap-4">
          <div className="col-span-2"><F label="Fabric Name *" name="name" placeholder="e.g. Premium Tweed" err={errors.name} /></div>
          <F label="Brick Name *" name="brickName" placeholder="e.g. Jackets & Coats" err={errors.brickName} />
          <F label="Fabric Type *" name="fabricUsed" placeholder="e.g. Tweed Boucle" err={errors.fabricUsed} />
          <F label="GSM" name="gsm" type="number" placeholder="300" />
          <F label="Article Number" name="articleNumber" placeholder="ART-001" />
          <div className="col-span-2"><F label="Fabric Content" name="fabricContent" placeholder="70% Poly 30% Viscose" /></div>
          <F label="Supplier Name" name="supplierName" placeholder="Supplier Ltd." />
          <F label="Price / Meter" name="pricePerMeter" type="number" placeholder="120" />
          <F label="Currency" name="currency" placeholder="INR" />
          <F label="Width" name="width" type="number" placeholder="150" />
          <F label="Width Unit" name="widthUnit" placeholder="cm" />
          <F label="MOQ" name="moq" type="number" placeholder="100" />
          <F label="MOQ Unit" name="moqUnit" placeholder="meters" />
          <div className="col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Notes</label>
            <textarea {...register('notes')} rows={3} placeholder="Additional notes…"
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
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-border px-5 py-2 text-sm hover:bg-muted transition">Cancel</button>
            <button type="submit" disabled={loading}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">
              {loading ? 'Saving…' : fabric ? 'Update Fabric' : 'Create Fabric'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}