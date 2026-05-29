/**
 * Token storage utilities — localStorage wrapper for JWT tokens.
 *
 * Provides a clean API over localStorage with type safety.
 * All tokens are stored under namespaced keys.
 */

import type { TokenPair, TokenPayload } from './types';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'biologik_access_token',
  REFRESH_TOKEN: 'biologik_refresh_token',
} as const;

// ── Token storage ──────────────────────────────────────────

export const tokenStorage = {
  /** Store both tokens. */
  setTokens(tokens: TokenPair): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
  },

  /** Get the access token. */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /** Get the refresh token. */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /** Get both tokens. */
  getTokens(): TokenPair | null {
    const access_token = this.getAccessToken();
    const refresh_token = this.getRefreshToken();

    if (!access_token || !refresh_token) return null;

    return {
      access_token,
      refresh_token,
      token_type: 'bearer',
    };
  },

  /** Clear all tokens (logout). */
  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /** Check if tokens exist. */
  hasTokens(): boolean {
    return this.getAccessToken() !== null && this.getRefreshToken() !== null;
  },
} as const;

// ── JWT parsing (no verification — that's the backend's job) ──

/**
 * Decode a JWT payload without verification.
 * Used for client-side role checks and expiry detection.
 */
export function decodeJwtPayload(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired (with a 30s buffer to avoid edge cases).
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return true;

  // 30 second buffer before actual expiry
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + 30;
}

/**
 * Extract the user info from an access token.
 */
export function extractUserFromToken(token: string): { id: string; role: string } | null {
  const payload = decodeJwtPayload(token);
  if (!payload || payload.type !== 'access') return null;

  return {
    id: payload.sub,
    role: payload.role,
  };
}
