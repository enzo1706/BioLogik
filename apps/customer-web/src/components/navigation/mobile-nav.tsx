import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, TrendingUp, User } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const BOTTOM_NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Menú', path: ROUTES.MEALS, icon: UtensilsCrossed },
  { label: 'Pedidos', path: ROUTES.ORDERS, icon: ShoppingBag },
  { label: 'Progreso', path: ROUTES.PROGRESS, icon: TrendingUp },
  { label: 'Perfil', path: ROUTES.PROFILE, icon: User },
] as const;

/**
 * Bottom navigation bar for mobile devices.
 * Visible only on small screens (< md breakpoint).
 */
export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700',
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
