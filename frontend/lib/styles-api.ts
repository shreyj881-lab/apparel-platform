import api from './api';
import { Style, StyleFilters, PaginatedResponse, FilterOptions } from '@/types';

export const stylesApi = {
  getAll: (filters: StyleFilters = {}) =>
    api.get<any, PaginatedResponse<Style>>('/styles', { params: filters }),

  getOne: (id: string) => api.get<any, Style>(`/styles/${id}`),

  create: (data: Partial<Style>) => api.post<any, Style>('/styles', data),

  update: (id: string, data: Partial<Style>) => api.put<any, Style>(`/styles/${id}`, data),

  remove: (id: string) => api.delete(`/styles/${id}`),

  getFilterOptions: () => api.get<any, FilterOptions>('/styles/filter-options'),

  addImages: (id: string, files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    return api.post<any, Style>(`/styles/${id}/images`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  removeImage: (id: string, imageId: string) =>
    api.delete(`/styles/${id}/images/${imageId}`),

  bulkExport: () =>
    api.get('/styles/export', { responseType: 'blob' }),
};
