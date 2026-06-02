import { Stethoscope, Mail, Phone, GraduationCap } from 'lucide-react';
import { DashboardCard, EmptyState } from '@biologik/ui';
import type { AssignedNutritionist } from '../types';

interface AssignedNutritionistProps {
  nutritionist: AssignedNutritionist | null;
  onViewProfile?: () => void;
}

/**
 * Assigned nutritionist card — shows the customer's nutritionist details.
 * Falls back to EmptyState when no nutritionist is assigned.
 */
export function AssignedNutritionistCard({
  nutritionist,
  onViewProfile,
}: AssignedNutritionistProps) {
  if (!nutritionist) {
    return (
      <DashboardCard title="Nutricionista" description="Profesional asignado">
        <EmptyState
          icon="empty"
          title="Sin nutricionista asignado"
          description="Todavía no tenés un nutricionista asignado. Podés solicitarlo desde la sección de nutricionista."
          actionLabel="Ver Nutricionistas"
          compact
          onAction={onViewProfile}
        />
      </DashboardCard>
    );
  }

  const fields: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { label: 'Especialidad', value: nutritionist.specialty, icon: GraduationCap },
    { label: 'Email', value: nutritionist.email, icon: Mail },
    { label: 'Teléfono', value: nutritionist.phone, icon: Phone },
  ];

  return (
    <DashboardCard
      title="Nutricionista"
      description="Profesional asignado"
      footer={
        <button
          onClick={onViewProfile}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Ver perfil completo →
        </button>
      }
    >
      <div className="space-y-4">
        {/* Nutritionist avatar + name */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10">
            <Stethoscope className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {nutritionist.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {nutritionist.specialty}
            </p>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-2">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="flex items-center gap-3 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
}
