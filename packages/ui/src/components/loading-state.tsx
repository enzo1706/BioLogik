import { cn } from '../lib/cn';
import { Loader2 } from 'lucide-react';

// ── Loading State Full Page ─────────────────────────────────

export interface LoadingStateProps {
  /** Loading message. */
  message?: string;
  /** Size variant. */
  size?: 'sm' | 'md' | 'lg';
  /** Full page overlay. */
  fullPage?: boolean;
  /** Additional className. */
  className?: string;
}

export function LoadingState({
  message = 'Cargando...',
  size = 'md',
  fullPage = false,
  className,
}: LoadingStateProps) {
  const sizeMap = {
    sm: { icon: 'h-5 w-5', text: 'text-xs' },
    md: { icon: 'h-8 w-8', text: 'text-sm' },
    lg: { icon: 'h-12 w-12', text: 'text-base' },
  };

  const s = sizeMap[size];

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullPage && 'min-h-[60vh]',
        className,
      )}
    >
      <Loader2 className={cn('animate-spin text-primary', s.icon)} />
      <p className={cn('text-muted-foreground', s.text)}>{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// ── Skeleton Loaders ────────────────────────────────────────

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a card. */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-2 h-3 w-5/6" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

/** Skeleton for a table row. */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a stat card. */
export function StatSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <Skeleton className="mb-2 h-3 w-20" />
      <Skeleton className="mb-1 h-8 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
