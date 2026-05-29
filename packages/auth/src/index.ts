/**
 * @biologik/auth — Shared authentication and authorization package.
 *
 * Provides token storage, JWT utilities, RBAC, route guards, and React hooks
 * for all BioLogik frontend applications.
 */

// ── Types ──────────────────────────────────────────────────
export type {
  TokenPayload,
  TokenPair,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
  Role,
} from './types';

// ── Token Storage ──────────────────────────────────────────
export { tokenStorage, decodeJwtPayload, isTokenExpired, extractUserFromToken } from './token-storage';

// ── Auth Client ────────────────────────────────────────────
export { AuthClient, AuthClientError } from './auth-client';

// ── RBAC Utilities ─────────────────────────────────────────
export {
  PERMISSIONS,
  hasRole,
  isAdmin,
  isStaff,
  getRoleLabel,
  getPermissionsForRole,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  canAccessRoute,
  ROUTE_ACCESS,
} from './rbac';
export type { Permission, RouteAccess } from './rbac';

// ── Route Guards ───────────────────────────────────────────
export { ProtectedRoute, RoleGuard, AuthGuard, getCurrentUserRole, isAuthenticated } from './route-guards';

// ── React Hooks ────────────────────────────────────────────
export { useAuth, useAuthState, useRole, usePermission, useAuthActions, getAuthClient } from './hooks';
