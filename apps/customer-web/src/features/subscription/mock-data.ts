/**
 * Subscription mock data — simulates backend API response.
 *
 * Replace with TanStack Query hooks when backend endpoints are implemented.
 *
 * @example Future:
 *   const { data, isLoading } = useQuery({
 *     queryKey: QUERY_KEYS.SUBSCRIPTION,
 *     queryFn: () => api.get<SubscriptionData>('/subscription'),
 *   });
 */

import type {
  PlanDefinition,
  BenefitGroup,
  PaymentRecord,
  CurrentSubscription,
  SubscriptionData,
} from './types';

// ── Available Plans ──────────────────────────────────────────

const AVAILABLE_PLANS: PlanDefinition[] = [
  {
    id: 'plan-weekly',
    type: 'weekly',
    name: 'Semanal',
    description: 'Ideal para quienes quieren empezar o tienen una agenda variable.',
    price: 49.99,
    mealsPerWeek: 7,
    benefits: [
      '7 comidas por semana',
      'Menú rotativo semanal',
      'Entrega una vez por semana',
      'Soporte por email',
      'Acceso a la app',
    ],
  },
  {
    id: 'plan-monthly',
    type: 'monthly',
    name: 'Mensual',
    description: 'Nuestro plan más elegido. Nutrición personalizada sin preocupaciones.',
    price: 89.99,
    originalPrice: 119.99,
    mealsPerWeek: 14,
    benefits: [
      '14 comidas por semana',
      'Menú personalizado por nutricionista',
      'Dos entregas por semana',
      'Soporte prioritario 24/7',
      'Acceso a la app',
      'Chat con tu nutricionista',
      'Ajuste de menú semanal',
    ],
    highlighted: true,
  },
];

// ── Benefits by plan ─────────────────────────────────────────

const WEEKLY_BENEFITS: BenefitGroup[] = [
  { icon: 'UtensilsCrossed', title: '7 Comidas por Semana', description: 'Almuerzos y cenas listos para consumir. Menú rotativo semanal.' },
  { icon: 'Truck', title: 'Entrega Semanal', description: 'Recibís tus comidas una vez por semana en la puerta de tu casa.' },
  { icon: 'MessageCircle', title: 'Soporte por Email', description: 'Consultas respondidas en menos de 24 horas hábiles.' },
  { icon: 'Smartphone', title: 'App Incluida', description: 'Accedé a tu menú, seguimiento y más desde la app.' },
];

const MONTHLY_BENEFITS: BenefitGroup[] = [
  { icon: 'UtensilsCrossed', title: '14 Comidas por Semana', description: 'Todos los almuerzos y cenas de la semana. Menú personalizado.' },
  { icon: 'Truck', title: 'Dos Entregas por Semana', description: 'Recibís tus comidas dos veces por semana, siempre fresco.' },
  { icon: 'User', title: 'Nutricionista Asignado', description: 'Un profesional diseñá tu plan y ajusta según tus necesidades.' },
  { icon: 'MessageCircle', title: 'Chat Prioritario 24/7', description: 'Consultá con tu nutricionista cuando quieras, respuesta rápida.' },
  { icon: 'RefreshCw', title: 'Ajuste Semanal', description: 'Podés modificar tu menú todas las semanas antes del corte.' },
  { icon: 'Smartphone', title: 'App Incluida', description: 'Accedé a tu menú, historial, y métricas desde la app.' },
];

// ── Payment History ──────────────────────────────────────────

const PAYMENT_HISTORY: PaymentRecord[] = [
  { id: 'pay-006', date: '2026-06-01', description: 'Plan Mensual — Junio 2026', amount: 89.99, status: 'paid' },
  { id: 'pay-005', date: '2026-05-01', description: 'Plan Mensual — Mayo 2026', amount: 89.99, status: 'paid' },
  { id: 'pay-004', date: '2026-04-01', description: 'Plan Mensual — Abril 2026', amount: 89.99, status: 'paid' },
  { id: 'pay-003', date: '2026-03-15', description: 'Upgrade a Plan Mensual', amount: 59.99, status: 'paid' },
  { id: 'pay-002', date: '2026-03-01', description: 'Plan Semanal — Marzo 2026', amount: 49.99, status: 'paid' },
  { id: 'pay-001', date: '2026-02-22', description: 'Plan Semanal — Febrero 2026', amount: 49.99, status: 'paid' },
];

// ── Current Subscription ─────────────────────────────────────

const CURRENT_SUBSCRIPTION: CurrentSubscription = {
  plan: 'monthly',
  status: 'active',
  nextBilling: '2026-07-01',
  mealsPerWeek: 14,
  price: 89.99,
  periodStart: '2026-06-01',
  periodEnd: '2026-06-30',
  daysRemaining: 28,
  hasPaymentMethod: true,
  cardLastFour: '4242',
};

// ── Mock Data Functions ──────────────────────────────────────

/** Returns full subscription page data. */
export function getSubscriptionData(
  options: { empty?: boolean; cancelled?: boolean } = {},
): SubscriptionData {
  const { empty = false, cancelled = false } = options;

  if (empty) {
    return {
      current: {
        plan: 'none',
        status: 'none',
        nextBilling: null,
        mealsPerWeek: 0,
        price: 0,
        periodStart: '',
        periodEnd: '',
        daysRemaining: 0,
        hasPaymentMethod: false,
      },
      availablePlans: AVAILABLE_PLANS,
      benefits: [],
      paymentHistory: [],
    };
  }

  if (cancelled) {
    return {
      current: {
        ...CURRENT_SUBSCRIPTION,
        plan: 'none',
        status: 'cancelled',
        nextBilling: null,
        mealsPerWeek: 0,
        price: 0,
        daysRemaining: 0,
        hasPaymentMethod: false,
      },
      availablePlans: AVAILABLE_PLANS,
      benefits: [],
      paymentHistory: PAYMENT_HISTORY,
    };
  }

  return {
    current: CURRENT_SUBSCRIPTION,
    availablePlans: AVAILABLE_PLANS,
    benefits:
      CURRENT_SUBSCRIPTION.plan === 'monthly' ? MONTHLY_BENEFITS : WEEKLY_BENEFITS,
    paymentHistory: PAYMENT_HISTORY,
  };
}

/** Returns the active plan definition for the current subscription. */
export function getCurrentPlanDefinition(
  subscription: CurrentSubscription,
): PlanDefinition | undefined {
  return AVAILABLE_PLANS.find((p) => p.type === subscription.plan);
}
