"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToScreenshots = () => {
    const screenshotsSection = document.getElementById("screenshots");
    screenshotsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
            >
              Control financiero{" "}
              <span className="text-primary">simple</span> sin complicaciones
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mt-6 max-w-2xl mx-auto lg:mx-0">
              Registra gastos e ingresos, visualiza tu situación financiera en
              tiempo real, y alcanza balance positivo mes a mes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 text-base font-semibold"
                aria-label="Crear cuenta gratuita en Homelas"
              >
                <Link href="/login">Comenzar gratis</Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold"
                onClick={scrollToScreenshots}
                aria-label="Ver demo del producto"
              >
                Ver demo
              </Button>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-muted-foreground mt-6">
              Gratis para siempre · Sin tarjeta de crédito · Trial Premium de
              14 días
            </p>
          </div>

          {/* Screenshot */}
          <div className="relative animate-fade-in-up lg:animate-fade-in-right">
            <div className="relative aspect-video rounded-xl border-2 border-border shadow-2xl overflow-hidden bg-card">
              {/* Placeholder para screenshot */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dashboard Preview
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Screenshot placeholder
                  </p>
                </div>
              </div>

              {/* Cuando tengas el screenshot real, reemplazar con: */}
              {/* <Image
                src="/screenshots/dashboard-light.png"
                alt="Dashboard de Homelas mostrando gastos e ingresos en tiempo real"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              /> */}
            </div>

            {/* Decoración */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full" />
          </div>
        </div>
      </div>

      {/* Pattern de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
