import { httpClient } from './httpClient';
import type { OrderDto } from './types';

export const ordersApi = {
  getById: (id: string) => httpClient.get<OrderDto>(`/orders/${id}`),
};
