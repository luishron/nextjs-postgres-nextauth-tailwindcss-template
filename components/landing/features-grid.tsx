import { BarChart3, RefreshCw, Zap, Sparkles, Eye, TrendingUp } from "lucide-react";
import { FeatureCard } from "./feature-card";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description:
      "Visualiza tus finanzas en tiempo real. KPIs principales, comparativas mensuales y proyecciones automáticas. Responde '¿puedo gastar?' en menos de 5 segundos.",
    iconColor: "hsl(220 89% 61%)", // Azul
  },
  {
    icon: RefreshCw,
    title: "Gastos Recurrentes Virtuales",
    description:
      "Registra Netflix una vez, generamos automáticamente las próximas instancias. Sin saturar tu base de datos. Proyecta tus próximos meses con precisión.",
    iconColor: "hsl(142 76% 55%)", // Verde
  },
  {
    icon: Zap,
    title: "Quick Add (< 3 segundos)",
    description:
      "Agregar gasto en menos de 3 taps. FAB siempre visible con formulario simplificado. La fricción es el enemigo del tracking financiero.",
    iconColor: "hsl(45 93% 47%)", // Amarillo/Dorado
  },
  {
    icon: Sparkles,
    title: "UX Estilo Wise",
    description:
      "Cards en lugar de tablas abrumadoras, agrupación temporal inteligente, búsqueda Cmd+K instantánea. Diseñado para claridad máxima.",
    iconColor: "hsl(280 83% 63%)", // Morado
  },
  {
    icon: Eye,
    title: "Accesibilidad WCAG 2.1 AA",
    description:
      "Touch targets ≥44px, contraste ≥4.5:1, navegación por teclado completa. Finanzas para todos, sin excepciones.",
    iconColor: "hsl(199 89% 48%)", // Cyan
  },
  {
    icon: TrendingUp,
    title: "Sistema Completo de Ingresos",
    description:
      "Categorías separadas, ingresos recurrentes, proyecciones precisas. Entiende tu situación financiera completa, no solo tus gastos.",
    iconColor: "hsl(98 100% 70%)", // Verde Vibrante (primary)
  },
];

export function FeaturesGrid() {
  return (
    <section
      id="features"
      className="py-20 bg-muted/40"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Todo lo que necesitas para{" "}
            <span className="text-primary">controlar tus finanzas</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Herramientas poderosas diseñadas para simplificar tu vida financiera
          </p>
        </div>

        {/* Grid de Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
