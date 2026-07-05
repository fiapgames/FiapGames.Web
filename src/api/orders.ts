import { httpClient } from './httpClient';
import type { OrderDto } from './types';

export const ordersApi = {
  getAll: () => httpClient.get<OrderDto[]>('/orders'),
  getById: (id: string) => httpClient.get<OrderDto>(`/orders/${id}`),
};
