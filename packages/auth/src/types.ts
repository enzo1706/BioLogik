/**
 * Auth types shared across BioLogik apps.
 */

/** JWT token payload structure (matches backend). */
export interface TokenPayload {
  sub: string;
  role: Role;
  exp: number;
  type: 'access' | 'refresh';
}

/** Auth token pair returned by the backend. */
export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/** Authenticated user info (extracted from JWT). */
export interface AuthUser {
  id: string;
  role: Role;
  /** Populated after fetching /auth/me */
  name?: string;
  email?: string;
}

/** Login request body. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Register request body. */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

/** Auth error shape from the backend. */
export interface AuthError {
  detail: string;
}

// Re-export Role from @biologik/types for convenience
export type { Role } from '@biologik/types';
