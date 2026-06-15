'use client';
import React from 'react';
import { Search, X } from 'lucide-react';
import { StyleFilters as Filters, FilterOptions, Gender, WearCategory } from '@/types';

interface Props {
  filters: Filters;
  options?: FilterOptions;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
}

export function StyleFiltersBar({ filters, options, onChange, onReset }: Props) {
  const hasActive = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value || undefined })}
          placeholder="Search styles…"
          className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <select value={filters.gender || ''} onChange={(e) => onChange({ gender: (e.target.value as Gender) || undefined })}
        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
        <option value="">All Genders</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
      </select>

      <select value={filters.wearCategory || ''} onChange={(e) => onChange({ wearCategory: (e.target.value as WearCategory) || undefined })}
        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
        <option value="">All Categories</option>
        <option value="top_wear">Top Wear</option>
        <option value="bottom_wear">Bottom Wear</option>
      </select>

      {options?.brickNames?.length ? (
        <select value={filters.brickName || ''} onChange={(e) => onChange({ brickName: e.target.value || undefined })}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">All Bricks</option>
          {options.brickNames.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      ) : null}

      {options?.fabricTypes?.length ? (
        <select value={filters.fabricUsed || ''} onChange={(e) => onChange({ fabricUsed: e.target.value || undefined })}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">All Fabrics</option>
          {options.fabricTypes.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      ) : null}

      {hasActive && (
        <button onClick={onReset} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition">
          <X className="h-3.5 w-3.5" /> Reset
        </button>
      )}
    </div>
  );
}
