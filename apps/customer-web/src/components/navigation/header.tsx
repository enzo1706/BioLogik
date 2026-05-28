import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

const NAV_ITEMS = [
  { label: 'Inicio', path: ROUTES.HOME },
  { label: 'Menú', path: ROUTES.MEALS },
  { label: 'Pedidos', path: ROUTES.ORDERS },
  { label: 'Progreso', path: ROUTES.PROGRESS },
] as const;

export function Header() {
  const { pathname } = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === 'down' && pathname !== ROUTES.HOME;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-transform duration-300',
        isHidden && '-translate-y-full',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-primary-700"
        >
          <span className="text-primary-500">{APP_NAME}</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-600',
                pathname === item.path
                  ? 'text-primary-600'
                  : 'text-neutral-600',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-800"
          >
            Iniciar Sesión
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-600"
          >
            Registrarse
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center md:hidden"
          aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6 text-neutral-700" />
          ) : (
            <Menu className="h-6 w-6 text-neutral-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t bg-background md:hidden"
          >
            <nav className="space-y-1 px-4 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-neutral-200" />
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Iniciar Sesión
              </Link>
              <Link
                to={ROUTES.REGISTER}
                onClick={() => setIsMobileOpen(false)}
                className="block rounded-lg bg-primary-500 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Registrarse
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
