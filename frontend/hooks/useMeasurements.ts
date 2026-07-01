import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { measurementsApi } from '@/lib/measurements-api';
import toast from 'react-hot-toast';

export function useMannequins() {
  return useQuery({ queryKey: ['mannequins'], queryFn: () => measurementsApi.getMannequins() });
}

export function useCreateMannequin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: measurementsApi.createMannequin,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mannequins'] }); toast.success('Mannequin saved'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateMannequin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => measurementsApi.updateMannequin(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mannequins'] }); toast.success('Updated'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteMannequin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: measurementsApi.deleteMannequin,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mannequins'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useSpecSheets() {
  return useQuery({ queryKey: ['spec-sheets'], queryFn: () => measurementsApi.getSpecSheets() });
}

export function useDeleteSpecSheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: measurementsApi.deleteSpecSheet,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['spec-sheets'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useAnalyzeImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, mannequinId, title }: { file: File; mannequinId?: string; title?: string }) =>
      measurementsApi.analyzeImage(file, mannequinId, title),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['spec-sheets'] }); toast.success('Spec sheet generated!'); },
    onError: (e: any) => toast.error(e.message),
  });
}
