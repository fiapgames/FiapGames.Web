import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../api/health';

export function useHealthQuery() {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthApi.check,
    refetchInterval: 15000,
    retry: false,
  });
}
