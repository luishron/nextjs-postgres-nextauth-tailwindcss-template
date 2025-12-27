"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: "rvw_101",
    name: "Lucía",
    city: "Buenos Aires",
    insight: "decidir sin fricción",
    review:
      "Probé Excel, probé apps, probé Notion. Todo servía, pero nada me ayudaba a decidir rápido. Homelas es la primera que abro cuando quiero saber si puedo gastar.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia",
  },
  {
    id: "rvw_102",
    name: "Martín",
    city: "Córdoba",
    insight: "previsión",
    review:
      "El problema nunca fue registrar gastos. Era no ver los pagos que venían. Cuando empecé a ver eso, dejé de equivocarme a fin de mes.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martin",
  },
  {
    id: "rvw_103",
    name: "Sofía",
    city: "CDMX",
    insight: "menos fricción que Notion",
    review:
      "Notion es increíble, pero para esto me cansé de armar sistemas. Homelas ya viene armado y por eso lo uso todos los días.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
  },
  {
    id: "rvw_104",
    name: "Pablo",
    city: "Rosario",
    insight: "balance real",
    review:
      "Con otras herramientas veía números. Con Homelas veo si me alcanza. Parece parecido, pero no lo es.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo",
  },
  {
    id: "rvw_105",
    name: "Carla",
    city: "Montevideo",
    insight: "uso diario",
    review:
      "Excel lo uso para cerrar cosas. Homelas lo uso para decidir antes. Esa diferencia es clave.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carla",
  },
  {
    id: "rvw_106",
    name: "Andrés",
    city: "Medellín",
    insight: "claridad sin disciplina",
    review:
      "Nunca fui constante registrando todo. Igual Homelas me da una idea clara de mi balance y eso me alcanza para decidir mejor.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andres",
  },
  {
    id: "rvw_107",
    name: "Diego",
    city: "Santiago",
    insight: "La suscripción se paga sola",
    review:
      "El primer mes identifiqué gastos que ni recordaba. Ya pagué varios meses del Pro solo con eso. Y sigo encontrando más.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego",
  },
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
  };

  // Get visible reviews (1 on mobile, 2 on tablet, 3 on desktop)
  const getVisibleReviews = () => {
    const visibleCount = 3; // Show 3 cards on desktop
    const reviews_to_show = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % reviews.length;
      reviews_to_show.push(reviews[index]);
    }
    return reviews_to_show;
  };

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lo que dicen{" "}
            <span className="text-primary">quienes ya lo usan</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Personas reales que decidieron mejor después de empezar a usar
            Homelas.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            onClick={prevReview}
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-background shadow-lg hidden md:flex"
            aria-label="Review anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            onClick={nextReview}
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-background shadow-lg hidden md:flex"
            aria-label="Review siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Reviews Carousel */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {getVisibleReviews().map((review) => (
                <div
                  key={review.id}
                  className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all relative"
                >
                  {/* Quote Icon */}
                  <Quote
                    className="absolute top-6 right-6 w-8 h-8 text-primary/20"
                    aria-hidden="true"
                  />

                  {/* User Info with Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-16 h-16 rounded-full border-2 border-primary/20"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {review.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {review.city}
                      </p>
                    </div>
                  </div>

                  {/* Insight Badge */}
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 mb-4"
                  >
                    {review.insight}
                  </Badge>

                  {/* Review Text */}
                  <p className="text-base text-foreground leading-relaxed italic">
                    "{review.review}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Ir a review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
