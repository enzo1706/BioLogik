/**
 * API Query Hooks — TanStack Query hooks for BioLogik API.
 *
 * Provides typed query/mutation hooks that use the authenticated API client.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient, ApiError } from './client';
import type { Role } from '@biologik/types';

// ── Query Keys ─────────────────────────────────────────────

export const API_KEYS = {
  USER_PROFILE: ['user', 'profile'] as const,
  MEALS: ['meals'] as const,
  MEAL_DETAIL: (id: string) => ['meals', id] as const,
  ORDERS: ['orders'] as const,
  ORDER_DETAIL: (id: string) => ['orders', id] as const,
  PROGRESS: ['progress'] as const,
  SUBSCRIPTION: ['subscription'] as const,
} as const;

// ── User Hooks ─────────────────────────────────────────────

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export function useUserProfile() {
  const api = getApiClient();

  return useQuery({
    queryKey: API_KEYS.USER_PROFILE,
    queryFn: () => api.get<UserProfile>('/auth/me'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ── Meal Hooks ─────────────────────────────────────────────

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url?: string;
  created_at: string;
}

export function useMeals() {
  const api = getApiClient();

  return useQuery({
    queryKey: API_KEYS.MEALS,
    queryFn: () => api.get<Meal[]>('/meals'),
  });
}

export function useMeal(id: string) {
  const api = getApiClient();

  return useQuery({
    queryKey: API_KEYS.MEAL_DETAIL(id),
    queryFn: () => api.get<Meal>(`/meals/${id}`),
    enabled: !!id,
  });
}

// ── Order Hooks ────────────────────────────────────────────

export interface Order {
  id: string;
  status: string;
  total: number;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
}

export function useOrders() {
  const api = getApiClient();

  return useQuery({
    queryKey: API_KEYS.ORDERS,
    queryFn: () => api.get<Order[]>('/orders'),
  });
}

export function useCreateOrder() {
  const api = getApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { items: { meal_id: string; quantity: number }[] }) =>
      api.post<Order>('/orders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS.ORDERS });
    },
  });
}

// ── Progress Hooks ─────────────────────────────────────────

export interface ProgressEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

export function useProgress() {
  const api = getApiClient();

  return useQuery({
    queryKey: API_KEYS.PROGRESS,
    queryFn: () => api.get<ProgressEntry[]>('/progress'),
  });
}

export function useAddProgress() {
  const api = getApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { weight: number; notes?: string }) =>
      api.post<ProgressEntry>('/progress', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS.PROGRESS });
    },
  });
}
