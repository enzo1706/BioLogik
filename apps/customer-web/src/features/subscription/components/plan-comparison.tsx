'use client';

import { Check } from 'lucide-react';
import { Button } from '@biologik/ui';
import type { PlanDefinition, PlanType } from '../types';

// ── Props ────────────────────────────────────────────────────

interface PlanComparisonProps {
  plans: PlanDefinition[];
  currentPlan: PlanType;
  onSelectPlan?: (planId: string) => void;
}

// ── Component ────────────────────────────────────────────────

/**
 * Side-by-side comparison of available plans.
 * Highlights the recommended / most popular option.
 */
export function PlanComparison({ plans, currentPlan, onSelectPlan }: PlanComparisonProps) {
  if (plans.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No hay planes disponibles en este momento.</p>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Comparativa de Planes
      </h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = plan.type === currentPlan;
          const isHighlighted = plan.highlighted;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl border p-6 transition-shadow hover:shadow-md ${
                isHighlighted
                  ? 'border-primary/40 bg-primary/[0.03] shadow-sm'
                  : 'border-border'
              }`}
            >
              {/* Highlight badge */}
              {isHighlighted && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Más elegido
                </span>
              )}

              {/* Current badge */}
              {isCurrent && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                  Actual
                </span>
              )}

              {/* Header */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-foreground">{plan.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-5 flex items-baseline gap-1.5">
                {plan.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${plan.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl font-extrabold text-foreground">
                  ${plan.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>

              {/* Meals per week */}
              <p className="mb-4 text-sm text-muted-foreground">
                <strong className="text-foreground">{plan.mealsPerWeek} comidas</strong> por semana
              </p>

              {/* Benefits list */}
              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Action */}
              <Button
                variant={isCurrent ? 'outline' : 'default'}
                className="w-full"
                disabled={isCurrent}
                onClick={() => onSelectPlan?.(plan.id)}
              >
                {isCurrent ? 'Plan actual' : 'Elegir plan'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
