import { authStore } from '../auth/authStore';
import { usersHttpClient } from './httpClient';
import type { CreateUserDto, LoginRequestDto, LoginResponseDto, PagedResult, UserDto } from './types';

export interface ListUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

function authHeader(): HeadersInit {
  const token = authStore.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
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

    return usersHttpClient.get<PagedResult<UserDto>>(`/api/users${qs ? `?${qs}` : ''}`, {
      headers: authHeader(),
    });
  },
};
