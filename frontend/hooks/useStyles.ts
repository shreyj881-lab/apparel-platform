import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StyleFilters } from '@/types';
import { stylesApi } from '@/lib/styles-api';

export const STYLES_KEY = 'styles';

export function useStyles(filters: StyleFilters = {}) {
  return useQuery({
    queryKey: [STYLES_KEY, filters],
    queryFn: () => stylesApi.getAll(filters),
  });
}

export function useStyle(id: string) {
  return useQuery({
    queryKey: [STYLES_KEY, id],
    queryFn: () => stylesApi.getOne(id),
    enabled: !!id,
  });
}

export function useStyleFilterOptions() {
  return useQuery({
    queryKey: [STYLES_KEY, 'filter-options'],
    queryFn: stylesApi.getFilterOptions,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateStyle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: stylesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [STYLES_KEY] }),
  });
}

export function useUpdateStyle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => stylesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [STYLES_KEY] }),
  });
}

export function useDeleteStyle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: stylesApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: [STYLES_KEY] }),
  });
}
