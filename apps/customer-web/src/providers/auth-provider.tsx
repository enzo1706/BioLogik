import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  useAuth as useAuthHook,
  useRole as useRoleHook,
  usePermission as usePermissionHook,
  getAuthClient,
  type Role,
  type LoginCredentials,
  type RegisterCredentials,
  type Permission,
} from '@biologik/auth';
import { getApiClient } from '@biologik/api-client';

// ── Context Types ──────────────────────────────────────────

interface User {
  id: string;
  name?: string;
  email?: string;
  role: Role;
}

interface AuthContextState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;

  // Role checks
  hasRole: (...roles: Role[]) => boolean;
  isAdmin: boolean;
  isStaff: boolean;

  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (...permissions: Permission[]) => boolean;
}

// ── Context ────────────────────────────────────────────────

const AuthContext = createContext<AuthContextState | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
  /** Backend API URL. Defaults to http://localhost:8000/api/v1 */
  apiUrl?: string;
}

export function AuthProvider({ children, apiUrl }: AuthProviderProps) {
  // Initialize AuthClient and ApiClient with the provided URL
  useEffect(() => {
    if (apiUrl) {
      getAuthClient({ apiUrl });
      getApiClient({ apiUrl });
    }
  }, [apiUrl]);

  // Use the auth hooks from @biologik/auth
  const auth = useAuthHook();
  const role = useRoleHook();
  const permission = usePermissionHook();

  // Enrich user with profile data if available
  const [enrichedUser, setEnrichedUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth.user && auth.isAuthenticated) {
      // Try to fetch full profile, but don't block on it
      const api = getApiClient();
      api
        .get<{
          id: string;
          name: string;
          email: string;
          role: Role;
        }>('/auth/me')
        .then((profile) => {
          setEnrichedUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
          });
        })
        .catch(() => {
          // If /me fails, use the basic user from JWT
          setEnrichedUser(auth.user);
        });
    } else {
      setEnrichedUser(null);
    }
  }, [auth.user, auth.isAuthenticated]);

  const value: AuthContextState = {
    user: enrichedUser ?? auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    hasRole: role.hasRole,
    isAdmin: role.isAdmin,
    isStaff: role.isStaff,
    hasPermission: permission.hasPermission,
    hasAllPermissions: permission.hasAllPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ── Re-export types ────────────────────────────────────────
export type { LoginCredentials, RegisterCredentials, Role, Permission };
