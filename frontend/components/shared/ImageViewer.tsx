'use client';
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  images: { url: string; altText?: string }[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const prev = useCallback(() => { setIdx((i) => (i - 1 + images.length) % images.length); setZoom(1); }, [images.length]);
  const next = useCallback(() => { setIdx((i) => (i + 1) % images.length); setZoom(1); }, [images.length]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') onClose();
  }, [prev, next, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      onKeyDown={handleKey}
      tabIndex={0}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.5, 4)); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
          <ZoomIn className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.5, 0.5)); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
          <ZoomOut className="h-5 w-5" />
        </button>
        <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
          <X className="h-5 w-5" />
        </button>
      </div>
      {/* Image */}
      <div className="relative max-h-[85vh] max-w-[85vw] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[idx].url}
          alt={images[idx].altText || ''}
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s', maxHeight: '85vh', maxWidth: '85vw', objectFit: 'contain' }}
        />
      </div>
      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {idx + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
