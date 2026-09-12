import { useQuery } from '@tanstack/react-query';
import { historyApi } from '../api/history';

export function useOrderHistoryQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: ['orders', orderId, 'history'],
    queryFn: () => historyApi.getByOrder(orderId as string),
    enabled: Boolean(orderId),
  });
}
