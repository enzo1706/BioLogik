'use client';

import { UtensilsCrossed, Truck, MessageCircle, Smartphone, User, RefreshCw } from 'lucide-react';
import type { BenefitGroup } from '../types';
import type { FC } from 'react';

// ── Icon map ─────────────────────────────────────────────────

const ICON_MAP: Record<string, FC<{ className?: string }>> = {
  UtensilsCrossed,
  Truck,
  MessageCircle,
  Smartphone,
  User,
  RefreshCw,
};

// ── Props ────────────────────────────────────────────────────

interface PlanBenefitsProps {
  benefits: BenefitGroup[];
}

// ── Component ────────────────────────────────────────────────

/**
 * Displays the benefits of the current plan as a grid of icon + text cards.
 */
export function PlanBenefits({ benefits }: PlanBenefitsProps) {
  if (benefits.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Beneficios Incluidos
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit, i) => {
          const Icon = ICON_MAP[benefit.icon] ?? Smartphone;

          return (
            <div
              key={i}
              className="flex gap-3 rounded-lg border p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
