import api from './api';

export interface Mannequin {
  id: string;
  gender: 'male' | 'female';
  name: string;
  measurements: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}

export interface SpecSheet {
  id: string;
  title: string;
  imageUrl: string;
  garmentType: string;
  gender: string;
  fabricType: string;
  fitType: string;
  estimatedGsm: string;
  ease: Record<string, any>;
  productionMeasurements: Record<string, any>;
  constructionNotes: string;
  patternNotes: string;
  riskAreas: string;
  confidenceScore: number;
  mannequinId: string;
  createdAt: string;
}

export const measurementsApi = {
  // Mannequins
  getMannequins: () => api.get<any, Mannequin[]>('/measurements/mannequins'),
  createMannequin: (data: Partial<Mannequin>) => api.post<any, Mannequin>('/measurements/mannequins', data),
  updateMannequin: (id: string, data: Partial<Mannequin>) => api.put<any, Mannequin>(`/measurements/mannequins/${id}`, data),
  deleteMannequin: (id: string) => api.delete(`/measurements/mannequins/${id}`),

  // Spec Sheets
  getSpecSheets: () => api.get<any, SpecSheet[]>('/measurements/spec-sheets'),
  getSpecSheet: (id: string) => api.get<any, SpecSheet>(`/measurements/spec-sheets/${id}`),
  deleteSpecSheet: (id: string) => api.delete(`/measurements/spec-sheets/${id}`),

  // Analyze
  analyzeImage: (file: File, mannequinId?: string, title?: string) => {
    const form = new FormData();
    form.append('image', file);
    if (mannequinId) form.append('mannequinId', mannequinId);
    if (title) form.append('title', title);
    return api.post<any, SpecSheet>('/measurements/analyze', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
  },
};
