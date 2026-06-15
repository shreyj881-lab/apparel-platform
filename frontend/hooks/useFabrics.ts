import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FabricFilters } from '@/types';
import { fabricsApi } from '@/lib/fabrics-api';

export const FABRICS_KEY = 'fabrics';

export function useFabrics(filters: FabricFilters = {}) {
  return useQuery({
    queryKey: [FABRICS_KEY, filters],
    queryFn: () => fabricsApi.getAll(filters),
  });
}

export function useFabric(id: string) {
  return useQuery({
    queryKey: [FABRICS_KEY, id],
    queryFn: () => fabricsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateFabric() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fabricsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [FABRICS_KEY] }),
  });
}

export function useUpdateFabric() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => fabricsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [FABRICS_KEY] }),
  });
}

export function useDeleteFabric() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fabricsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: [FABRICS_KEY] }),
  });
}
