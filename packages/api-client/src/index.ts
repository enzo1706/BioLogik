/**
 * @biologik/api-client — Typed API client for BioLogik backend.
 *
 * Provides authenticated HTTP client and TanStack Query hooks.
 */

// ── Client ─────────────────────────────────────────────────
export { ApiClient, ApiError, getApiClient } from './client';
export { AuthClient, AuthClientError } from '@biologik/auth';

// ── Hooks ──────────────────────────────────────────────────
export {
  API_KEYS,
  useUserProfile,
  useMeals,
  useMeal,
  useOrders,
  useCreateOrder,
  useProgress,
  useAddProgress,
} from './hooks';
export type { Meal, Order, OrderItem, ProgressEntry } from './hooks';
