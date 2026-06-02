import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '@biologik/ui';
import { getDashboardData } from '../mock-data';
import { WelcomeHeader } from '../components/welcome-header';
import { StatsCards } from '../components/stats-cards';
import { UpcomingMeals } from '../components/upcoming-meals';
import { NextAppointment } from '../components/next-appointment';
import { QuickActions } from '../components/quick-actions';

/**
 * Customer Dashboard page — main landing after login.
 *
 * Currently uses mock data. When backend endpoints are ready:
 *   1. Replace `getDashboardData()` with `useQuery(...)`
 *   2. Replace `loading` state with `isLoading` from TanStack Query
 *   3. Wrap in `<Suspense>` or use `isLoading` directly
 *
 * @example Future:
 *   const { data, isLoading } = useDashboardData();
 *   if (isLoading) return <LoadingState message="Cargando dashboard..." />;
 */
export function DashboardPage() {
  const navigate = useNavigate();

  // ── Simulated loading for future API integration ──────────
  // When connecting to the real API:
  //   1. Import useDashboardData from '@/hooks/use-dashboard'
  //   2. Replace this block with:
  //      const { data, isLoading } = useDashboardData();
  //      if (isLoading) return <LoadingState ... />;
  const data = useMemo(() => getDashboardData(), []);
  const loading = false;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingState message="Cargando tu dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <WelcomeHeader />

      {/* Stats cards */}
      <StatsCards stats={data.stats} onNavigate={handleNavigate} />

      {/* Main content grid: meals + appointment */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingMeals
            meals={data.upcomingMeals}
            onNavigate={handleNavigate}
          />
        </div>
        <div>
          <NextAppointment
            appointment={data.stats.nextAppointment}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* Quick actions */}
      <QuickActions />
    </div>
  );
}
