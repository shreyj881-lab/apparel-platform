import api from './api';
import { Fabric, FabricFilters, PaginatedResponse } from '@/types';

export const fabricsApi = {
  getAll: async (filters: FabricFilters = {}) => {
    api.get<any, PaginatedResponse<Fabric>>('/fabrics', { params: filters }),

  getOne: (id: string) => api.get<any, Fabric>(`/fabrics/${id}`),

  create: (data: Partial<Fabric>) => api.post<any, Fabric>('/fabrics', data),

  update: (id: string, data: Partial<Fabric>) => api.put<any, Fabric>(`/fabrics/${id}`, data),

  remove: (id: string) => api.delete(`/fabrics/${id}`),

  addImages: (id: string, files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    return api.post(`/fabrics/${id}/images`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  removeImage: (id: string, imageId: string) =>
    api.delete(`/fabrics/${id}/images/${imageId}`),

  addColorway: (id: string, data: { colorName: string; colorCode?: string }) =>
    api.post(`/fabrics/${id}/colorways`, data),

  bulkExport: () =>
    api.get('/fabrics/export', { responseType: 'blob' }),
};
