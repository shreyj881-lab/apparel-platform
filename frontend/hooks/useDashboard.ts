import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats } from '@/types';

export function useDashboard() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/stats'),
    staleTime: 60 * 1000,
  });
}
