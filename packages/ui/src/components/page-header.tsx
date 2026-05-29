import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

// ── Page Header ─────────────────────────────────────────────

export interface PageHeaderProps {
  /** Page title. */
  title: string;
  /** Optional description. */
  description?: string;
  /** Actions rendered on the right side. */
  actions?: ReactNode;
  /** Additional className. */
  className?: string;
  /** Whether to show a bottom border. */
  bordered?: boolean;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  bordered = true,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between',
        bordered && 'border-b mb-6',
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        className,
      )}
    >
      <div className="space-y-0.5">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
