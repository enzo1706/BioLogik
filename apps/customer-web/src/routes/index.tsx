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
            element: <PlaceholderPage title="Iniciar Sesión" />,
          },
          {
            path: ROUTES.REGISTER,
            element: <PlaceholderPage title="Crear Cuenta" />,
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
            element: <PlaceholderPage title="Dashboard" />,
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
            element: <PlaceholderPage title="Mi Perfil" />,
          },
          {
            path: ROUTES.SUBSCRIPTION,
            element: <PlaceholderPage title="Mi Suscripción" />,
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
