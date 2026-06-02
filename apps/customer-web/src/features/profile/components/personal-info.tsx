import { User, Mail, Phone, Calendar, Pencil } from 'lucide-react';
import { DashboardCard, Badge } from '@biologik/ui';
import type { PersonalInfo } from '../types';

interface PersonalInfoProps {
  info: PersonalInfo;
}

/**
 * Personal information card — displays user details.
 * Shows name, email, phone, and birth date with icon labels.
 */
export function PersonalInfoCard({ info }: PersonalInfoProps) {
  const fields: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { label: 'Nombre', value: info.name, icon: User },
    { label: 'Email', value: info.email, icon: Mail },
    { label: 'Teléfono', value: info.phone, icon: Phone },
    {
      label: 'Fecha de Nacimiento',
      value: new Date(info.birthDate + 'T00:00:00').toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      icon: Calendar,
    },
  ];

  return (
    <DashboardCard
      title="Información Personal"
      description="Tus datos de perfil"
      accessory={
        <Badge variant="outline" className="gap-1.5">
          <Pencil className="h-3 w-3" />
          Editar
        </Badge>
      }
    >
      <div className="divide-y divide-border">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.label}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {field.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
