/**
 * API Client — HTTP client with automatic auth headers and token refresh.
 *
 * Provides a typed fetch wrapper that:
 * - Injects Authorization headers
 * - Handles 401 with automatic token refresh
 * - Retries failed requests once
 * - Works with TanStack Query
 */

import { tokenStorage } from '@biologik/auth';

const DEFAULT_API_URL = 'http://localhost:8000/api/v1';

interface ApiClientConfig {
  /** Backend API base URL. */
  apiUrl?: string;
  /** Custom fetch implementation. */
  fetchFn?: typeof fetch;
}

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  /** Query parameters. */
  params?: Record<string, string | number | boolean | undefined>;
}

// ── API Client ─────────────────────────────────────────────

export class ApiClient {
  private apiUrl: string;
  private fetchFn: typeof fetch;

  /** Flag to prevent concurrent refresh attempts. */
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  /** Callback when refresh succeeds/fails. */
  onRefreshComplete?: (success: boolean) => void;

  constructor(config: ApiClientConfig = {}) {
    this.apiUrl = config.apiUrl ?? DEFAULT_API_URL;
    this.fetchFn = config.fetchFn ?? globalThis.fetch;
  }

  // ── HTTP Methods ───────────────────────────────────────

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, data, options);
  }

  async put<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, data, options);
  }

  async patch<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, data, options);
  }

  async delete<T = void>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  // ── Core Request Logic ─────────────────────────────────

  private async request<T>(
    method: string,
    path: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const token = tokenStorage.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await this.fetchFn(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
      headers, // Ensure headers override any from options
    });

    // Handle 401 with token refresh
    if (response.status === 401 && path !== '/auth/refresh') {
      const refreshed = await this.handleRefresh();
      if (refreshed) {
        const newToken = tokenStorage.getAccessToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await this.fetchFn(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
          });
        }
      }
    }

    // Handle response
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: `Request failed: ${response.status}`,
      }));
      throw new ApiError(error.detail ?? 'Unknown error', response.status, error);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // ── Token Refresh ──────────────────────────────────────

  private async handleRefresh(): Promise<boolean> {
    // Prevent concurrent refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.doRefresh();

    try {
      const result = await this.refreshPromise;
      this.onRefreshComplete?.(result);
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await this.fetchFn(`${this.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        tokenStorage.clearTokens();
        return false;
      }

      const tokens = await response.json();
      tokenStorage.setTokens(tokens);
      return true;
    } catch {
      tokenStorage.clearTokens();
      return false;
    }
  }

  // ── Helpers ────────────────────────────────────────────

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.apiUrl}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }
}

// ── Error Class ────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Singleton ──────────────────────────────────────────────

let apiClientInstance: ApiClient | null = null;

export function getApiClient(config?: ApiClientConfig): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(config);
  }
  return apiClientInstance;
}

// ── Re-export auth client for convenience ──────────────────
export { AuthClient, AuthClientError } from '@biologik/auth';
