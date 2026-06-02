import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, TrendingUp, User } from 'lucide-react';
import { Card, CardContent } from '@biologik/ui';
import { ROUTES } from '@/lib/constants';

interface ActionItem {
  label: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const ACTIONS: ActionItem[] = [
  {
    label: 'Menú Semanal',
    description: 'Planificá tus comidas',
    path: ROUTES.MEALS,
    icon: UtensilsCrossed,
    color: 'text-emerald-600 bg-emerald-100',
  },
  {
    label: 'Mis Pedidos',
    description: 'Seguí tus órdenes',
    path: ROUTES.ORDERS,
    icon: ShoppingBag,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    label: 'Mi Progreso',
    description: 'Evolución y medidas',
    path: ROUTES.PROGRESS,
    icon: TrendingUp,
    color: 'text-violet-600 bg-violet-100',
  },
  {
    label: 'Mi Perfil',
    description: 'Datos y preferencias',
    path: ROUTES.PROFILE,
    icon: User,
    color: 'text-amber-600 bg-amber-100',
  },
];

/**
 * Quick actions grid — 2×2 cards linking to main app sections.
 * Uses icons with distinct colors per action.
 */
export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Acciones Rápidas
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.path}
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
