'use client';
import React, { useState, useCallback } from 'react';
import { Plus, Download, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppShell } from '@/components/layout/AppShell';
import { FabricCard } from '@/components/fabrics/FabricCard';
import { FabricForm } from '@/components/fabrics/FabricForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { useFabrics, useCreateFabric, useUpdateFabric, useDeleteFabric } from '@/hooks/useFabrics';
import { useAuth } from '@/hooks/useAuth';
import { Fabric, FabricFilters } from '@/types';
import { fabricsApi } from '@/lib/fabrics-api';
import { downloadBlob } from '@/lib/utils';

const DEFAULT: FabricFilters = { page: 1, limit: 24 };

export default function FabricsPage() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<FabricFilters>(DEFAULT);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Fabric | null>(null);
  const [deleting, setDeleting] = useState<Fabric | null>(null);

  const { data, isLoading } = useFabrics(filters);
  const createMut = useCreateFabric();
  const updateMut = useUpdateFabric();
  const deleteMut = useDeleteFabric();

  const handleSubmit = async (formData: any) => {
    try {
      if (editing) { await updateMut.mutateAsync({ id: editing.id, data: formData }); toast.success('Fabric updated'); }
      else { await createMut.mutateAsync(formData); toast.success('Fabric created'); }
      setShowForm(false); setEditing(null);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try { await deleteMut.mutateAsync(deleting.id); toast.success('Fabric deleted'); setDeleting(null); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <AppShell title="Fabric Library">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={filters.search || ''} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined, page: 1 }))}
              placeholder="Search fabrics…"
              className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          {filters.search && (
            <button onClick={() => setFilters(DEFAULT)} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition">
              <X className="h-3.5 w-3.5" /> Reset
            </button>
          )}
          {isAdmin && (
            <>
              <button onClick={async () => { try { const b = await fabricsApi.bulkExport(); downloadBlob(b as unknown as Blob, 'fabrics-export.xlsx'); } catch (e: any) { toast.error(e.message); }}}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-muted transition">
                <Download className="h-4 w-4" /> Export
              </button>
              <button onClick={() => { setEditing(null); setShowForm(true); }}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
                <Plus className="h-4 w-4" /> Add Fabric
              </button>
            </>
          )}
        </div>

        {data && <p className="text-xs text-muted-foreground">{data.total} fabric{data.total !== 1 ? 's' : ''}</p>}

        {isLoading ? <PageLoader /> : data?.items?.length ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {data.items.map((f) => (
                <FabricCard key={f.id} fabric={f} isAdmin={isAdmin}
                  onEdit={(f) => { setEditing(f); setShowForm(true); }} onDelete={setDeleting} />
              ))}
            </div>
            {data.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setFilters((f) => ({ ...f, page: p }))}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition ${filters.page === p ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState title="No fabrics yet" description="Add fabrics to build your library." />
        )}
      </div>

      {showForm && (
        <FabricForm fabric={editing} onClose={() => { setShowForm(false); setEditing(null); }}
          onSubmit={handleSubmit} loading={createMut.isPending || updateMut.isPending} />
      )}
      <ConfirmDialog open={!!deleting} variant="danger" title="Delete Fabric"
        description={`Delete "${deleting?.name}"?`} confirmLabel="Delete"
        loading={deleteMut.isPending} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
    </AppShell>
  );
}
