'use client';

import { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/cn';

// ── Sidebar Item ────────────────────────────────────────────

export interface SidebarItem {
  /** Route path. */
  path: string;
  /** Display label. */
  label: string;
  /** Icon component. */
  icon?: ReactNode;
  /** Badge count. */
  badge?: number;
  /** Nested items. */
  children?: SidebarItem[];
}

// ── Props ───────────────────────────────────────────────────

export interface SidebarProps {
  /** Navigation items. */
  items: SidebarItem[];
  /** App/logo section at top. */
  header?: ReactNode;
  /** Footer section. */
  footer?: ReactNode;
  /** Whether the sidebar is collapsed. */
  collapsed?: boolean;
  /** Collapse toggle callback. */
  onToggle?: () => void;
  /** Additional className. */
  className?: string;
}

// ── Sidebar Link ────────────────────────────────────────────

function SidebarLink({
  item,
  collapsed,
  depth = 0,
}: {
  item: SidebarItem;
  collapsed: boolean;
  depth?: number;
}) {
  const location = useLocation();
  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  return (
    <div>
      <NavLink
        to={item.path}
        end={!item.children}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground',
          collapsed && 'justify-center px-2',
        )}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && (
          <span className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')}>
            {item.icon}
          </span>
        )}
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>

      {/* Nested items */}
      {!collapsed && item.children && isActive && (
        <div className="ml-4 mt-1 space-y-1 border-l pl-2">
          {item.children.map((child) => (
            <SidebarLink
              key={child.path}
              item={child}
              collapsed={collapsed}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Component ───────────────────────────────────────────────

export function Sidebar({
  items,
  header,
  footer,
  collapsed = false,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {/* Header */}
      {header && (
        <div
          className={cn(
            'border-b px-4 py-4',
            collapsed && 'flex justify-center px-2',
          )}
        >
          {header}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => (
          <SidebarLink key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div
          className={cn(
            'border-t p-3',
            collapsed && 'flex justify-center',
          )}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}
