import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
    // Pending orders can flip to Approved/Rejected via the async payment flow (RabbitMQ).
    refetchInterval: (query) => (query.state.data?.some((order) => order.status === 'Pending') ? 2000 : false),
  });
}

export function useOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id as string),
    enabled: Boolean(id),
    // The order starts as Pending until the async payment flow (RabbitMQ) resolves it.
    refetchInterval: (query) => (query.state.data?.status === 'Pending' ? 2000 : false),
  });
}
