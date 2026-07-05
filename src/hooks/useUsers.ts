import { useMutation, useQuery } from '@tanstack/react-query';
import { authStore } from '../auth/authStore';
import { type ListUsersParams, usersApi } from '../api/users';
import type { CreateUserDto, LoginRequestDto } from '../api/types';
import { useAuth } from './useAuth';

export function useCreateUser() {
  return useMutation({
    mutationFn: (dto: CreateUserDto) => usersApi.create(dto),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginRequestDto) => usersApi.login(dto),
    onSuccess: (data) => authStore.setSession({ accessToken: data.accessToken, user: data.user }),
  });
}

export function useUsersListQuery(params: ListUsersParams) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params),
    enabled: isAuthenticated,
  });
}
