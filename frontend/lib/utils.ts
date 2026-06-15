import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(date));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-IN').format(n);
}

export function getPrimaryImage(images: { url: string; isPrimary: boolean }[]): string {
  if (!images?.length) return '/placeholder.jpg';
  return (images.find((i) => i.isPrimary) ?? images[0]).url;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function genderLabel(g: string) {
  return g === 'men' ? 'Men' : 'Women';
}

export function wearLabel(w: string) {
  return w === 'top_wear' ? 'Top Wear' : 'Bottom Wear';
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}
