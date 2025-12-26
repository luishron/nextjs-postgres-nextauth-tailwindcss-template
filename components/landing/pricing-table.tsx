import { PricingCard } from "./pricing-card";

const freePlan = {
  name: "Free",
  price: "$0",
  period: " USD/mes",
  description: "Perfecto para empezar a controlar tus finanzas personales",
  features: [
    { text: "Gastos e ingresos ilimitados", included: true },
    { text: "Hasta 10 categorías personalizables", included: true },
    { text: "3 métodos de pago", included: true },
    { text: "Dashboard con KPIs principales", included: true },
    { text: "Gastos recurrentes virtuales", included: true },
    { text: "Exportación CSV básica (1 vez/mes)", included: true },
    { text: "Acceso desde 1 dispositivo", included: true },
    { text: "Categorías ilimitadas", included: false },
    { text: "Métodos de pago ilimitados", included: false },
    { text: "Presupuestos por categoría", included: false },
    { text: "Gráficos de tendencias", included: false },
    { text: "Exportación CSV/PDF ilimitada", included: false },
    { text: "Adjuntar recibos", included: false },
    { text: "Recordatorios automáticos", included: false },
    { text: "Multi-dispositivo sync", included: false },
    { text: "Soporte prioritario", included: false },
  ],
  cta: "Comenzar gratis",
  ctaLink: "/login",
  badge: "Popular",
  popular: true,
};

const premiumPlan = {
  name: "Premium",
  price: "$9.99",
  period: " USD/mes",
  description: "Para usuarios que quieren el control total de sus finanzas",
  features: [
    { text: "Todo de Free +", included: true, highlight: true },
    { text: "Categorías ilimitadas", included: true },
    { text: "Métodos de pago ilimitados", included: true },
    { text: "Presupuestos por categoría (con alertas)", included: true },
    { text: "Gráficos de tendencias (6 meses histórico)", included: true },
    { text: "Exportación CSV/PDF ilimitada", included: true },
    { text: "Adjuntar recibos (hasta 100 MB/mes)", included: true },
    { text: "Recordatorios automáticos por email", included: true },
    { text: "Multi-dispositivo (sync en tiempo real)", included: true },
    { text: "Soporte prioritario", included: true },
    { text: "Acceso anticipado a nuevas features", included: true },
  ],
  cta: "Probar Premium 14 días gratis",
  ctaLink: "/login",
  badge: "Más completo",
  highlighted: true,
  yearlyPrice: "$99 USD",
  trialText: "14 días gratis, sin tarjeta de crédito",
};

export function PricingTable() {
  return (
    <section
      id="pricing"
      className="py-20 bg-muted/40"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Elige el plan que se ajuste a{" "}
            <span className="text-primary">tus necesidades</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Comienza gratis para siempre. Actualiza cuando necesites más
            funcionalidades.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <PricingCard {...freePlan} />
          </div>

          {/* Premium Plan */}
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <PricingCard {...premiumPlan} />
          </div>
        </div>

        {/* FAQ o nota adicional */}
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-muted-foreground">
            ¿Tienes preguntas sobre los planes?{" "}
            <a
              href="mailto:soporte@homelas.com"
              className="text-primary hover:underline font-medium"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
