// Navigation route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  MEALS: '/meals',
  MEAL_DETAIL: (id: string) => `/meals/${id}`,
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROGRESS: '/progress',
  PROFILE: '/profile',
  SUBSCRIPTION: '/subscription',
  NUTRITIONIST: '/nutritionist',
} as const;

// TanStack Query keys
export const QUERY_KEYS = {
  MEALS: ['meals'] as const,
  ORDERS: ['orders'] as const,
  PROGRESS: ['progress'] as const,
  PROFILE: ['profile'] as const,
  SUBSCRIPTION: ['subscription'] as const,
  NUTRITIONIST: ['nutritionist'] as const,
} as const;

// App metadata
export const APP_NAME = 'BioLogik';
export const APP_DESCRIPTION = 'Energía real para rendir al máximo';
