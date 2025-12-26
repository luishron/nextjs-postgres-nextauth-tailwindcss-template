import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
          Empieza a controlar tus{" "}
          <span className="text-primary">finanzas hoy</span>
        </h2>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
          Gratis para siempre. Sin tarjeta de crédito. Cancela cuando quieras.
        </p>

        {/* Benefits */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-sm sm:text-base">Setup en 60 segundos</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-sm sm:text-base">14 días Premium gratis</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-sm sm:text-base">Soporte en español</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <Button
            size="lg"
            asChild
            className="h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Crear cuenta gratuita en Homelas"
          >
            <Link href="/login">Crear cuenta gratis →</Link>
          </Button>
        </div>

        {/* Trust Badge */}
        <p className="text-sm text-muted-foreground mt-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          Únete a cientos de usuarios que ya controlan sus finanzas con Homelas
        </p>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Dots pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
