/**
 * Profile mock data — simulates backend API response.
 *
 * Replace with TanStack Query hooks when backend endpoints are implemented.
 *
 * @example Future:
 *   const { data, isLoading } = useQuery({
 *     queryKey: ['profile'],
 *     queryFn: () => api.get<ProfileData>('/profile'),
 *   });
 */

import type { ProfileData } from './types';

export function getProfileData(): ProfileData {
  return {
    personalInfo: {
      name: 'Martín Gómez',
      email: 'martin.gomez@email.com',
      phone: '+54 11 5555-1234',
      birthDate: '1992-08-15',
    },
    subscription: {
      plan: 'monthly',
      status: 'active',
      nextBilling: '2026-07-01',
      mealsPerWeek: 14,
      price: 89.99,
    },
    nutritionist: {
      id: 'nut-001',
      name: 'Lic. Mariana Fernández',
      specialty: 'Nutrición Deportiva',
      email: 'mariana.fernandez@biologik.com',
      phone: '+54 11 5555-5678',
    },
  };
}

/** Version without nutritionist assigned — for testing empty state. */
export function getProfileDataNoNutritionist(): ProfileData {
  return {
    ...getProfileData(),
    nutritionist: null,
  };
}

/** Version with cancelled subscription — for testing edge case. */
export function getProfileDataCancelled(): ProfileData {
  return {
    ...getProfileData(),
    subscription: {
      plan: 'none',
      status: 'cancelled',
      nextBilling: null,
      mealsPerWeek: 0,
      price: 0,
    },
  };
}
