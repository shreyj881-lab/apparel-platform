'use client';
import React, { useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Style } from '@/types';
import { getPrimaryImage, genderLabel, wearLabel } from '@/lib/utils';
import { ImageViewer } from '@/components/shared/ImageViewer';

interface Props {
  style: Style;
  onEdit?: (s: Style) => void;
  onDelete?: (s: Style) => void;
  isAdmin?: boolean;
}

export function StyleCard({ style, onEdit, onDelete, isAdmin }: Props) {
  const [viewer, setViewer] = useState(false);
  const primary = getPrimaryImage(style.images);

  return (
    <>
      <div className="luxury-card group">
        <div className="zoom-container relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-muted">
          <img
            src={primary}
            alt={style.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <button onClick={() => setViewer(true)}
              className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-3 transition-all duration-200 shadow-lg">
              <Eye className="h-4 w-4" />
            </button>
          </div>
          {style.styleCode && (
            <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white font-mono">
              {style.styleCode}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{style.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{style.fabricUsed} · {style.gsm ? `${style.gsm} GSM` : ''}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
              {genderLabel(style.gender)}
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {wearLabel(style.wearCategory)}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground truncate">{style.brickName}</p>
          {style.fabricContent && (
            <p className="text-xs text-muted-foreground truncate">{style.fabricContent}</p>
          )}
          {isAdmin && (
            <div className="mt-3 flex gap-2">
              {onEdit && (
                <button onClick={() => onEdit(style)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs hover:bg-muted transition">
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(style)}
                  className="flex items-center justify-center rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10 transition">
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {viewer && style.images.length > 0 && (
        <ImageViewer images={style.images} onClose={() => setViewer(false)} />
      )}
    </>
  );
}
