import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../api/library';

export function useLibraryQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['library', userId],
    queryFn: () => libraryApi.getByUserId(userId as string),
    enabled: Boolean(userId),
    retry: false,
  });
}
