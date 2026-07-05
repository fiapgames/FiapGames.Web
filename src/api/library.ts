import { httpClient } from './httpClient';
import type { LibraryResponseDto } from './types';

export const libraryApi = {
  getByUserId: (userId: string) => httpClient.get<LibraryResponseDto>(`/library/${userId}`),
};
