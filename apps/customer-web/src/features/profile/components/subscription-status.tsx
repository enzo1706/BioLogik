import { CreditCard, CalendarDays, UtensilsCrossed, DollarSign } from 'lucide-react';
import { DashboardCard, EmptyState } from '@biologik/ui';
import type { SubscriptionInfo } from '../types';

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
  onManage?: () => void;
}

const PLAN_LABELS: Record<string, string> = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  none: 'Sin plan',
};

type StatusVariant = 'success' | 'warning' | 'destructive' | 'outline';

interface StatusConfig {
  label: string;
  variant: StatusVariant;
}

function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case 'active':   return { label: 'Activo', variant: 'success' };
    case 'paused':   return { label: 'Pausado', variant: 'warning' };
    case 'cancelled': return { label: 'Cancelado', variant: 'destructive' };
    default:          return { label: 'Sin suscripción', variant: 'outline' };
  }
}

/**
 * Subscription status card — shows current plan, status, and billing info.
 * Falls back to EmptyState when the user has no active plan.
 */
export function SubscriptionStatus({
  subscription,
  onManage,
}: SubscriptionStatusProps) {
  if (subscription.plan === 'none' || subscription.status === 'cancelled') {
    return (
      <DashboardCard title="Suscripción" description="Plan y facturación">
        <EmptyState
          icon="empty"
          title="Sin suscripción activa"
          description="No tenés un plan activo. Elegí el plan que mejor se adapte a tus necesidades."
          actionLabel="Ver Planes"
          compact
          onAction={onManage}
        />
      </DashboardCard>
    );
  }

  const statusCfg = getStatusConfig(subscription.status);

  return (
    <DashboardCard
      title="Suscripción"
      description="Plan y facturación"
      footer={
        <button
          onClick={onManage}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Gestionar suscripción →
        </button>
      }
    >
      <div className="space-y-4">
        {/* Plan name + status badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Plan {PLAN_LABELS[subscription.plan] ?? subscription.plan}
            </span>
          </div>
          <StatusBadge
            label={statusCfg.label}
            variant={statusCfg.variant}
          />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <DetailItem
            icon={CalendarDays}
            label="Próxima facturación"
            value={
              subscription.nextBilling
                ? new Date(subscription.nextBilling + 'T00:00:00').toLocaleDateString(
                    'es-AR',
                    { day: 'numeric', month: 'short' },
                  )
                : '—'
            }
          />
          <DetailItem
            icon={UtensilsCrossed}
            label="Comidas por semana"
            value={`${subscription.mealsPerWeek}`}
          />
          <DetailItem
            icon={DollarSign}
            label="Precio"
            value={`$${subscription.price.toFixed(2)}`}
          />
        </div>
      </div>
    </DashboardCard>
  );
}

// ── Sub-components ───────────────────────────────────────────

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: 'success' | 'warning' | 'destructive' | 'outline';
}) {
  const dotColors: Record<string, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    destructive: 'bg-red-500',
    outline: 'bg-muted-foreground',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
        variant === 'success'
          ? 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
          : variant === 'warning'
            ? 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
            : variant === 'destructive'
              ? 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              : 'text-muted-foreground'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotColors[variant] ?? dotColors.outline}`}
      />
      {label}
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-primary/5 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
