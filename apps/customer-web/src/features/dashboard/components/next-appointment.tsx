import { Calendar, Clock, Stethoscope, MapPin } from 'lucide-react';
import { DashboardCard, EmptyState, Badge } from '@biologik/ui';
import type { DashboardAppointment } from '../types';

interface NextAppointmentProps {
  appointment: DashboardAppointment | null;
  onNavigate?: (path: string) => void;
}

/**
 * Next appointment card — shows the upcoming nutritionist visit.
 * Falls back to EmptyState when no appointment is scheduled.
 */
export function NextAppointment({ appointment, onNavigate }: NextAppointmentProps) {
  if (!appointment) {
    return (
      <DashboardCard title="Próxima Consulta" description="Turno con nutricionista">
        <EmptyState
          icon="empty"
          title="Sin turnos agendados"
          description="Aún no tenés una consulta programada. Agendá un turno con tu nutricionista."
          actionLabel="Agendar Turno"
          compact
          onAction={() => onNavigate?.('/nutritionist')}
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Próxima Consulta"
      description="Turno con nutricionista"
      footer={
        <button
          onClick={() => onNavigate?.('/nutritionist')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Ver detalle →
        </button>
      }
    >
      <div className="space-y-4">
        {/* Date & Time */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatAppointmentDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{appointment.time} hs</span>
          </div>
        </div>

        {/* Nutritionist info */}
        <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {appointment.nutritionistName}
            </p>
            {appointment.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{appointment.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div>
          <Badge variant="secondary" className="gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Confirmado
          </Badge>
        </div>
      </div>
    </DashboardCard>
  );
}

// ── Helpers ──────────────────────────────────────────────────

function formatAppointmentDate(iso: string): string {
  try {
    const date = new Date(iso + 'T00:00:00');
    const now = new Date();
    const diffDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    const prefix =
      diffDays === 0
        ? 'Hoy'
        : diffDays === 1
          ? 'Mañana'
          : '';

    const formatted = date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    return prefix ? `${prefix}, ${formatted}` : formatted;
  } catch {
    return iso;
  }
}
