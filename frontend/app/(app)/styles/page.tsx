'use client';
import React, { useState, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppShell } from '@/components/layout/AppShell';
import { StyleCard } from '@/components/styles/StyleCard';
import { StyleFiltersBar } from '@/components/styles/StyleFilters';
import { StyleForm } from '@/components/styles/StyleForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { useStyles, useStyleFilterOptions, useCreateStyle, useUpdateStyle, useDeleteStyle } from '@/hooks/useStyles';
import { useAuth } from '@/hooks/useAuth';
import { Style, StyleFilters } from '@/types';
import { stylesApi } from '@/lib/styles-api';
import { downloadBlob } from '@/lib/utils';

const DEFAULT: StyleFilters = { page: 1, limit: 24, sortBy: 'createdAt', sortOrder: 'DESC' };

export default function StylesPage() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<StyleFilters>(DEFAULT);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Style | null>(null);
  const [deleting, setDeleting] = useState<Style | null>(null);

  const { data, isLoading } = useStyles(filters);
  const { data: options } = useStyleFilterOptions();
  const createMut = useCreateStyle();
  const updateMut = useUpdateStyle();
  const deleteMut = useDeleteStyle();

  const patchFilters = useCallback((f: Partial<StyleFilters>) =>
    setFilters((prev) => ({ ...prev, ...f, page: 1 })), []);

  const handleSubmit = async (formData: any) => {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: formData });
        toast.success('Style updated');
      } else {
        await createMut.mutateAsync(formData);
        toast.success('Style created');
      }
      setShowForm(false); setEditing(null);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success('Style deleted');
      setDeleting(null);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleExport = async () => {
    try {
      const blob = await stylesApi.bulkExport();
      downloadBlob(blob as Blob, 'styles-export.xlsx');
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <AppShell title="Styles">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex-1">
            <StyleFiltersBar
              filters={filters} options={options}
              onChange={patchFilters} onReset={() => setFilters(DEFAULT)}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            {isAdmin && (
              <>
                <button onClick={handleExport}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-muted transition">
                  <Download className="h-4 w-4" /> Export
                </button>
                <button onClick={() => { setEditing(null); setShowForm(true); }}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
                  <Plus className="h-4 w-4" /> Add Style
                </button>
              </>
            )}
          </div>
        </div>

        {/* Count */}
        {data && (
          <p className="text-xs text-muted-foreground">
            {data.total} style{data.total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        {isLoading ? <PageLoader /> : data?.items?.length ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {data.items.map((s) => (
                <StyleCard key={s.id} style={s} isAdmin={isAdmin}
                  onEdit={(s) => { setEditing(s); setShowForm(true); }}
                  onDelete={setDeleting}
                />
              ))}
            </div>
            {/* Pagination */}
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
          <EmptyState
            title="No styles found"
            description="Try adjusting your filters or add a new style."
            action={isAdmin ? (
              <button onClick={() => setShowForm(true)} className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition">
                Add First Style
              </button>
            ) : undefined}
          />
        )}
      </div>

      {showForm && (
        <StyleForm style={editing} onClose={() => { setShowForm(false); setEditing(null); }}
          onSubmit={handleSubmit} loading={createMut.isPending || updateMut.isPending} />
      )}
      <ConfirmDialog
        open={!!deleting} variant="danger"
        title="Delete Style" description={`Delete "${deleting?.name}"? This cannot be undone.`}
        confirmLabel="Delete" loading={deleteMut.isPending}
        onConfirm={handleDelete} onCancel={() => setDeleting(null)}
      />
    </AppShell>
  );
}
