import { usersHttpClient } from './httpClient';
import type { CreateUserDto, LoginRequestDto, LoginResponseDto, PagedResult, UserDto } from './types';

export interface ListUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const usersApi = {
  create: (dto: CreateUserDto) => usersHttpClient.post<UserDto>('/api/users', dto),
  login: (dto: LoginRequestDto) => usersHttpClient.post<LoginResponseDto>('/api/users/login', dto),
  list: (params: ListUsersParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.search) query.set('search', params.search);
    const qs = query.toString();

    // The Authorization header is attached centrally in httpClient.ts — this used to
    // build it by hand here, which is why the Catalog clients never sent a token.
    return usersHttpClient.get<PagedResult<UserDto>>(`/api/users${qs ? `?${qs}` : ''}`);
  },
};
