import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME } from '@/lib/constants';

const FOOTER_LINKS = {
  Producto: [
    { label: 'Menú semanal', href: ROUTES.MEALS },
    { label: 'Planes', href: ROUTES.SUBSCRIPTION },
    { label: 'Cómo funciona', href: '#how-it-works' },
  ],
  Compañía: [
    { label: 'Sobre BioLogik', href: '#' },
    { label: 'Nutricionistas', href: ROUTES.NUTRITIONIST },
    { label: 'Trabajá con nosotros', href: '#' },
  ],
  Legal: [
    { label: 'Términos y condiciones', href: '#' },
    { label: 'Política de privacidad', href: '#' },
    { label: 'Defensa del consumidor', href: '#' },
  ],
} as const;

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-neutral-800 bg-neutral-950">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="container-page py-14 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <span className="text-xl font-extrabold tracking-tight text-primary-400">
              {APP_NAME}
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-400">
              Energía real para rendir al máximo. Comida fitness diseñada por
              nutricionistas, preparada por chefs, entregada en tu puerta.
            </p>

            {/* Newsletter placeholder */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Mantenete al día
              </p>
              <div className="mt-2 flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 placeholder-neutral-600 outline-none transition-colors focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30"
                  aria-label="Email para newsletter"
                />
                <button
                  type="button"
                  className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Suscribir
                </button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-800/60 pt-8 text-center sm:flex-row">
          <p className="text-xs text-neutral-600">
            &copy; {currentYear} {APP_NAME}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-neutral-600 transition-colors hover:text-neutral-400"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-xs text-neutral-600 transition-colors hover:text-neutral-400"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-xs text-neutral-600 transition-colors hover:text-neutral-400"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-xs text-neutral-600 transition-colors hover:text-neutral-400"
              aria-label="TikTok"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
