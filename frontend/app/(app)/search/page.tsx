'use client';
import React, { useState } from 'react';
import { Search, Shirt, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { getPrimaryImage, genderLabel, wearLabel } from '@/lib/utils';
import api from '@/lib/api';
import { SearchResult } from '@/types';

function useSearch(q: string) {
  return useQuery<SearchResult>({
    queryKey: ['search', q],
    queryFn: () => api.get('/search', { params: { q } }),
    enabled: q.length >= 2,
  });
}

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { data, isLoading } = useSearch(submitted);

  return (
    <AppShell title="Search">
      <div className="max-w-3xl mx-auto space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(q); }} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search styles, fabrics, brick names…"
              className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button type="submit" className="rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
            Search
          </button>
        </form>

        {isLoading && <PageLoader />}

        {data && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">{data.total} results for &ldquo;{submitted}&rdquo;</p>

            {data.styles?.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Shirt className="h-4 w-4" /> Styles ({data.styles.length})
                </h2>
                <div className="space-y-2">
                  {data.styles.map((s) => (
                    <div key={s.id} className="luxury-card flex items-center gap-4 p-3">
                      <img src={getPrimaryImage(s.images)} alt={s.name}
                        className="h-14 w-10 rounded-lg object-cover bg-muted shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{genderLabel(s.gender)} · {wearLabel(s.wearCategory)} · {s.brickName}</p>
                        <p className="text-xs text-muted-foreground">{s.fabricUsed}{s.gsm ? ` · ${s.gsm} GSM` : ''}</p>
                      </div>
                      {s.styleCode && <span className="ml-auto shrink-0 text-xs font-mono text-muted-foreground">{s.styleCode}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.fabrics?.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Package className="h-4 w-4" /> Fabrics ({data.fabrics.length})
                </h2>
                <div className="space-y-2">
                  {data.fabrics.map((f) => (
                    <div key={f.id} className="luxury-card flex items-center gap-4 p-3">
                      <img src={getPrimaryImage(f.images)} alt={f.name}
                        className="h-14 w-14 rounded-lg object-cover bg-muted shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.fabricUsed}{f.gsm ? ` · ${f.gsm} GSM` : ''}</p>
                        {f.supplierName && <p className="text-xs text-muted-foreground">{f.supplierName}</p>}
                      </div>
                      {f.pricePerMeter && (
                        <span className="ml-auto shrink-0 text-xs font-semibold text-primary">{f.currency || '₹'}{f.pricePerMeter}/m</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.total === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
