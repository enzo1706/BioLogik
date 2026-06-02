import { Clock, Flame } from 'lucide-react';
import { DashboardCard, EmptyState, Badge } from '@biologik/ui';
import type { DashboardMeal } from '../types';

interface UpcomingMealsProps {
  meals: DashboardMeal[];
  onNavigate?: (path: string) => void;
}

/**
 * Upcoming meals list — shows today's meal plan with macros.
 * Falls back to EmptyState when no meals are scheduled.
 */
export function UpcomingMeals({ meals, onNavigate }: UpcomingMealsProps) {
  if (meals.length === 0) {
    return (
      <DashboardCard title="Próximas Comidas" description="Plan de hoy">
        <EmptyState
          icon="empty"
          title="Sin comidas planificadas"
          description="Todavía no tenés comidas asignadas para hoy. Revisá tu menú semanal."
          actionLabel="Ver Menú Semanal"
          compact
          onAction={() => onNavigate?.('/meals')}
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Próximas Comidas"
      description={`${meals.length} comidas programadas para hoy`}
      footer={
        <button
          onClick={() => onNavigate?.('/meals')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Ver menú completo →
        </button>
      }
    >
      <div className="space-y-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-start gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50 sm:items-center"
          >
            {/* Time badge */}
            <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium tabular-nums">{meal.time}</span>
            </div>

            {/* Meal info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {meal.name}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <MacroBadge label="Cal" value={meal.calories} icon={<Flame className="h-3 w-3" />} />
                <MacroBadge label="P" value={`${meal.protein}g`} />
                <MacroBadge label="HC" value={`${meal.carbs}g`} />
                <MacroBadge label="G" value={`${meal.fat}g`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

// ── Macro Badge ──────────────────────────────────────────────

function MacroBadge({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <Badge variant="outline" className="gap-1 text-xs font-normal">
      {icon}
      <span className="font-medium">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </Badge>
  );
}
