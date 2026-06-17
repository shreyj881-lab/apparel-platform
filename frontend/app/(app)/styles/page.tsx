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
    setFilters((prev) => ({ ...prev,