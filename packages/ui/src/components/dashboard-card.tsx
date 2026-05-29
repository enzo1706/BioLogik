import { type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';

// ── Dashboard Card ──────────────────────────────────────────

export interface DashboardCardProps {
  /** Card title. */
  title: string;
  /** Optional description. */
  description?: string;
  /** Card content. */
  children: ReactNode;
  /** Icon or badge shown on top-right. */
  accessory?: ReactNode;
  /** Click handler. */
  onClick?: () => void;
  /** Additional className. */
  className?: string;
  /** Content className. */
  contentClassName?: string;
  /** Action footer. */
  footer?: ReactNode;
  /** Compact padding. */
  compact?: boolean;
}

export function DashboardCard({
  title,
  description,
  children,
  accessory,
  onClick,
  className,
  contentClassName,
  footer,
  compact = false,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className={cn(compact && 'p-4 pb-2')}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className={cn('text-base', compact && 'text-sm')}>
              {title}
            </CardTitle>
            {description && (
              <CardDescription className={cn(compact && 'text-xs')}>
                {description}
              </CardDescription>
            )}
          </div>
          {accessory && (
            <div className="shrink-0">{accessory}</div>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(compact && 'p-4 pt-0')}>
        <div className={contentClassName}>{children}</div>
      </CardContent>
      {footer && (
        <div className="border-t px-6 py-3">{footer}</div>
      )}
    </Card>
  );
}

// ── Stat Card ───────────────────────────────────────────────

export interface StatCardProps {
  /** Label (e.g. "Total Pedidos"). */
  label: string;
  /** Value (e.g. "1,234"). */
  value: string | number;
  /** Optional icon. */
  icon?: ReactNode;
  /** Optional trend indicator. */
  trend?: {
    value: string;
    positive: boolean;
  };
  /** Optional description. */
  description?: string;
  /** Click handler. */
  onClick?: () => void;
  /** Accent color variant. */
  accent?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  /** Additional className. */
  className?: string;
}

const accentStyles: Record<string, string> = {
  primary: 'border-l-4 border-l-primary',
  secondary: 'border-l-4 border-l-secondary',
  success: 'border-l-4 border-l-emerald-500',
  warning: 'border-l-4 border-l-amber-500',
  info: 'border-l-4 border-l-blue-500',
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  description,
  onClick,
  accent = 'primary',
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        accentStyles[accent],
        onClick && 'cursor-pointer hover:shadow-md',
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 p-1.5 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {trend && (
            <span
              className={cn(
                'text-sm font-medium',
                trend.positive ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              {trend.positive ? '+' : ''}{trend.value}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
