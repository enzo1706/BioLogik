import { UtensilsCrossed, ShoppingBag, Weight, Calendar } from 'lucide-react';
import { StatCard } from '@biologik/ui';
import type { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
  onNavigate?: (path: string) => void;
}

/**
 * Stats cards row — shows key metrics for the customer.
 * Uses StatCard from @biologik/ui with accent variants.
 */
export function StatsCards({ stats, onNavigate }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Planned meals today */}
      <StatCard
        label="Comidas Planificadas"
        value={stats.plannedMealsToday}
        icon={<UtensilsCrossed className="h-full w-full" />}
        accent="primary"
        description="Para hoy"
        onClick={() => onNavigate?.('/meals')}
      />

      {/* Active order */}
      <StatCard
        label="Pedido Activo"
        value={
          stats.activeOrder
            ? `#${stats.activeOrder.id.replace('ORD-', '').split('-')[0] ?? '...'}`
            : '—'
        }
        icon={<ShoppingBag className="h-full w-full" />}
        accent={stats.activeOrder ? 'success' : 'warning'}
        description={
          stats.activeOrder
            ? `${stats.activeOrder.itemsCount} items · ${statusLabel(stats.activeOrder.status)}`
            : 'Sin pedido activo'
        }
        onClick={() => onNavigate?.('/orders')}
      />

      {/* Current weight */}
      <StatCard
        label="Peso Actual"
        value={stats.currentWeight ? `${stats.currentWeight} kg` : '—'}
        icon={<Weight className="h-full w-full" />}
        accent="info"
        description={
          stats.currentWeight && stats.lastWeightDate
            ? `Registrado el ${formatDate(stats.lastWeightDate)}`
            : stats.currentWeight
              ? 'Último registro'
              : 'Sin registro'
        }
        onClick={() => onNavigate?.('/progress')}
      />

      {/* Next appointment */}
      <StatCard
        label="Próxima Consulta"
        value={stats.nextAppointment ? formatNextDate(stats.nextAppointment.date) : '—'}
        icon={<Calendar className="h-full w-full" />}
        accent={stats.nextAppointment ? 'secondary' : 'warning'}
        description={
          stats.nextAppointment
            ? `${stats.nextAppointment.time} · ${stats.nextAppointment.nutritionistName}`
            : 'Sin turnos agendados'
        }
        onClick={() => onNavigate?.('/nutritionist')}
      />
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'Preparando',
    completed: 'Completado',
    delivered: 'Entregado',
  };
  return labels[status] ?? status;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return iso;
  }
}

function formatNextDate(iso: string): string {
  try {
    const now = new Date();
    const date = new Date(iso + 'T00:00:00');
    const diffDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays <= 7) return `En ${diffDays} días`;

    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return iso;
  }
}
