import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  /** Valor final al que animar */
  end: number;
  /** Texto después del número (ej. '+') */
  suffix?: string;
  /** Texto antes del número (ej. '$') */
  prefix?: string;
  /** Cantidad de decimales (0 para enteros, 1 para 4.9, etc.) */
  decimals?: number;
  /** Duración de la animación en ms */
  duration?: number;
  /** Umbral de visibilidad para disparar la animación */
  threshold?: number;
  /** Formateador personalizado (opcional — override por defecto) */
  formatter?: (value: number) => string;
}

/**
 * AnimatedCounter — anima un número desde 0 hasta `end` cuando
 * entra en el viewport. Usa requestAnimationFrame con easing
 * cubic-bezier para una experiencia premium.
 *
 * @example
 * <AnimatedCounter end={500} suffix="+" />
 * <AnimatedCounter end={4.9} decimals={1} />
 * <AnimatedCounter end={15000} suffix="+" formatter={(v) => v.toLocaleString('es-AR')} />
 */
export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2000,
  threshold = 0.3,
  formatter,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTime: number | null = null;
          let animationFrame: number;

          const easeOutCubic = (t: number): number => {
            return 1 - Math.pow(1 - t, 3);
          };

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);

            setDisplayValue(easedProgress * end);

            if (progress < 1) {
              animationFrame = requestAnimationFrame(animate);
            }
          };

          animationFrame = requestAnimationFrame(animate);

          return () => {
            cancelAnimationFrame(animationFrame);
          };
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [end, duration, threshold, hasAnimated]);

  const formatValue = (value: number): string => {
    if (formatter) return formatter(value);
    return value.toFixed(decimals);
  };

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatValue(displayValue)}
      {suffix}
    </span>
  );
}
