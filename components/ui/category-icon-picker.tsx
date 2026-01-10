'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import {
  CURATED_CATEGORY_ICONS,
  searchIcons,
} from '@/lib/constants/curated-category-icons';
import { CategoryIcon } from '@/components/ui/category-icon';
import { cn } from '@/lib/utils';

interface CategoryIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  color?: string;
}

/**
 * CategoryIconPicker - Selector de iconos para categorías
 *
 * Características:
 * - ~50 iconos curados de lucide-react
 * - Búsqueda por nombre y keywords
 * - Pestañas organizadas por categoría
 * - Grid responsive (6 cols mobile, 8 desktop)
 * - Touch targets ≥ 44px (WCAG 2.1 AA)
 * - Preview con color de categoría
 * - ARIA labels para accesibilidad
 *
 * @example
 * <CategoryIconPicker
 *   value={selectedIcon}
 *   onChange={setSelectedIcon}
 *   color="#FF0000"
 * />
 */
export function CategoryIconPicker({
  value,
  onChange,
  color,
}: CategoryIconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] =
    useState<keyof typeof CURATED_CATEGORY_ICONS>('comida');

  // Filtrar iconos según búsqueda o tab activo
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return CURATED_CATEGORY_ICONS[activeTab];
    }
    return searchIcons(searchQuery);
  }, [searchQuery, activeTab]);

  return (
    <div className="grid gap-3">
      <Label>Icono</Label>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar icono... (ej: comida, auto)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Pestañas - solo si no hay búsqueda */}
      {!searchQuery && (
        <div className="flex gap-1 overflow-x-auto pb-2">
          {Object.keys(CURATED_CATEGORY_ICONS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setActiveTab(key as keyof typeof CURATED_CATEGORY_ICONS)
              }
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
                activeTab === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Grid de iconos */}
      <div className="border rounded-md p-2 max-h-[240px] overflow-y-auto">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {filteredIcons.map((icon) => (
            <button
              key={icon.name}
              type="button"
              onClick={() => onChange(icon.name)}
              className={cn(
                'h-12 sm:h-11 rounded-md border-2 transition-all hover:scale-110 flex items-center justify-center',
                'min-h-[44px]', // WCAG touch target
                value === icon.name
                  ? 'border-primary bg-accent scale-110'
                  : 'border-transparent hover:bg-accent/50'
              )}
              title={icon.label}
              aria-label={`Seleccionar icono ${icon.label}`}
            >
              <CategoryIcon icon={icon.name} color={color} size={20} />
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No se encontraron iconos para &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="rounded-lg border p-4">
        <p className="text-sm font-medium mb-2">Vista previa:</p>
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white"
          style={{ backgroundColor: color || '#6B7280' }}
        >
          <CategoryIcon icon={value} color="white" />
          <span>Categoría</span>
        </div>
      </div>
    </div>
  );
}
