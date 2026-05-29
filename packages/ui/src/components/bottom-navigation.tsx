'use client';

import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/cn';

// ── Bottom Nav Item ─────────────────────────────────────────

export interface BottomNavItem {
  /** Route path. */
  path: string;
  /** Display label. */
  label: string;
  /** Icon component. */
  icon: ReactNode;
  /** Active icon (optional, defaults to icon). */
  activeIcon?: ReactNode;
  /** Badge count. */
  badge?: number;
}

// ── Props ───────────────────────────────────────────────────

export interface BottomNavigationProps {
  /** Navigation items (max 5 recommended). */
  items: BottomNavItem[];
  /** Additional className. */
  className?: string;
}

// ── Component ───────────────────────────────────────────────

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'md:hidden', // Only visible on mobile
        className,
      )}
    >
      <div className="flex items-center justify-around px-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 text-xs font-medium transition-colors duration-200',
                'relative min-w-0 flex-1',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  {isActive && item.activeIcon ? item.activeIcon : item.icon}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </span>
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
