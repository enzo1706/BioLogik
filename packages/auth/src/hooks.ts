/**
 * Auth hooks — React hooks for authentication and authorization.
 *
 * These hooks provide a clean API for components to interact with auth state.
 * They work with the AuthClient and token storage.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { tokenStorage, extractUserFromToken, isTokenExpired } from './token-storage';
import { AuthClient, AuthClientError } from './auth-client';
import {
  hasRole,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getPermissionsForRole,
  isAdmin,
  isStaff,
} from './rbac';
import type { Role, AuthUser, LoginCredentials, RegisterCredentials, Permission } from './types';

// ── Singleton AuthClient ───────────────────────────────────

let authClientInstance: AuthClient | null = null;

/** Get or create the singleton AuthClient. */
export function getAuthClient(config?: { apiUrl?: string }): AuthClient {
  if (!authClientInstance) {
    authClientInstance = new AuthClient(config);
  }
  return authClientInstance;
}

// ── useAuthState ───────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook that provides the current auth state.
 * Reads from token storage on mount and keeps state in sync.
 */
export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      return;
    }

    if (isTokenExpired(token)) {
      // Token expired — try refresh
      const client = getAuthClient();
      client
        .refreshTokens()
        .then(() => {
          const newToken = tokenStorage.getAccessToken();
          if (newToken) {
            const userData = extractUserFromToken(newToken);
            setState({
              user: userData
                ? { id: userData.id, role: userData.role as Role }
                : null,
              isAuthenticated: !!userData,
              isLoading: false,
              error: null,
            });
          } else {
            setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
          }
        })
        .catch(() => {
          setState({ user: null, isAuthenticated: false, isLoading: false, error: 'Session expired' });
        });
    } else {
      const userData = extractUserFromToken(token);
      setState({
        user: userData ? { id: userData.id, role: userData.role as Role } : null,
        isAuthenticated: !!userData,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  return state;
}

// ── useAuth ────────────────────────────────────────────────

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Main auth hook — provides auth state and actions.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from stored token
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token && !isTokenExpired(token)) {
      const userData = extractUserFromToken(token);
      if (userData) {
        setUser({ id: userData.id, role: userData.role as Role });
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const client = getAuthClient();
      await client.login(credentials);

      const token = tokenStorage.getAccessToken();
      if (token) {
        const userData = extractUserFromToken(token);
        if (userData) {
          setUser({ id: userData.id, role: userData.role as Role });
        }
      }
    } catch (err) {
      const message =
        err instanceof AuthClientError ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const client = getAuthClient();
      await client.register(credentials);

      const token = tokenStorage.getAccessToken();
      if (token) {
        const userData = extractUserFromToken(token);
        if (userData) {
          setUser({ id: userData.id, role: userData.role as Role });
        }
      }
    } catch (err) {
      const message =
        err instanceof AuthClientError ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    const client = getAuthClient();
    client.logout();
    setUser(null);
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const client = getAuthClient();
      const fullUser = await client.getMe();
      setUser((prev) => (prev ? { ...prev, ...fullUser } : null));
    } catch {
      // If /me fails, keep the minimal user from JWT
    }
  }, []);

  const isAuthenticated = !!user;

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, isLoading, error, login, register, logout, refreshUser],
  );
}

// ── useRole ────────────────────────────────────────────────

interface UseRoleReturn {
  role: Role | null;
  isAdmin: boolean;
  isStaff: boolean;
  hasRole: (...roles: Role[]) => boolean;
}

/**
 * Hook for role-based checks.
 */
export function useRole(): UseRoleReturn {
  const { user } = useAuthState();

  const role = user?.role ?? null;

  return useMemo(
    () => ({
      role,
      isAdmin: role ? isAdmin(role) : false,
      isStaff: role ? isStaff(role) : false,
      hasRole: (...roles: Role[]) => (role ? hasRole(role, ...roles) : false),
    }),
    [role],
  );
}

// ── usePermission ──────────────────────────────────────────

interface UsePermissionReturn {
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (...permissions: Permission[]) => boolean;
  hasAnyPermission: (...permissions: Permission[]) => boolean;
  permissions: readonly Permission[];
}

/**
 * Hook for permission-based checks.
 */
export function usePermission(): UsePermissionReturn {
  const { user } = useAuthState();
  const role = user?.role ?? null;

  return useMemo(
    () => ({
      hasPermission: (permission: Permission) =>
        role ? hasPermission(role, permission) : false,
      hasAllPermissions: (...permissions: Permission[]) =>
        role ? hasAllPermissions(role, ...permissions) : false,
      hasAnyPermission: (...permissions: Permission[]) =>
        role ? hasAnyPermission(role, ...permissions) : false,
      permissions: role ? getPermissionsForRole(role) : [],
    }),
    [role],
  );
}

// ── useAuthActions (convenience) ───────────────────────────

/**
 * Convenience hook for auth actions without the full state.
 * Useful when you only need login/logout functions.
 */
export function useAuthActions() {
  const { login, register, logout } = useAuth();
  return { login, register, logout };
}
