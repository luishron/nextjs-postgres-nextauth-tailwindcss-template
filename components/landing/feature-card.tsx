import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "hsl(var(--primary))",
}: FeatureCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border bg-card h-full">
      <CardHeader>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
          style={{
            backgroundColor: `${iconColor}15`,
          }}
        >
          <Icon
            className="w-6 h-6"
            style={{ color: iconColor }}
            aria-hidden="true"
          />
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>

      {/* Decoración de fondo */}
      <div
        className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-10"
        style={{ backgroundColor: iconColor }}
        aria-hidden="true"
      />
    </Card>
  );
}
