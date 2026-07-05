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
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

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

// Empty string in dev relies on the Vite proxy (see vite.config.ts) to avoid CORS,
// since neither backend has CORS middleware configured.
export const httpClient = createHttpClient(import.meta.env.VITE_API_BASE_URL ?? '');
export const usersHttpClient = createHttpClient(import.meta.env.VITE_USERS_API_BASE_URL ?? '');
