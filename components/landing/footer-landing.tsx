import Link from "next/link";
import { Logo } from "./logo";

export function FooterLanding() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-card/50"
      aria-label="Footer del sitio"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Producto */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Producto</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/PRD.md"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/IMPLEMENTATION_STATUS.md"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 2: Recursos */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs/INDEX.md"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Documentación
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/COMPONENT_GUIDE.md"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Guías
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/PRD.md"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  PRD
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                  aria-disabled="true"
                >
                  Blog <span className="text-xs ml-1">(próximamente)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/LICENSE.md"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Licencia MIT
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/luishron/gastos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  GitHub
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Twitter/X
                </a>
              </li>
              <li>
                <a
                  href="mailto:soporte@homelas.com"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="my-8 border-t border-border" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo className="opacity-70" />

          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Homelas. Gestión financiera personal.
          </p>

          <p className="text-sm text-muted-foreground">
            Hecho con{" "}
            <span className="text-red-500" aria-label="amor">
              ❤️
            </span>{" "}
            y{" "}
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Claude Code
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
