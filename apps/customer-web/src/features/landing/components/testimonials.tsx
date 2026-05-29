import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntersection } from '../hooks/use-intersection';
import { useIsMobile } from '@/hooks';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Lucía Martínez',
    role: 'CrossFit Athlete',
    avatar: 'LM',
    quote:
      'Desde que empecé con BioLogik dejé de preocuparme por lo que como. Mis macros están siempre en punto y mi rendimiento en el box mejoró notablemente.',
    rating: 5,
  },
  {
    name: 'Martín Costa',
    role: 'Runner / Maratonista',
    avatar: 'MC',
    quote:
      'Entreno para maratones y la alimentación es clave. BioLogik me sacó el estrés de cocinar y me dio la nutrición que necesito para rendir.',
    rating: 5,
  },
  {
    name: 'Carolina Ruiz',
    role: 'Yoga & Pilates',
    avatar: 'CR',
    quote:
      'Pensé que la comida fitness era aburrida. Me sorprendió lo rico que es todo. Además, ver mi progreso en la app me mantiene motivada.',
    rating: 5,
  },
  {
    name: 'Andrés Pellegrini',
    role: 'Entrenador personal',
    avatar: 'AP',
    quote:
      'Recomiendo BioLogik a todos mis alumnos. La calidad de los ingredientes y el acompañamiento nutricional es de primer nivel.',
    rating: 4,
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [ref] = useIntersection<HTMLElement>({ threshold: 0.1 });
  const isMobile = useIsMobile();

  const itemsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(TESTIMONIALS.length / itemsPerPage);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goNext = () => goTo((current + 1) % totalPages);
  const goPrev = () => goTo((current - 1 + totalPages) % totalPages);

  const visibleTestimonials = TESTIMONIALS.slice(
    current * itemsPerPage,
    current * itemsPerPage + itemsPerPage,
  );

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-white to-background py-20 sm:py-28"
    >
      <div className="container-page">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
            Testimonios
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Historias reales de personas que transformaron su alimentación.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid gap-6 md:grid-cols-2"
              >
                {visibleTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8"
                  >
                    {/* Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={`${testimonial.name}-star-${i}`}
                          className={cn(
                            'h-4 w-4',
                            i < testimonial.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-neutral-200 text-neutral-200',
                          )}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-50 hover:text-neutral-800"
              aria-label="Anterior testimonio"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={`dot-${i}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all duration-300',
                    i === current
                      ? 'w-6 bg-primary-500'
                      : 'bg-neutral-300 hover:bg-neutral-400',
                  )}
                  aria-label={`Ir al testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-50 hover:text-neutral-800"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
