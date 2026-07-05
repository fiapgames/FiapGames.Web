import type { UserDto } from '../api/types';

const STORAGE_KEY = 'fiapgames.auth';

export interface AuthSession {
  accessToken: string;
  user: UserDto;
}

type Listener = () => void;

const listeners = new Set<Listener>();

function readSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

let session: AuthSession | null = readSession();

export const authStore = {
  getSession: () => session,
  getToken: () => session?.accessToken,
  setSession(newSession: AuthSession) {
    session = newSession;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    listeners.forEach((listener) => listener());
  },
  clearSession() {
    session = null;
    localStorage.removeItem(STORAGE_KEY);
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
