import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@biologik/ui';
import { Button } from '@biologik/ui';
import { Input } from '@biologik/ui';
import { FormField } from '@biologik/ui';
import { useAuth } from '@/providers/auth-provider';
import { ROUTES } from '@/lib/constants';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validateName(name: string): string | undefined {
  if (!name.trim()) return 'El nombre es requerido';
  if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  return undefined;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'El correo electrónico es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Correo electrónico inválido';
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una mayúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número';
  return undefined;
}

function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  if (!confirmPassword) return 'Confirmá tu contraseña';
  if (password !== confirmPassword) return 'Las contraseñas no coinciden';
  return undefined;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    navigate(ROUTES.DASHBOARD, { replace: true });
    return null;
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const newErrors: FormErrors = { ...errors };
    if (field === 'name') newErrors.name = validateName(name);
    if (field === 'email') newErrors.email = validateEmail(email);
    if (field === 'password') {
      newErrors.password = validatePassword(password);
      // Re-validate confirm password if it has a value
      if (confirmPassword) {
        newErrors.confirmPassword = validateConfirmPassword(password, confirmPassword);
      }
    }
    if (field === 'confirmPassword') {
      newErrors.confirmPassword = validateConfirmPassword(password, confirmPassword);
    }
    setErrors(newErrors);
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (nameErr) errs.name = nameErr;
    if (emailErr) errs.email = emailErr;
    if (passwordErr) errs.password = passwordErr;
    if (confirmErr) errs.confirmPassword = confirmErr;
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
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
        <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
        <CardDescription>
          Completá tus datos para registrarte en BioLogik
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

          {/* Name */}
          <FormField label="Nombre Completo" error={touched.name ? errors.name : undefined} required>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                error={touched.name ? errors.name : undefined}
                className="pl-10"
                autoComplete="name"
                disabled={isSubmitting}
              />
            </div>
          </FormField>

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
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <FormField
            label="Confirmar Contraseña"
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            required
          >
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                className="pl-10 pr-10"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          {/* Submit */}
          <Button type="submit" fullWidth loading={isSubmitting} disabled={isSubmitting} size="lg">
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Iniciá Sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
