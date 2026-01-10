'use client';

import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  icon: string | null | undefined;
  className?: string;
  size?: number;
  color?: string;
  fallback?: keyof typeof LucideIcons;
}

/**
 * CategoryIcon - Renderiza iconos de categoría con soporte dual
 *
 * Detecta automáticamente:
 * - Nombres de iconos lucide-react (ej: "Utensils", "Car")
 * - Emojis legacy (ej: "🍔", "🚗")
 *
 * Características:
 * - Backward compatible con emojis existentes
 * - Fallback a icon por defecto si icon es null/undefined
 * - Soporte para colores personalizados
 * - ARIA hidden (icons decorativos)
 *
 * @example
 * <CategoryIcon icon="Utensils" color="#FF0000" size={24} />
 * <CategoryIcon icon="🍔" /> // Legacy emoji support
 * <CategoryIcon icon={null} fallback="Package" />
 */
export function CategoryIcon({
  icon,
  className,
  size = 20,
  color,
  fallback = 'Package',
}: CategoryIconProps) {
  /**
   * Renderizar icono de lucide-react por nombre
   */
  const renderLucideIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];

    if (IconComponent) {
      return (
        <IconComponent
          className={cn('shrink-0', className)}
          size={size}
          style={{ color }}
          aria-hidden="true"
        />
      );
    }

    return null;
  };

  // Si no hay icon, usar fallback
  if (!icon) {
    return renderLucideIcon(fallback);
  }

  // Intentar renderizar como lucide-react icon
  const lucideIcon = renderLucideIcon(icon);
  if (lucideIcon) return lucideIcon;

  // Fallback: renderizar como emoji (legacy support)
  // Si el string no es un icon de lucide-react válido, asumimos que es emoji
  return (
    <span
      className={cn('text-xl leading-none', className)}
      style={{ color }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}
