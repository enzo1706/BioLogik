import { type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Inbox, SearchX, AlertCircle } from 'lucide-react';
import { Button } from './button';

// ── Props ───────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Icon variant. */
  icon?: 'empty' | 'search' | 'error' | ReactNode;
  /** Title text. */
  title: string;
  /** Description text. */
  description?: string;
  /** Action button label. */
  actionLabel?: string;
  /** Action callback. */
  onAction?: () => void;
  /** Compact mode (less padding). */
  compact?: boolean;
  /** Additional className. */
  className?: string;
}

// ── Icons map ───────────────────────────────────────────────

const DefaultIcons: Record<string, typeof Inbox> = {
  empty: Inbox,
  search: SearchX,
  error: AlertCircle,
};

// ── Component ───────────────────────────────────────────────

export function EmptyState({
  icon = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
  className,
}: EmptyStateProps) {
  const IconComponent = typeof icon === 'string' ? DefaultIcons[icon] ?? Inbox : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8' : 'py-16',
        className,
      )}
    >
      {IconComponent ? (
        <IconComponent
          className={cn(
            'mb-4 text-muted-foreground',
            compact ? 'h-8 w-8' : 'h-12 w-12',
          )}
          strokeWidth={1.5}
        />
      ) : (
        icon
      )}

      <h3
        className={cn(
          'font-semibold text-foreground',
          compact ? 'text-sm' : 'text-lg',
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'mt-1 max-w-sm text-muted-foreground',
            compact ? 'text-xs' : 'text-sm',
          )}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
