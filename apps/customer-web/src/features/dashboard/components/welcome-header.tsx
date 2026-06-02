import { Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

/**
 * Returns a greeting based on the current hour.
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/**
 * Extract a display name from the authenticated user.
 * Priority: name → email local-part → "Usuario"
 */
function getDisplayName(user: { name?: string; email?: string } | null): string {
  if (!user) return 'Usuario';
  if (user.name?.trim()) return user.name.trim();
  if (user.email?.trim()) return user.email.trim().split('@')[0] ?? 'Usuario';
  return 'Usuario';
}

/**
 * Welcome header — shows user greeting and name.
 * Reads from AuthProvider, no props needed.
 */
export function WelcomeHeader() {
  const { user } = useAuth();
  const greeting = getGreeting();
  const displayName = getDisplayName(user);
  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {greeting}, {displayName}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground capitalize">
        {today}
      </p>
    </div>
  );
}
