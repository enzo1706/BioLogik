import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, AlertTriangle } from 'lucide-react';
import { Card, CardContent, Button, Dialog } from '@biologik/ui';
import { useAuth } from '@/providers/auth-provider';
import { ROUTES } from '@/lib/constants';

/**
 * Security section — change password and logout actions.
 * Uses Dialog from @biologik/ui for the logout confirmation.
 */
export function SecuritySection() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Seguridad
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Change password */}
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent
            className="flex items-center gap-4 p-4"
            onClick={() => {
              // TODO: Open change password dialog/form when backend is ready
            }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Cambiar Contraseña
              </p>
              <p className="text-xs text-muted-foreground">
                Actualizá tu contraseña
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card
          className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Cerrar Sesión
              </p>
              <p className="text-xs text-muted-foreground">
                Salí de tu cuenta
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirmar cierre de sesión"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Cerrar Sesión</h2>
              <p className="text-sm text-muted-foreground">
                ¿Estás seguro de que querés cerrar la sesión? Vas a necesitar
                iniciar sesión nuevamente para acceder a tu cuenta.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
