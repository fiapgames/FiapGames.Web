import { useSyncExternalStore } from 'react';
import { authStore } from '../auth/authStore';

export function useAuth() {
  const session = useSyncExternalStore(authStore.subscribe, authStore.getSession);
  return { session, isAuthenticated: Boolean(session) };
}
