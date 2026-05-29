/**
 * RBAC utilities — role and permission checking.
 *
 * Centralizes all role-based access control logic so it can be shared
 * across all BioLogik frontend apps.
 */

import type { Role } from './types';

// ── Permission definitions (mirrors backend) ───────────────

/** Permission constants — use these instead of string literals. */
export const PERMISSIONS = {
  // Customer
  CREATE_ORDER: 'create_order',
  VIEW_PROGRESS: 'view_progress',
  MANAGE_PROFILE: 'manage_profile',

  // Nutritionist
  MANAGE_PATIENTS: 'manage_patients',
  CREATE_NUTRITION_PLAN: 'create_nutrition_plan',

  // Kitchen
  MANAGE_STOCK: 'manage_stock',
  UPDATE_ORDERS: 'update_orders',

  // Admin
  FULL_ACCESS: 'full_access',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ── Role → Permission mapping ──────────────────────────────

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  customer: [
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.VIEW_PROGRESS,
    PERMISSIONS.MANAGE_PROFILE,
  ],
  nutritionist: [
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.CREATE_NUTRITION_PLAN,
  ],
  kitchen: [
    PERMISSIONS.MANAGE_STOCK,
    PERMISSIONS.UPDATE_ORDERS,
  ],
  admin: [
    PERMISSIONS.FULL_ACCESS,
  ],
} as const;

// ── Role checking ──────────────────────────────────────────

/** Check if a role is one of the allowed roles. */
export function hasRole(userRole: Role, ...allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

/** Check if a role is an admin role. */
export function isAdmin(role: Role): boolean {
  return role === 'admin';
}

/** Check if a role is a staff role (nutritionist, kitchen, admin). */
export function isStaff(role: Role): boolean {
  return ['nutritionist', 'kitchen', 'admin'].includes(role);
}

/** Get a human-readable label for a role. */
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    customer: 'Cliente',
    nutritionist: 'Nutricionista',
    kitchen: 'Cocina',
    admin: 'Administrador',
  };
  return labels[role] ?? role;
}

// ── Permission checking ────────────────────────────────────

/** Get all permissions for a role. */
export function getPermissionsForRole(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/** Check if a role has a specific permission. */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = getPermissionsForRole(role);

  // Admin has all permissions via FULL_ACCESS
  if (permissions.includes(PERMISSIONS.FULL_ACCESS)) {
    return true;
  }

  return permissions.includes(permission);
}

/** Check if a role has ALL of the specified permissions. */
export function hasAllPermissions(role: Role, ...permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/** Check if a role has ANY of the specified permissions. */
export function hasAnyPermission(role: Role, ...permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

// ── Route protection helpers ───────────────────────────────

/** Define which roles can access a route. */
export interface RouteAccess {
  /** Only these roles can access. Empty = any authenticated user. */
  allowedRoles?: Role[];
  /** Required permissions (user must have ALL). */
  requiredPermissions?: Permission[];
}

/** Check if a role can access a route based on its access config. */
export function canAccessRoute(
  role: Role,
  access: RouteAccess,
): boolean {
  // Check roles
  if (access.allowedRoles && access.allowedRoles.length > 0) {
    if (!hasRole(role, ...access.allowedRoles)) {
      return false;
    }
  }

  // Check permissions
  if (access.requiredPermissions && access.requiredPermissions.length > 0) {
    if (!hasAllPermissions(role, ...access.requiredPermissions)) {
      return false;
    }
  }

  return true;
}

// ── Route access definitions (predefined) ──────────────────

/** Predefined route access configurations. */
export const ROUTE_ACCESS = {
  /** Any authenticated user. */
  AUTHENTICATED: {} as RouteAccess,

  /** Only customers. */
  CUSTOMER_ONLY: { allowedRoles: ['customer'] } as RouteAccess,

  /** Only staff (nutritionist, kitchen, admin). */
  STAFF_ONLY: { allowedRoles: ['nutritionist', 'kitchen', 'admin'] } as RouteAccess,

  /** Only admins. */
  ADMIN_ONLY: { allowedRoles: ['admin'] } as RouteAccess,

  /** Staff or admin. */
  STAFF_OR_ADMIN: { allowedRoles: ['nutritionist', 'kitchen', 'admin'] } as RouteAccess,
} as const;
