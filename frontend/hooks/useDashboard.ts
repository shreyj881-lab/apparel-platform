import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats } from '@/types';

export function useDashboard() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [stats, brickNameDistribution, uploadTrends, mostUsedFabrics] = await Promise.all([
        api.get<any, any>('/dashboard/stats'),
        api.get<any, any>('/dashboard/brick-distribution'),
        api.get<any, any>('/dashboard/upload-trends'),
        api.get<any, any>('/dashboard/most-used-fabrics'),
      ]);
      return { ...stats, brickNameDistribution, uploadTrends, mostUsedFabrics };
    },
    staleTime: 60 * 1000,
  });
}