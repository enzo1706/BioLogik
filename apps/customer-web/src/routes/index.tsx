import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { RootLayout } from '@/layouts/root-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { ProtectedRoute } from '@biologik/auth';
import { LoadingState } from '@biologik/ui';

// Lazy-loaded landing page
const LandingPage = lazy(() =>
  import('@/features/landing').then((m) => ({ default: m.LandingPage })),
);

// Lazy-loaded dashboard page
const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })),
);

// Lazy-loaded auth pages
const LoginPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.LoginPage })),
);

// Lazy-loaded profile page
const ProfilePage = lazy(() =>
  import('@/features/profile').then((m) => ({ default: m.ProfilePage })),
);

// Lazy-loaded subscription page
const SubscriptionPage = lazy(() =>
  import('@/features/subscription').then((m) => ({ default: m.SubscriptionPage })),
);
const RegisterPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.RegisterPage })),
);

// Lazy-loaded page placeholders
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-neutral-800">{title}</h1>
      <p className="mt-2 text-neutral-500">Coming soon</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  // Landing page — standalone, with own header/footer
  {
    index: true,
    element: (
      <Suspense fallback={<LoadingState message="Cargando..." />}>
        <LandingPage />
      </Suspense>
    ),
  },
  // App pages with standard layout
  {
    element: <RootLayout />,
    children: [
      // Public auth routes
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: (
              <Suspense fallback={<LoadingState message="Cargando..." />}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.REGISTER,
            element: (
              <Suspense fallback={<LoadingState message="Cargando..." />}>
                <RegisterPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.FORGOT_PASSWORD,
            element: <PlaceholderPage title="Recuperar Contraseña" />,
          },
        ],
      },
      // Authenticated routes — protected with ProtectedRoute
      {
        element: (
          <ProtectedRoute redirectTo={ROUTES.LOGIN}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={<LoadingState message="Cargando dashboard..." />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.MEALS,
            element: <PlaceholderPage title="Menú Semanal" />,
          },
          {
            path: ROUTES.ORDERS,
            element: <PlaceholderPage title="Mis Pedidos" />,
          },
          {
            path: ROUTES.CART,
            element: <PlaceholderPage title="Carrito" />,
          },
          {
            path: ROUTES.CHECKOUT,
            element: <PlaceholderPage title="Checkout" />,
          },
          {
            path: ROUTES.PROGRESS,
            element: <PlaceholderPage title="Mi Progreso" />,
          },
          {
            path: ROUTES.PROFILE,
            element: (
              <Suspense fallback={<LoadingState message="Cargando perfil..." />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SUBSCRIPTION,
            element: (
              <Suspense fallback={<LoadingState message="Cargando suscripción..." />}>
                <SubscriptionPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.NUTRITIONIST,
            element: <PlaceholderPage title="Mi Nutricionista" />,
          },
        ],
      },
      // Catch-all
      {
        path: '*',
        element: <Navigate to={ROUTES.HOME} replace />,
      },
    ],
  },
]);
