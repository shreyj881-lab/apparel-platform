'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel, loading, confirmLabel = 'Confirm', variant = 'default' }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl">
        <div className="flex items-start gap-4">
          {variant === 'danger' && (
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${variant === 'danger' ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}>
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
