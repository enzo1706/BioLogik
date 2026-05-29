import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { Button } from '@biologik/ui';
import { ArrowRight } from 'lucide-react';
import { useIntersection } from '../hooks/use-intersection';

export function CTASection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-28">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-300 to-secondary-500" />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="container-page relative z-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Listo para transformar tu alimentación?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Unite a cientos de personas que ya entrenan y comen mejor con
            BioLogik. Tu primera semana tiene{' '}
            <span className="font-semibold text-white">20% de descuento</span>.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="xl"
              className="w-full rounded-xl border-2 border-white/20 bg-white px-10 text-base font-semibold text-secondary-600 shadow-xl transition-all duration-300 hover:bg-white/90 hover:shadow-2xl sm:w-auto"
            >
              <Link to={ROUTES.REGISTER}>
                Empezá ahora
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="xl"
              className="w-full rounded-xl px-10 text-base font-semibold text-white/90 hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link to={ROUTES.MEALS}>Ver planes</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-white/60">
            Sin compromisos. Cancelá cuando quieras.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
