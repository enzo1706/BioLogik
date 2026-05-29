/**
 * Route guards — React components for protecting routes.
 *
 * These components wrap routes and handle auth/role checks.
 * They redirect to appropriate pages when access is denied.
 */

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStorage, extractUserFromToken } from './token-storage';
import type { Role } from './types';
import { canAccessRoute, type RouteAccess } from './rbac';

// ── Constants ──────────────────────────────────────────────

const LOGIN_ROUTE = '/login';
const UNAUTHORIZED_ROUTE = '/unauthorized';

// ── Props ──────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: ReactNode;
  /** Custom redirect path when not authenticated. Defaults to /login */
  redirectTo?: string;
}

interface RoleGuardProps {
  children: ReactNode;
  /** Allowed roles. */
  allowedRoles: Role[];
  /** Redirect path when role is not allowed. */
  redirectTo?: string;
}

interface AuthGuardProps {
  children: ReactNode;
  /** Route access configuration. */
  access: RouteAccess;
  /** Redirect path when not authenticated. */
  authRedirectTo?: string;
  /** Redirect path when access is denied. */
  deniedRedirectTo?: string;
}

// ── Utility ────────────────────────────────────────────────

/**
 * Extract the current user's role from the stored access token.
 * Returns null if not authenticated or token is invalid.
 */
export function getCurrentUserRole(): Role | null {
  const token = tokenStorage.getAccessToken();
  if (!token) return null;

  const user = extractUserFromToken(token);
  if (!user) return null;

  return user.role as Role;
}

/**
 * Check if the user is currently authenticated.
 */
export function isAuthenticated(): boolean {
  return tokenStorage.hasTokens();
}

// ── Components ─────────────────────────────────────────────

/**
 * ProtectedRoute — base guard that requires authentication.
 *
 * Usage:
 * ```tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * ```
 */
export function ProtectedRoute({
  children,
  redirectTo = LOGIN_ROUTE,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * RoleGuard — requires the user to have one of the allowed roles.
 * Must be used inside a ProtectedRoute.
 *
 * Usage:
 * ```tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route
 *     element={<RoleGuard allowedRoles={['admin', 'kitchen']} />}
 *   >
 *     <Route path="/kitchen" element={<KitchenDashboard />} />
 *   </Route>
 * </Route>
 * ```
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = UNAUTHORIZED_ROUTE,
}: RoleGuardProps) {
  const role = getCurrentUserRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

/**
 * AuthGuard — combines authentication and route access checking.
 *
 * Usage:
 * ```tsx
 * <Route
 *   element={
 *     <AuthGuard access={{ allowedRoles: ['admin'] }}>
 *       <AdminPanel />
 *     </AuthGuard>
 *   }
 * />
 * ```
 */
export function AuthGuard({
  children,
  access,
  authRedirectTo = LOGIN_ROUTE,
  deniedRedirectTo = UNAUTHORIZED_ROUTE,
}: AuthGuardProps) {
  const location = useLocation();

  // First check: is user authenticated?
  if (!isAuthenticated()) {
    return <Navigate to={authRedirectTo} state={{ from: location }} replace />;
  }

  // Second check: does user have the required role/permissions?
  const role = getCurrentUserRole();
  if (!role || !canAccessRoute(role, access)) {
    return <Navigate to={deniedRedirectTo} replace />;
  }

  return <>{children}</>;
}
