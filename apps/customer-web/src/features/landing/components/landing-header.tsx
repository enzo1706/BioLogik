import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@biologik/ui';

const NAV_ITEMS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Cómo funciona', href: '#how-it-works' },
  { label: 'Beneficios', href: '#benefits' },
  { label: 'Testimonios', href: '#testimonials' },
] as const;

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50',
      )}
    >
      {/* Background layer — separate for smooth opacity transition */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-500',
          isScrolled
            ? 'bg-background/80 shadow-sm backdrop-blur-xl border-b border-neutral-200/50'
            : 'bg-transparent border-b border-transparent',
        )}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
        >
          <span
            className={cn(
              'transition-colors duration-300',
              isScrolled ? 'text-primary-600' : 'text-primary-500',
            )}
          >
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                'text-sm font-medium transition-colors duration-200 hover:text-primary-500',
                isScrolled ? 'text-neutral-700' : 'text-neutral-600',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to={ROUTES.LOGIN}
            className={cn(
              'text-sm font-medium transition-colors duration-200 hover:text-primary-600',
              isScrolled ? 'text-neutral-600' : 'text-neutral-700',
            )}
          >
            Iniciar Sesión
          </Link>
          <Button asChild size="sm" className="rounded-lg font-semibold">
            <Link to={ROUTES.REGISTER}>Comenzá hoy</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={cn(
            'flex items-center md:hidden transition-colors',
            isScrolled
              ? 'text-neutral-700'
              : 'text-neutral-800',
          )}
          aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
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
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-neutral-200/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="space-y-1 px-4 py-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-600"
                >
                  {item.label}
                </a>
              ))}
              <hr className="my-3 border-neutral-200" />
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Iniciar Sesión
              </Link>
              <Link
                to={ROUTES.REGISTER}
                onClick={() => setIsMobileOpen(false)}
                className="mt-2 block rounded-lg bg-primary-500 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-600"
              >
                Comenzá hoy
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
