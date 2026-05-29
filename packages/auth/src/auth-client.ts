/**
 * Auth client — HTTP client for auth endpoints.
 *
 * This is a lightweight fetch wrapper that handles token injection and refresh.
 * It does NOT depend on axios or any external HTTP library.
 */

import { tokenStorage } from './token-storage';
import type {
  AuthError,
  LoginCredentials,
  RegisterCredentials,
  TokenPair,
  AuthUser,
} from './types';

const DEFAULT_API_URL = 'http://localhost:8000/api/v1';

interface AuthClientConfig {
  /** Backend API base URL. */
  apiUrl?: string;
  /** Custom fetch implementation (for testing or SSR). */
  fetchFn?: typeof fetch;
}

export class AuthClient {
  private apiUrl: string;
  private fetchFn: typeof fetch;

  /** Callback fired when a token refresh succeeds or fails. */
  onTokenRefresh?: (tokens: TokenPair | null) => void;

  /** Flag to prevent concurrent refresh attempts. */
  private isRefreshing = false;
  private refreshPromise: Promise<TokenPair | null> | null = null;

  constructor(config: AuthClientConfig = {}) {
    this.apiUrl = config.apiUrl ?? DEFAULT_API_URL;
    this.fetchFn = config.fetchFn ?? globalThis.fetch;
  }

  // ── Public API ──────────────────────────────────────────

  /** Register a new user. */
  async register(data: RegisterCredentials): Promise<TokenPair> {
    const response = await this.request<TokenPair>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    tokenStorage.setTokens(response);
    return response;
  }

  /** Login with email and password. */
  async login(credentials: LoginCredentials): Promise<TokenPair> {
    const response = await this.request<TokenPair>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    tokenStorage.setTokens(response);
    return response;
  }

  /** Refresh the access token using the stored refresh token. */
  async refreshTokens(): Promise<TokenPair | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    // Prevent concurrent refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.doRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /** Logout — clear tokens. */
  logout(): void {
    tokenStorage.clearTokens();
    this.onTokenRefresh?.(null);
  }

  /** Get the current user's profile from /auth/me. */
  async getMe(): Promise<AuthUser> {
    return this.request<AuthUser>('/auth/me', {
      method: 'GET',
    });
  }

  /** Get a valid access token, refreshing if necessary. */
  async getValidAccessToken(): Promise<string | null> {
    let token = tokenStorage.getAccessToken();
    if (!token) return null;

    // Check if token is expired or about to expire
    const { isTokenExpired } = await import('./token-storage');
    if (isTokenExpired(token)) {
      const newTokens = await this.refreshTokens();
      if (!newTokens) return null;
      token = newTokens.access_token;
    }

    return token;
  }

  // ── Internal ──────────────────────────────────────────

  private async doRefresh(refreshToken: string): Promise<TokenPair | null> {
    try {
      const response = await this.request<TokenPair>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      tokenStorage.setTokens(response);
      this.onTokenRefresh?.(response);
      return response;
    } catch {
      tokenStorage.clearTokens();
      this.onTokenRefresh?.(null);
      return null;
    }
  }

  /**
   * Generic request method that:
   * 1. Injects the Authorization header
   * 2. Handles 401 by attempting a token refresh
   * 3. Retries the original request once
   */
  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.apiUrl}${path}`;
    const token = tokenStorage.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await this.fetchFn(url, {
      ...options,
      headers,
    });

    // If 401 and we have a refresh token, try refreshing
    if (response.status === 401 && path !== '/auth/refresh' && path !== '/auth/login') {
      const newTokens = await this.refreshTokens();
      if (newTokens) {
        // Retry with the new access token
        headers['Authorization'] = `Bearer ${newTokens.access_token}`;
        response = await this.fetchFn(url, {
          ...options,
          headers,
        });
      }
    }

    if (!response.ok) {
      const error: AuthError = await response.json().catch(() => ({
        detail: `Request failed with status ${response.status}`,
      }));
      throw new AuthClientError(error.detail, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }
}

/** Custom error class for auth errors. */
export class AuthClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'AuthClientError';
  }
}
