import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { Button } from '@biologik/ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedCounter } from './animated-counter';

const MOTION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
};

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-50/30 to-background" />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-secondary-200/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary-100/20 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        variants={MOTION_VARIANTS}
        initial="hidden"
        animate="visible"
        className="container-page relative z-10 py-16 md:py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div variants={MOTION_VARIANTS.item} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-xs font-medium text-primary-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Nutrición inteligente para tu rendimiento
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={MOTION_VARIANTS.item}
            className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Energía real para{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              rendir al máximo
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={MOTION_VARIANTS.item}
            className="text-balance mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg md:text-xl"
          >
            Comida fitness preparada por nutricionistas, entregada en tu puerta.
            Sin cocinar, sin pensar, sin excusas. Alcanzá tus metas con el
            mejor combustible.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={MOTION_VARIANTS.item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="xl" className="w-full rounded-xl px-10 text-base font-semibold shadow-lg sm:w-auto">
              <Link to={ROUTES.REGISTER}>
                Comenzá hoy
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="w-full rounded-xl border-2 border-neutral-300 px-10 text-base font-semibold sm:w-auto"
            >
              <Link to={ROUTES.MEALS}>Ver menú</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={MOTION_VARIANTS.item}
            className="mt-16 grid grid-cols-2 gap-6 border-t border-neutral-200/60 pt-10 sm:grid-cols-3"
          >
            {[
              {
                value: 500,
                suffix: '+',
                label: 'Clientes activos',
              },
              {
                value: 15000,
                suffix: '+',
                label: 'Comidas entregadas',
                formatter: (v: number) => v.toLocaleString('es-AR'),
              },
              {
                value: 4.9,
                decimals: 1,
                label: 'Calificación promedio',
              },
            ].map(
              (stat: {
                value: number;
                suffix?: string;
                decimals?: number;
                label: string;
                formatter?: (v: number) => string;
              }) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-extrabold text-primary-600 sm:text-3xl">
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      formatter={stat.formatter}
                      threshold={0}
                    />
                  </div>
                  <div className="mt-1 text-xs font-medium text-neutral-500 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ),
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
