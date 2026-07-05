import { httpClient } from './httpClient';
import type { CreateGameDto, GameDto, OrderDto, PurchaseRequestDto, UpdateGameDto } from './types';

export const gamesApi = {
  getAll: () => httpClient.get<GameDto[]>('/games'),
  getById: (id: string) => httpClient.get<GameDto>(`/games/${id}`),
  create: (dto: CreateGameDto) => httpClient.post<GameDto>('/games', dto),
  update: (id: string, dto: UpdateGameDto) => httpClient.put<GameDto>(`/games/${id}`, dto),
  deactivate: (id: string) => httpClient.delete<void>(`/games/${id}`),
  purchase: (id: string, dto: PurchaseRequestDto) => httpClient.post<OrderDto>(`/games/${id}/purchase`, dto),
};
