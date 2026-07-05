import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gamesApi } from '../api/games';
import type { CreateGameDto, PurchaseRequestDto, UpdateGameDto } from '../api/types';

export const gamesKeys = {
  all: ['games'] as const,
  detail: (id: string) => ['games', id] as const,
};

export function useGamesQuery() {
  return useQuery({ queryKey: gamesKeys.all, queryFn: gamesApi.getAll });
}

export function useGameQuery(id: string | undefined) {
  return useQuery({
    queryKey: gamesKeys.detail(id ?? ''),
    queryFn: () => gamesApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateGameDto) => gamesApi.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gamesKeys.all }),
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateGameDto }) => gamesApi.update(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: gamesKeys.all });
      queryClient.invalidateQueries({ queryKey: gamesKeys.detail(variables.id) });
    },
  });
}

export function useDeactivateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gamesApi.deactivate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gamesKeys.all }),
  });
}

export function usePurchaseGame() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: PurchaseRequestDto }) => gamesApi.purchase(id, dto),
  });
}
