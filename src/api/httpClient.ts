import { authStore } from '../auth/authStore';
import type { ProblemDetails, ValidationProblemDetails } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly problem?: ProblemDetails | ValidationProblemDetails;

  constructor(status: number, message: string, problem?: ProblemDetails | ValidationProblemDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.problem = problem;
  }

  get validationErrors(): Record<string, string[]> | undefined {
    return (this.problem as ValidationProblemDetails | undefined)?.errors;
  }
}

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return JSON.parse(text) as T;

  return text as unknown as T;
}

function createHttpClient(baseUrl: string) {
  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    // Every request goes through here, so this is the one place the token needs to
    // be attached. It matters now that the Kong gateway validates JWT in front of
    // both APIs: the Catalog endpoints (/games, /orders, /library) used to be open
    // and are enforced at the gateway, so they need the header too.
    // Public routes (register, login, refresh, /health) simply have no token yet.
    const token = authStore.getToken();

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Spread last so a caller can still override the header explicitly.
        ...options.headers,
      },
    });

    // The access token lives for 15 minutes and there is no refresh flow wired up
    // here, so an expired token surfaces as a 401 from the gateway. Dropping the
    // session sends the UI back to the login screen instead of looping on errors.
    if (response.status === 401) authStore.clearSession();

    if (!response.ok) {
      let problem: ProblemDetails | undefined;
      let message = response.statusText;
      const text = await response.text();
      if (text) {
        try {
          problem = JSON.parse(text);
          message = problem?.title ?? problem?.message ?? message;
        } catch {
          // Body wasn't JSON (e.g. the Catalog API's plain-text 409 "User already owns this game.").
          message = text;
        }
      }
      throw new ApiError(response.status, message, problem);
    }

    return parseBody<T>(response);
  }

  return {
    get: <T>(path: string, options?: RequestInit) => request<T>(path, options),
    post: <T>(path: string, body?: unknown, options?: RequestInit) =>
      request<T>(path, { ...options, method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown, options?: RequestInit) =>
      request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'DELETE' }),
  };
}

// Both point at the Kong gateway (http://localhost:8000) now — it is the single entry
// point, so the two base URLs collapse onto one origin. They stay as separate clients
// because the paths differ (/api/users vs /games, /orders, /library) and so either can
// be pointed elsewhere without touching the other.
//
// CORS is still answered by the APIs themselves (see Program.cs in FiapGames.Catalog
// and Fiap.Games.Users) — the gateway deliberately does not add a cors plugin, which
// would duplicate Access-Control-Allow-Origin and make browsers reject the response.
export const httpClient = createHttpClient(import.meta.env.VITE_API_BASE_URL ?? '');
export const usersHttpClient = createHttpClient(import.meta.env.VITE_USERS_API_BASE_URL ?? '');
