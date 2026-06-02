import { useMemo } from 'react';
import { LoadingState, PageHeader } from '@biologik/ui';
import { getSubscriptionData } from '../mock-data';
import { CurrentPlan } from '../components/current-plan';
import { PlanBenefits } from '../components/plan-benefits';
import { PlanComparison } from '../components/plan-comparison';
import { PaymentHistory } from '../components/payment-history';
import { SubscriptionActions } from '../components/subscription-actions';

/**
 * Subscription page — view and manage the user's subscription.
 *
 * Currently uses mock data. When backend endpoints are ready:
 *   1. Replace `getSubscriptionData()` with `useQuery(...)`
 *   2. Replace `loading` state with `isLoading` from TanStack Query
 *
 * @example Future:
 *   const { data, isLoading } = useQuery({
 *     queryKey: QUERY_KEYS.SUBSCRIPTION,
 *     queryFn: () => api.get<SubscriptionData>('/subscription'),
 *   });
 *   if (isLoading) return <LoadingState message="Cargando..." />;
 */
export function SubscriptionPage() {
  // ── Simulated loading for future API integration ──────────
  const data = useMemo(() => getSubscriptionData(), []);
  const loading = false;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingState message="Cargando tu suscripción..." />
      </div>
    );
  }

  const handleAction = (action: string) => {
    // TODO: wire to real API calls or navigation
    console.info(`[Subscription] Action: ${action}`);
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <PageHeader
        title="Mi Suscripción"
        description="Gestioná tu plan, métodos de pago y más."
      />

      {/* Current plan & billing info */}
      <CurrentPlan
        subscription={data.current}
        onManagePayment={() => handleAction('manage-payment')}
      />

      {/* Active benefits */}
      {data.benefits.length > 0 && <PlanBenefits benefits={data.benefits} />}

      {/* Plan comparison */}
      <PlanComparison
        plans={data.availablePlans}
        currentPlan={data.current.plan}
        onSelectPlan={(planId) => handleAction(`select-plan:${planId}`)}
      />

      {/* Payment history */}
      {data.paymentHistory.length > 0 && (
        <PaymentHistory payments={data.paymentHistory} />
      )}

      {/* Subscription actions (change, pause, cancel) */}
      <SubscriptionActions
        status={data.current.status}
        onChangePlan={() => handleAction('change-plan')}
        onPause={() => handleAction('pause')}
        onCancel={() => handleAction('cancel')}
      />
    </div>
  );
}
