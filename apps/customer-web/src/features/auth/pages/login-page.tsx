import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@biologik/ui';
import { Button } from '@biologik/ui';
import { Input } from '@biologik/ui';
import { FormField } from '@biologik/ui';
import { useAuth } from '@/providers/auth-provider';
import { ROUTES } from '@/lib/constants';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'El correo electrónico es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Correo electrónico inválido';
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return undefined;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;
    navigate(from, { replace: true });
    return null;
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur
    const newErrors: FormErrors = { ...errors };
    if (field === 'email') newErrors.email = validateEmail(email);
    if (field === 'password') newErrors.password = validatePassword(password);
    setErrors(newErrors);
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    if (emailErr) errs.email = emailErr;
    if (passwordErr) errs.password = passwordErr;
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <Link to={ROUTES.HOME} className="mx-auto mb-2 text-2xl font-extrabold tracking-tight text-primary-500">
          BioLogik
        </Link>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresá tu correo y contraseña para acceder a tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* General error banner */}
          {errors.general && (
            <div
              className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email */}
          <FormField label="Correo Electrónico" error={touched.email ? errors.email : undefined} required>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                className="pl-10"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
          </FormField>

          {/* Password */}
          <FormField label="Contraseña" error={touched.password ? errors.password : undefined} required>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : undefined}
                className="pl-10 pr-10"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          {/* Forgot password link */}
          <div className="flex justify-end">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit */}
          <Button type="submit" fullWidth loading={isSubmitting} disabled={isSubmitting} size="lg">
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{' '}
          <Link to={ROUTES.REGISTER} className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
