/**
 * Dashboard types — data models for the Customer Dashboard.
 *
 * These types represent the API response shape.
 * When the backend is ready, replace mock-data.ts with TanStack Query hooks
 * that return the same interfaces.
 */

/** A meal planned for today. */
export interface DashboardMeal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
}

/** Active or most recent order. */
export interface DashboardOrder {
  id: string;
  status: 'pending' | 'preparing' | 'completed' | 'delivered';
  itemsCount: number;
  total: number;
}

/** Upcoming nutritionist appointment. */
export interface DashboardAppointment {
  id: string;
  date: string;
  time: string;
  nutritionistName: string;
  location?: string;
}

/** Aggregated stats for the dashboard header. */
export interface DashboardStats {
  plannedMealsToday: number;
  activeOrder: DashboardOrder | null;
  currentWeight: number | null;
  lastWeightDate: string | null;
  nextAppointment: DashboardAppointment | null;
}

/** Top-level dashboard data returned by the API. */
export interface DashboardData {
  stats: DashboardStats;
  upcomingMeals: DashboardMeal[];
}
