import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  ctaLink: string;
  badge?: string;
  highlighted?: boolean;
  popular?: boolean;
  yearlyPrice?: string;
  trialText?: string;
}

export function PricingCard({
  name,
  price,
  period = "/mes",
  description,
  features,
  cta,
  ctaLink,
  badge,
  highlighted = false,
  popular = false,
  yearlyPrice,
  trialText,
}: PricingCardProps) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 h-full flex flex-col ${
        highlighted
          ? "border-2 border-primary shadow-xl hover:shadow-2xl scale-105 lg:scale-110"
          : "border-border hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {/* Badge popular */}
      {popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
          {badge || "Popular"}
        </div>
      )}

      <CardHeader className="text-center pb-8">
        {/* Nombre del plan */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          {badge && !popular && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>

        {/* Precio */}
        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold tracking-tight text-foreground">
              {price}
            </span>
            {period && (
              <span className="text-lg text-muted-foreground">{period}</span>
            )}
          </div>

          {/* Precio anual */}
          {yearlyPrice && (
            <p className="text-sm text-muted-foreground mt-2">
              o {yearlyPrice} anual (17% descuento)
            </p>
          )}

          {/* Trial text */}
          {trialText && (
            <p className="text-sm text-primary font-medium mt-2">
              {trialText}
            </p>
          )}
        </div>

        {/* Descripción */}
        <CardDescription className="text-base mt-4">
          {description}
        </CardDescription>
      </CardHeader>

      {/* Features */}
      <CardContent className="pt-6 flex-1 border-t border-border">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {feature.included ? (
                  <Check
                    className={`w-5 h-5 ${
                      feature.highlight ? "text-primary" : "text-success"
                    }`}
                    aria-hidden="true"
                  />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/40" aria-hidden="true" />
                )}
              </div>
              <span
                className={`text-sm ${
                  feature.included
                    ? feature.highlight
                      ? "text-foreground font-medium"
                      : "text-foreground"
                    : "text-muted-foreground line-through"
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* CTA */}
      <CardFooter className="pt-6">
        <Button
          asChild
          size="lg"
          variant={highlighted ? "default" : "outline"}
          className="w-full h-12 text-base font-semibold"
        >
          <Link href={ctaLink}>{cta}</Link>
        </Button>
      </CardFooter>

      {/* Decoración de fondo */}
      {highlighted && (
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          aria-hidden="true"
        />
      )}
    </Card>
  );
}
