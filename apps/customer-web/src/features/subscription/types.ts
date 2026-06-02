/**
 * Subscription types — data models for the Customer Subscription page.
 *
 * These types represent the API response shape.
 * When the backend is ready, replace mock-data.ts with TanStack Query hooks
 * that return the same interfaces.
 */

// ── Enums / Unions ───────────────────────────────────────────

/** Available plan types. */
export type PlanType = 'weekly' | 'monthly' | 'none';

/** Subscription lifecycle status. */
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'none';

/** Payment transaction status. */
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

// ── Plan Definitions ─────────────────────────────────────────

/** A plan that the user can subscribe to. */
export interface PlanDefinition {
  id: string;
  type: PlanType;
  name: string;
  description: string;
  price: number;
  /** Old price before discount (for showing strikethrough). */
  originalPrice?: number;
  mealsPerWeek: number;
  /** List of included benefits. */
  benefits: string[];
  highlighted?: boolean;
}

// ── Current Subscription ─────────────────────────────────────

/** The user's current subscription details. */
export interface CurrentSubscription {
  plan: PlanType;
  status: SubscriptionStatus;
  nextBilling: string | null;
  mealsPerWeek: number;
  price: number;
  /** Date the current period started. */
  periodStart: string;
  /** Date the current period ends. */
  periodEnd: string;
  /** Days left in the current billing period. */
  daysRemaining: number;
  /** Whether the user has a valid payment method on file. */
  hasPaymentMethod: boolean;
  /** Last 4 digits of the card, if any. */
  cardLastFour?: string;
}

// ── Benefits ─────────────────────────────────────────────────

/** A group of benefits for display. */
export interface BenefitGroup {
  icon: string;
  title: string;
  description: string;
}

// ── Payment History ──────────────────────────────────────────

/** A single payment transaction record. */
export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  /** URL to download the receipt/invoice. */
  receiptUrl?: string;
}

// ── Top-level response ───────────────────────────────────────

/** Complete subscription page data returned by the API. */
export interface SubscriptionData {
  /** The user's current subscription. */
  current: CurrentSubscription;
  /** Available plan options for comparison / upgrade / downgrade. */
  availablePlans: PlanDefinition[];
  /** Benefits of the current plan. */
  benefits: BenefitGroup[];
  /** Payment history (most recent first). */
  paymentHistory: PaymentRecord[];
}
