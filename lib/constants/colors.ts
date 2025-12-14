/**
 * Paleta de colores centralizada para categorías y métodos de pago
 */

export interface ColorOption {
  name: string;
  value: string;
}

export const COLORS: ColorOption[] = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Amarillo', value: '#F59E0B' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Gris', value: '#6B7280' }
];

/**
 * Obtiene un color por su valor de clase CSS
 */
export function getColorByValue(value: string): ColorOption | undefined {
  return COLORS.find((color) => color.value === value);
}

/**
 * Obtiene un color por su nombre
 */
export function getColorByName(name: string): ColorOption | undefined {
  return COLORS.find((color) => color.name === name);
}
