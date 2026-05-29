import { motion } from 'framer-motion';
import { ClipboardList, ChefHat, TrendingUp } from 'lucide-react';
import { useIntersection } from '../hooks/use-intersection';

const STEPS = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Elegí tu plan',
    description:
      'Seleccioná tus comidas y objetivos con ayuda de nutricionistas. Personalizamos cada menú según tus metas.',
  },
  {
    number: '02',
    icon: ChefHat,
    title: 'Lo cocinamos por vos',
    description:
      'Chefs profesionales preparan todo fresco con ingredientes seleccionados. Sin conservantes ni procesos industriales.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Disfrutá resultados',
    description:
      'Recibí tus comidas listas en la puerta de tu casa. Alcanzá tus metas sin cocinar, sin pensar, sin excusas.',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function HowItWorks() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-background to-white py-20 sm:py-28"
    >
      <div className="container-page">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
            Cómo funciona
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Tres pasos para transformar tu alimentación
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Simplificamos tu nutrición para que solo te preocupes por rendir.
          </p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group relative rounded-2xl border border-neutral-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-4xl font-black text-primary-200/50 select-none">
                {step.number}
              </span>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-100">
                <step.icon className="h-7 w-7" />
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full z-10 h-px w-[calc(100%-3.5rem)] bg-gradient-to-r from-primary-300 to-transparent" />
              )}

              {/* Content */}
              <h3 className="mt-6 text-xl font-bold text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
