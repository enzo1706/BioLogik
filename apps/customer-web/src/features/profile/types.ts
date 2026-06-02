/**
 * Profile types — data models for the Customer Profile.
 *
 * These types represent the API response shape.
 * When the backend is ready, replace mock-data.ts with TanStack Query hooks.
 */

/** Personal information. */
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  avatarUrl?: string;
}

/** Subscription plan details. */
export interface SubscriptionInfo {
  plan: 'weekly' | 'monthly' | 'none';
  status: 'active' | 'paused' | 'cancelled' | 'none';
  nextBilling: string | null;
  mealsPerWeek: number;
  price: number;
}

/** Assigned nutritionist information. */
export interface AssignedNutritionist {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

/** Top-level profile data. */
export interface ProfileData {
  personalInfo: PersonalInfo;
  subscription: SubscriptionInfo;
  nutritionist: AssignedNutritionist | null;
}
