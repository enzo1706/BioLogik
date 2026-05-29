import { motion } from 'framer-motion';
import {
  Salad,
  Sparkles,
  Clock,
  BarChart3,
  Truck,
  Repeat,
} from 'lucide-react';
import { useIntersection } from '../hooks/use-intersection';

const BENEFITS = [
  {
    icon: Salad,
    title: 'Diseñadas por nutricionistas',
    description:
      'Cada comida está balanceada por profesionales para maximizar tu rendimiento y salud.',
  },
  {
    icon: Sparkles,
    title: 'Ingredientes frescos y naturales',
    description:
      'Seleccionamos los mejores ingredientes de temporada. Sin procesados, sin conservantes.',
  },
  {
    icon: Clock,
    title: 'Ahorrá tiempo valioso',
    description:
      'Olvidate de cocinar, hacer compras y limpiar. Invertí ese tiempo en entrenar o descansar.',
  },
  {
    icon: BarChart3,
    title: 'Seguí tu progreso',
    description:
      'App con métricas reales: macros, calorías, evolución. Datos claros para decisiones inteligentes.',
  },
  {
    icon: Truck,
    title: 'Entrega gratis sin estrés',
    description:
      'Recibí tus comidas en la puerta de tu casa. Programá entregas según tu rutina semanal.',
  },
  {
    icon: Repeat,
    title: 'Flexibilidad total',
    description:
      'Pausá, cancelá o cambiá tu plan cuando quieras. Sin compromisos ni letra chica.',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function BenefitsSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.05 });

  return (
    <section
      id="benefits"
      ref={ref}
      className="relative overflow-hidden bg-white py-20 sm:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary-100/20 blur-3xl" />

      <div className="container-page relative z-10">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
            Beneficios
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Todo lo que necesitás, nada que no
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Pensamos en cada detalle para que solo te enfoques en tus objetivos.
          </p>
        </div>

        {/* Benefits grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFITS.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              className="group rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-100">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-neutral-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
