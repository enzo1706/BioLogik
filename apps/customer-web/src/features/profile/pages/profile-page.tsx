import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@biologik/ui';
import { getProfileData } from '../mock-data';
import { PersonalInfoCard } from '../components/personal-info';
import { SubscriptionStatus } from '../components/subscription-status';
import { AssignedNutritionistCard } from '../components/assigned-nutritionist';
import { SecuritySection } from '../components/security-section';
import { ROUTES } from '@/lib/constants';

/**
 * Customer Profile page — personal info, subscription, nutritionist, security.
 *
 * Currently uses mock data. When backend endpoints are ready:
 *   1. Replace `getProfileData()` with TanStack Query
 *   2. Wrap mutation hooks for edit actions
 *
 * @example Future:
 *   const { data, isLoading } = useQuery({ queryKey: ['profile'], ... });
 *   if (isLoading) return <LoadingState message="Cargando perfil..." />;
 */
export function ProfilePage() {
  const navigate = useNavigate();

  // ── Mock data (swap for API call later) ──────────────────
  const data = useMemo(() => getProfileData(), []);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <PageHeader
        title="Mi Perfil"
        description="Gestioná tu información personal, suscripción y seguridad"
      />

      {/* Two-column layout on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard info={data.personalInfo} />
        <SubscriptionStatus
          subscription={data.subscription}
          onManage={() => navigate(ROUTES.SUBSCRIPTION)}
        />
      </div>

      {/* Nutritionist — full width */}
      <AssignedNutritionistCard
        nutritionist={data.nutritionist}
        onViewProfile={() => navigate(ROUTES.NUTRITIONIST)}
      />

      {/* Security */}
      <SecuritySection />
    </div>
  );
}
