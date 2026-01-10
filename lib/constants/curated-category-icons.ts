/**
 * Curated Category Icons - Lucide-react Icons for Categories
 *
 * Lista curada de ~50 iconos de lucide-react organizados por categoría
 * para usar en expense/income categories.
 *
 * NO USAR EMOJIS - Solo nombres de iconos de lucide-react
 */

export interface CuratedIcon {
  name: string;
  label: string;
  keywords: string;
}

export const CURATED_CATEGORY_ICONS = {
  comida: [
    { name: 'Utensils', label: 'Comida', keywords: 'hamburguesa pizza restaurante comida' },
    { name: 'Coffee', label: 'Café', keywords: 'cafe bebida desayuno' },
    { name: 'Pizza', label: 'Pizza', keywords: 'comida rapida italiana' },
    { name: 'UtensilsCrossed', label: 'Restaurante', keywords: 'cena formal restaurant' },
    { name: 'IceCream', label: 'Postre', keywords: 'helado dulce dessert' },
    { name: 'Beer', label: 'Bar', keywords: 'cerveza bebidas alcohol' },
    { name: 'Wine', label: 'Vino', keywords: 'bebida alcohol copa' },
    { name: 'CupSoda', label: 'Refresco', keywords: 'bebida soda jugo' },
  ],
  transporte: [
    { name: 'Car', label: 'Auto', keywords: 'carro vehiculo automovil' },
    { name: 'Bike', label: 'Bicicleta', keywords: 'ciclismo bici' },
    { name: 'Bus', label: 'Autobús', keywords: 'transporte publico camion' },
    { name: 'Plane', label: 'Avión', keywords: 'vuelo viaje aeropuerto' },
    { name: 'Train', label: 'Tren', keywords: 'transporte metro' },
    { name: 'Fuel', label: 'Gasolina', keywords: 'combustible gas' },
    { name: 'ParkingSquare', label: 'Estacionamiento', keywords: 'parking cochera' },
    { name: 'Taxi', label: 'Taxi', keywords: 'uber transporte' },
  ],
  hogar: [
    { name: 'Home', label: 'Hogar', keywords: 'casa vivienda renta' },
    { name: 'Building2', label: 'Edificio', keywords: 'renta apartamento depto' },
    { name: 'Lightbulb', label: 'Luz', keywords: 'electricidad servicios energia' },
    { name: 'Wifi', label: 'Internet', keywords: 'wifi servicios red' },
    { name: 'Zap', label: 'Electricidad', keywords: 'luz energia' },
    { name: 'Droplets', label: 'Agua', keywords: 'servicios agua' },
    { name: 'Wrench', label: 'Reparación', keywords: 'herramienta mantenimiento arreglo' },
    { name: 'Sofa', label: 'Muebles', keywords: 'sofa muebles decoracion' },
  ],
  compras: [
    { name: 'ShoppingBag', label: 'Compras', keywords: 'shopping bolsa tienda' },
    { name: 'ShoppingCart', label: 'Supermercado', keywords: 'mercado abarrotes despensa' },
    { name: 'Shirt', label: 'Ropa', keywords: 'vestimenta fashion clothes' },
    { name: 'Laptop', label: 'Electrónicos', keywords: 'tecnologia computadora tech' },
    { name: 'Smartphone', label: 'Teléfono', keywords: 'celular gadgets movil' },
    { name: 'Watch', label: 'Reloj', keywords: 'accesorios time' },
    { name: 'Gem', label: 'Joyería', keywords: 'joyas diamante accesorios' },
  ],
  entretenimiento: [
    { name: 'Film', label: 'Cine', keywords: 'peliculas entretenimiento movie' },
    { name: 'Tv', label: 'Streaming', keywords: 'television netflix series' },
    { name: 'Gamepad2', label: 'Videojuegos', keywords: 'gaming consola juegos' },
    { name: 'Music', label: 'Música', keywords: 'conciertos spotify audio' },
    { name: 'Headphones', label: 'Audífonos', keywords: 'audio musica auriculares' },
    { name: 'PartyPopper', label: 'Fiesta', keywords: 'evento celebracion party' },
    { name: 'Camera', label: 'Fotografía', keywords: 'foto camara hobby' },
  ],
  salud: [
    { name: 'Heart', label: 'Salud', keywords: 'bienestar health corazon' },
    { name: 'Stethoscope', label: 'Médico', keywords: 'doctor consulta clinica' },
    { name: 'Pill', label: 'Medicina', keywords: 'farmacia pastillas medicamentos' },
    { name: 'Hospital', label: 'Hospital', keywords: 'clinica emergencia salud' },
    { name: 'Dumbbell', label: 'Gimnasio', keywords: 'ejercicio fitness pesas gym' },
    { name: 'Activity', label: 'Ejercicio', keywords: 'deporte fitness running' },
    { name: 'Sparkles', label: 'Belleza', keywords: 'spa salon estetica' },
  ],
  finanzas: [
    { name: 'DollarSign', label: 'Dinero', keywords: 'efectivo finanzas money' },
    { name: 'CreditCard', label: 'Tarjeta', keywords: 'credito debito banco' },
    { name: 'Wallet', label: 'Cartera', keywords: 'billetera dinero efectivo' },
    { name: 'Landmark', label: 'Banco', keywords: 'financiero bank' },
    { name: 'TrendingUp', label: 'Inversión', keywords: 'acciones bolsa investment' },
    { name: 'PiggyBank', label: 'Ahorro', keywords: 'guardar dinero save' },
    { name: 'Receipt', label: 'Recibos', keywords: 'factura comprobante' },
  ],
  educacion: [
    { name: 'GraduationCap', label: 'Educación', keywords: 'escuela universidad estudiante' },
    { name: 'BookOpen', label: 'Libros', keywords: 'lectura estudio literatura' },
    { name: 'Pencil', label: 'Material', keywords: 'utiles escolares papeleria' },
    { name: 'School', label: 'Escuela', keywords: 'colegio educacion' },
    { name: 'Library', label: 'Biblioteca', keywords: 'libros estudio' },
  ],
  otros: [
    { name: 'Gift', label: 'Regalos', keywords: 'obsequio presente regalo' },
    { name: 'PawPrint', label: 'Mascotas', keywords: 'perro gato animales pets' },
    { name: 'Briefcase', label: 'Trabajo', keywords: 'oficina profesional job' },
    { name: 'Package', label: 'Paquetes', keywords: 'envio caja delivery' },
    { name: 'MoreHorizontal', label: 'Otros', keywords: 'varios miscelaneos' },
    { name: 'Cigarette', label: 'Vicios', keywords: 'tabaco cigarro' },
    { name: 'Baby', label: 'Bebé', keywords: 'nino pañales infantil' },
  ],
} as const;

/**
 * Obtener lista plana de todos los iconos curados
 */
export function getAllCuratedIcons(): CuratedIcon[] {
  return Object.values(CURATED_CATEGORY_ICONS).flat();
}

/**
 * Buscar iconos por query (nombre o keywords)
 */
export function searchIcons(query: string): CuratedIcon[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return getAllCuratedIcons();
  }

  return getAllCuratedIcons().filter((icon) =>
    icon.label.toLowerCase().includes(lowerQuery) ||
    icon.keywords.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Obtener categorías disponibles para el picker
 */
export function getCategoryTabs() {
  return Object.keys(CURATED_CATEGORY_ICONS);
}
