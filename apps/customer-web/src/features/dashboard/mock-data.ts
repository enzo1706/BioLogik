/**
 * Dashboard mock data — simulates backend API response.
 *
 * Replace this module with TanStack Query hooks when the backend endpoints
 * are implemented. Keep the same return types (DashboardData).
 *
 * @example
 *   // Before (mock):
 *   import { getDashboardData } from './mock-data';
 *   const data = getDashboardData();
 *
 *   // After (real API):
 *   import { useDashboardData } from '@/hooks/use-dashboard';
 *   const { data } = useDashboardData();
 */

import type { DashboardData, DashboardMeal } from './types';

/** Simulated network delay (ms). */
const MOCK_DELAY = 0; // Set to 0 for now; change to ~300 when testing loading states

/** Generate today's date parts for realistic meal times. */
function todayAt(hours: number, minutes = 0): string {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
}

const MOCK_MEALS: DashboardMeal[] = [
  {
    id: 'meal-001',
    name: 'Desayuno — Overnight Oats con Proteína',
    time: todayAt(8, 0),
    calories: 420,
    protein: 32,
    carbs: 48,
    fat: 12,
  },
  {
    id: 'meal-002',
    name: 'Colación Media Mañana — Frutos Secos + Banana',
    time: todayAt(10, 30),
    calories: 185,
    protein: 6,
    carbs: 22,
    fat: 9,
  },
  {
    id: 'meal-003',
    name: 'Almuerzo — Pollo al Grill con Quinoa y Verduras',
    time: todayAt(13, 0),
    calories: 580,
    protein: 45,
    carbs: 52,
    fat: 16,
  },
  {
    id: 'meal-004',
    name: 'Merienda — Smoothie de Frutos Rojos',
    time: todayAt(16, 30),
    calories: 220,
    protein: 18,
    carbs: 30,
    fat: 4,
  },
];

/**
 * Returns mock dashboard data.
 *
 * Toggle `showEmptyStates` to test empty/loading UI states during development.
 */
export function getDashboardData(
  options: { showEmptyStates?: boolean } = {},
): DashboardData {
  const { showEmptyStates = false } = options;

  if (showEmptyStates) {
    return {
      stats: {
        plannedMealsToday: 0,
        activeOrder: null,
        currentWeight: null,
        lastWeightDate: null,
        nextAppointment: null,
      },
      upcomingMeals: [],
    };
  }

  return {
    stats: {
      plannedMealsToday: MOCK_MEALS.length,
      activeOrder: {
        id: 'ORD-2026-0501',
        status: 'preparing',
        itemsCount: 3,
        total: 42.5,
      },
      currentWeight: 75.5,
      lastWeightDate: '2026-05-28',
      nextAppointment: {
        id: 'APT-001',
        date: '2026-06-04',
        time: '10:00',
        nutritionistName: 'Lic. Mariana Fernández',
      },
    },
    upcomingMeals: MOCK_MEALS,
  };
}

/**
 * Simulated fetch for when you want to test async loading.
 * Wraps getDashboardData in a promise with delay.
 */
export async function fetchDashboardData(
  options: { showEmptyStates?: boolean } = {},
): Promise<DashboardData> {
  if (MOCK_DELAY > 0) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
  }
  return getDashboardData(options);
}
