'use client';

import { CreditCard, CalendarDays, Calendar, Clock } from 'lucide-react';
import { DashboardCard, Badge } from '@biologik/ui';
import type { CurrentSubscription } from '../types';

// ── Status config ────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  paused: 'Pausado',
  cancelled: 'Cancelado',
  none: 'Sin suscripción',
};

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'outline'> = {
  active: 'success',
  paused: 'warning',
  cancelled: 'destructive',
  none: 'outline',
};

// ── Props ────────────────────────────────────────────────────

interface CurrentPlanProps {
  subscription: CurrentSubscription;
  onManagePayment?: () => void;
}

// ── Helpers ──────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ── Component ────────────────────────────────────────────────

/**
 * Shows the user's current plan, status badge, and billing period details.
 */
export function CurrentPlan({ subscription, onManagePayment }: CurrentPlanProps) {
  const statusLabel = STATUS_LABELS[subscription.status] ?? 'Desconocido';
  const statusVariant = STATUS_VARIANTS[subscription.status] ?? 'outline';

  return (
    <DashboardCard
      title="Plan Actual"
      description="Detalle de tu suscripción activa"
      footer={
        subscription.hasPaymentMethod ? (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              <span>
                {subscription.cardLastFour
                  ? `Terminada en ${subscription.cardLastFour}`
                  : 'Tarjeta registrada'}
              </span>
            </div>
            <button
              onClick={onManagePayment}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Gestionar
            </button>
          </div>
        ) : (
          <button
            onClick={onManagePayment}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            + Agregar método de pago
          </button>
        )
      }
    >
      <div className="space-y-5">
        {/* Plan name + status */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Plan {subscription.plan === 'monthly' ? 'Mensual' : subscription.plan === 'weekly' ? 'Semanal' : '—'}
            </h3>
            <p className="text-sm text-muted-foreground">
              ${subscription.price.toFixed(2)} / mes
            </p>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>

        {/* Billing period */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Inicio período</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {subscription.periodStart ? formatDate(subscription.periodStart) : '—'}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Fin período</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {subscription.periodEnd ? formatDate(subscription.periodEnd) : '—'}
            </p>
          </div>
          {subscription.daysRemaining > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Próxima facturación</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {subscription.nextBilling ? formatDate(subscription.nextBilling) : '—'}
              </p>
            </div>
          )}
        </div>

        {/* Meals info */}
        <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-3">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">
            <strong>{subscription.mealsPerWeek} comidas</strong> por semana
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
