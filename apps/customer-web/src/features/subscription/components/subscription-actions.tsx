'use client';

import { useState } from 'react';
import { Button, Dialog } from '@biologik/ui';
import { PauseCircle, XCircle, ArrowLeftRight } from 'lucide-react';
import type { SubscriptionStatus } from '../types';

// ── Props ────────────────────────────────────────────────────

interface SubscriptionActionsProps {
  status: SubscriptionStatus;
  onChangePlan?: () => void;
  onPause?: () => void;
  onCancel?: () => void;
}

// ── Component ────────────────────────────────────────────────

/**
 * Action buttons for managing the subscription lifecycle.
 * Shows contextual buttons based on current status.
 *
 * - Active: Change plan, Pause, Cancel
 * - Paused: Change plan, Resume, Cancel
 * - Cancelled / None: (no actions shown — handled elsewhere)
 */
export function SubscriptionActions({
  status,
  onChangePlan,
  onPause,
  onCancel,
}: SubscriptionActionsProps) {
  const [confirmAction, setConfirmAction] = useState<'pause' | 'cancel' | null>(null);

  if (status === 'cancelled' || status === 'none') {
    return null;
  }

  const confirmConfig =
    confirmAction === 'pause'
      ? {
          title: 'Pausar suscripción',
          message:
            'Podés reanudar tu suscripción en cualquier momento. Seguís teniendo acceso hasta el final del período actual.',
          confirmLabel: 'Pausar',
          isDestructive: false,
        }
      : confirmAction === 'cancel'
        ? {
            title: 'Cancelar suscripción',
            message:
              'Perdés el acceso al final del período actual. Esta acción no se puede deshacer.',
            confirmLabel: 'Cancelar suscripción',
            isDestructive: true,
          }
        : null;

  return (
    <>
      <div>
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Acciones
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onChangePlan}>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Cambiar plan
          </Button>

          {status === 'paused' ? (
            <Button variant="outline" onClick={onPause}>
              <PauseCircle className="mr-2 h-4 w-4" />
              Reanudar suscripción
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setConfirmAction('pause')}>
              <PauseCircle className="mr-2 h-4 w-4" />
              Pausar suscripción
            </Button>
          )}

          <Button
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => setConfirmAction('cancel')}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar suscripción
          </Button>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmConfig && (
        <Dialog
          open={confirmAction !== null}
          onClose={() => setConfirmAction(null)}
          title={confirmConfig.title}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{confirmConfig.title}</h2>
              <p className="text-sm text-muted-foreground">{confirmConfig.message}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmAction(null)}>
                Cancelar
              </Button>
              <Button
                variant={confirmConfig.isDestructive ? 'destructive' : 'default'}
                onClick={() => {
                  if (confirmAction === 'pause') onPause?.();
                  if (confirmAction === 'cancel') onCancel?.();
                  setConfirmAction(null);
                }}
              >
                {confirmConfig.confirmLabel}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
