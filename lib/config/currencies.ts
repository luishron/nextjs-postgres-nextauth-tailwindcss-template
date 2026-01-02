/**
 * Configuración de monedas soportadas para el sistema
 *
 * Soporta 20 monedas de países hispanohablantes y Brasil
 */

export const SUPPORTED_CURRENCIES = {
  USD: {
    code: 'USD',
    name: 'Dólar estadounidense',
    symbol: '$',
    locale: 'en-US',
    countries: ['Estados Unidos', 'Ecuador', 'El Salvador', 'Panamá']
  },
  MXN: {
    code: 'MXN',
    name: 'Peso mexicano',
    symbol: '$',
    locale: 'es-MX',
    countries: ['México']
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    locale: 'es-ES',
    countries: ['España']
  },
  COP: {
    code: 'COP',
    name: 'Peso colombiano',
    symbol: '$',
    locale: 'es-CO',
    countries: ['Colombia']
  },
  ARS: {
    code: 'ARS',
    name: 'Peso argentino',
    symbol: '$',
    locale: 'es-AR',
    countries: ['Argentina']
  },
  CLP: {
    code: 'CLP',
    name: 'Peso chileno',
    symbol: '$',
    locale: 'es-CL',
    countries: ['Chile']
  },
  PEN: {
    code: 'PEN',
    name: 'Sol peruano',
    symbol: 'S/',
    locale: 'es-PE',
    countries: ['Perú']
  },
  GTQ: {
    code: 'GTQ',
    name: 'Quetzal guatemalteco',
    symbol: 'Q',
    locale: 'es-GT',
    countries: ['Guatemala']
  },
  HNL: {
    code: 'HNL',
    name: 'Lempira hondureño',
    symbol: 'L',
    locale: 'es-HN',
    countries: ['Honduras']
  },
  NIO: {
    code: 'NIO',
    name: 'Córdoba nicaragüense',
    symbol: 'C$',
    locale: 'es-NI',
    countries: ['Nicaragua']
  },
  CRC: {
    code: 'CRC',
    name: 'Colón costarricense',
    symbol: '₡',
    locale: 'es-CR',
    countries: ['Costa Rica']
  },
  PAB: {
    code: 'PAB',
    name: 'Balboa panameño',
    symbol: 'B/.',
    locale: 'es-PA',
    countries: ['Panamá']
  },
  DOP: {
    code: 'DOP',
    name: 'Peso dominicano',
    symbol: 'RD$',
    locale: 'es-DO',
    countries: ['República Dominicana']
  },
  CUP: {
    code: 'CUP',
    name: 'Peso cubano',
    symbol: '$',
    locale: 'es-CU',
    countries: ['Cuba']
  },
  BOB: {
    code: 'BOB',
    name: 'Boliviano',
    symbol: 'Bs.',
    locale: 'es-BO',
    countries: ['Bolivia']
  },
  PYG: {
    code: 'PYG',
    name: 'Guaraní paraguayo',
    symbol: '₲',
    locale: 'es-PY',
    countries: ['Paraguay']
  },
  UYU: {
    code: 'UYU',
    name: 'Peso uruguayo',
    symbol: '$U',
    locale: 'es-UY',
    countries: ['Uruguay']
  },
  VES: {
    code: 'VES',
    name: 'Bolívar venezolano',
    symbol: 'Bs.',
    locale: 'es-VE',
    countries: ['Venezuela']
  },
  BRL: {
    code: 'BRL',
    name: 'Real brasileño',
    symbol: 'R$',
    locale: 'pt-BR',
    countries: ['Brasil']
  }
} as const;

/**
 * Tipo para códigos de moneda soportados
 */
export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

/**
 * Moneda por defecto del sistema
 */
export const DEFAULT_CURRENCY: CurrencyCode = 'MXN';

/**
 * Obtiene los metadatos de una moneda
 * @param code - Código ISO de la moneda
 * @returns Metadata de la moneda o undefined si no existe
 */
export function getCurrencyMetadata(code: CurrencyCode) {
  return SUPPORTED_CURRENCIES[code];
}

/**
 * Lista de todas las monedas soportadas como array
 * Útil para dropdowns y selectores
 */
export const CURRENCY_LIST = Object.values(SUPPORTED_CURRENCIES);

/**
 * Verifica si un código es una moneda válida
 * @param code - Código a verificar
 * @returns true si es válido
 */
export function isValidCurrency(code: string): code is CurrencyCode {
  return code in SUPPORTED_CURRENCIES;
}

/**
 * Mapa de timezone → moneda para inferencia inteligente
 */
const TIMEZONE_TO_CURRENCY: Record<string, CurrencyCode> = {
  // México
  'America/Mexico_City': 'MXN',
  'America/Cancun': 'MXN',
  'America/Monterrey': 'MXN',
  'America/Tijuana': 'MXN',

  // Estados Unidos
  'America/New_York': 'USD',
  'America/Chicago': 'USD',
  'America/Los_Angeles': 'USD',
  'America/Denver': 'USD',

  // España
  'Europe/Madrid': 'EUR',

  // Colombia
  'America/Bogota': 'COP',

  // Argentina
  'America/Argentina/Buenos_Aires': 'ARS',

  // Chile
  'America/Santiago': 'CLP',

  // Perú
  'America/Lima': 'PEN',

  // Guatemala
  'America/Guatemala': 'GTQ',

  // Honduras
  'America/Tegucigalpa': 'HNL',

  // Nicaragua
  'America/Managua': 'NIO',

  // Costa Rica
  'America/Costa_Rica': 'CRC',

  // Panamá
  'America/Panama': 'PAB',

  // República Dominicana
  'America/Santo_Domingo': 'DOP',

  // Cuba
  'America/Havana': 'CUP',

  // Bolivia
  'America/La_Paz': 'BOB',

  // Paraguay
  'America/Asuncion': 'PYG',

  // Uruguay
  'America/Montevideo': 'UYU',

  // Venezuela
  'America/Caracas': 'VES',

  // Brasil
  'America/Sao_Paulo': 'BRL',
  'America/Rio_Branco': 'BRL',
  'America/Manaus': 'BRL',
};

/**
 * Infiere la moneda basándose en el timezone del usuario
 *
 * Estrategia: timezone → locale → moneda
 *
 * @param timezone - Timezone del usuario (ej: 'America/Mexico_City')
 * @returns Código de moneda inferido o DEFAULT_CURRENCY si no se puede inferir
 *
 * @example
 * ```ts
 * inferCurrencyFromTimezone('America/Mexico_City') // 'MXN'
 * inferCurrencyFromTimezone('America/New_York')    // 'USD'
 * inferCurrencyFromTimezone('Europe/Madrid')       // 'EUR'
 * inferCurrencyFromTimezone('Unknown')             // 'MXN' (default)
 * ```
 */
export function inferCurrencyFromTimezone(timezone: string | null | undefined): CurrencyCode {
  if (!timezone) return DEFAULT_CURRENCY;

  // Búsqueda directa en el mapa
  const inferred = TIMEZONE_TO_CURRENCY[timezone];
  if (inferred) return inferred;

  // Fallback: intentar inferir por región (ej: 'America/Something' → USD)
  if (timezone.startsWith('America/')) {
    // Si es América pero no está en el mapa, default USD
    return 'USD';
  }
  if (timezone.startsWith('Europe/')) {
    return 'EUR';
  }

  // Fallback final
  return DEFAULT_CURRENCY;
}
