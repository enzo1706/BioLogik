/**
 * Subscription Feature — BioLogik Customer
 *
 * Full subscription management: current plan, benefits, plan comparison,
 * payment history, and lifecycle actions (change, pause, cancel).
 * Uses mock data; swap for real API when backend endpoints are ready.
 */

export { SubscriptionPage } from './pages/subscription-page';
export type {
  SubscriptionData,
  CurrentSubscription,
  PlanDefinition,
  PlanType,
  SubscriptionStatus,
  PaymentRecord,
  PaymentStatus,
  BenefitGroup,
} from './types';
