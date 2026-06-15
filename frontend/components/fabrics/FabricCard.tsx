'use client';
import React, { useState } from 'react';
import { Eye, Edit2, Trash2, DollarSign } from 'lucide-react';
import { Fabric } from '@/types';
import { getPrimaryImage } from '@/lib/utils';
import { ImageViewer } from '@/components/shared/ImageViewer';

interface Props { fabric: Fabric; onEdit?: (f: Fabric) => void; onDelete?: (f: Fabric) => void; isAdmin?: boolean; }

export function FabricCard({ fabric, onEdit, onDelete, isAdmin }: Props) {
  const [viewer, setViewer] = useState(false);
  const primary = getPrimaryImage(fabric.images);

  return (
    <>
      <div className="luxury-card group">
        <div className="zoom-container relative aspect-square overflow-hidden rounded-t-2xl bg-muted">
          <img src={primary} alt={fabric.name} className="h-full w-full object-cover" loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <button onClick={() => setViewer(true)}
              className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-3 transition-all duration-200 shadow-lg">
              <Eye className="h-4 w-4" />
            </button>
          </div>
          {fabric.colorways?.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {fabric.colorways.slice(0, 4).map((c) => (
                <div key={c.id} title={c.colorName}
                  className="h-4 w-4 rounded-full border-2 border-white shadow"
                  style={{ background: c.colorCode || '#ccc' }} />
              ))}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{fabric.name}</h3>
          {fabric.articleNumber && <p className="text-xs text-muted-foreground font-mono">{fabric.articleNumber}</p>}
          <p className="mt-1 text-xs text-muted-foreground">{fabric.fabricUsed}{fabric.gsm ? ` · ${fabric.gsm} GSM` : ''}</p>
          {fabric.fabricContent && <p className="text-xs text-muted-foreground truncate">{fabric.fabricContent}</p>}
          {fabric.pricePerMeter && (
            <p className="mt-1 text-xs font-semibold text-primary flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {fabric.currency || '₹'}{fabric.pricePerMeter}/m
            </p>
          )}
          {fabric.supplierName && <p className="text-xs text-muted-foreground mt-0.5 truncate">{fabric.supplierName}</p>}
          {isAdmin && (
            <div className="mt-3 flex gap-2">
              {onEdit && (
                <button onClick={() => onEdit(fabric)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs hover:bg-muted transition">
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(fabric)}
                  className="flex items-center justify-center rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10 transition">
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {viewer && fabric.images.length > 0 && (
        <ImageViewer images={fabric.images} onClose={() => setViewer(false)} />
      )}
    </>
  );
}
