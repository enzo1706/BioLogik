import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  TrendingUp,
  User,
  CreditCard,
  Stethoscope,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Menú Semanal', path: ROUTES.MEALS, icon: UtensilsCrossed },
  { label: 'Mis Pedidos', path: ROUTES.ORDERS, icon: ShoppingBag },
  { label: 'Mi Progreso', path: ROUTES.PROGRESS, icon: TrendingUp },
  { label: 'Mi Perfil', path: ROUTES.PROFILE, icon: User },
  { label: 'Suscripción', path: ROUTES.SUBSCRIPTION, icon: CreditCard },
  { label: 'Nutricionista', path: ROUTES.NUTRITIONIST, icon: Stethoscope },
] as const;

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col py-6">
      {/* App logo small */}
      <div className="mb-6 px-6">
        <span className="text-lg font-bold text-primary-700">BioLogik</span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 px-3">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto px-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
