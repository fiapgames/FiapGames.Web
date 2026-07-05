import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';

export function useOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id as string),
    enabled: Boolean(id),
    // The order starts as Pending until the async payment flow (RabbitMQ) resolves it.
    refetchInterval: (query) => (query.state.data?.status === 'Pending' ? 2000 : false),
  });
}
