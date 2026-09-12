import { httpClient } from './httpClient';
import type { PurchaseEventDto } from './types';

export const historyApi = {
  getByOrder: (orderId: string) => httpClient.get<PurchaseEventDto[]>(`/orders/${orderId}/history`),
};
