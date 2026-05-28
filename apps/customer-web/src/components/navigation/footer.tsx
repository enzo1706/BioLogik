import { Link } from 'react-router-dom';
import { APP_NAME } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-lg font-bold text-white">{APP_NAME}</span>
            <p className="mt-2 text-sm text-neutral-400">
              Energía real para rendir al máximo.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-sm hover:text-white">
                  Menú
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm hover:text-white">
                  Pedidos
                </Link>
              </li>
              <li>
                <Link to="/progress" className="text-sm hover:text-white">
                  Progreso
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-neutral-500">
                  Términos y condiciones
                </span>
              </li>
              <li>
                <span className="text-sm text-neutral-500">
                  Política de privacidad
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
          &copy; {currentYear} {APP_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
