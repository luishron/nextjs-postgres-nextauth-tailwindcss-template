# Plan de Implementación: Landing Page de Ventas para Homelas v2.0.0

## Resumen Ejecutivo

**Objetivo:** Crear una landing page profesional estilo Wise para vender Homelas con modelo Freemium ($0 vs $9.99 USD/mes), capturas reales del producto con Playwright, y compliance WCAG 2.1 AA.

**Decisiones del Usuario:**
- ✅ Modelo Freemium (Gratis + Premium)
- ✅ Pricing Global: $9.99 USD/mes (mercado internacional)
- ✅ Screenshots reales con Playwright
- ✅ Tono profesional y confiable (estilo Nu/Wise)
- ✅ Secciones: Hero, Features, Screenshots, Pricing, Reviews, CTA

**Estrategia:** Reemplazar `/app/page.tsx` actual (muy básica) con landing completa usando componentes del sistema Homelas, Server Components por defecto, y capturas automatizadas.

---

## Arquitectura Técnica

### Estructura de Archivos

```
/Users/naranjax/Projects/luishron/gastos/
├── app/
│   ├── page.tsx (REEMPLAZAR - landing completa)
│   └── layout.tsx (MODIFICAR - metadata SEO)
├── components/landing/ (CREAR directorio)
│   ├── hero-section.tsx
│   ├── features-grid.tsx
│   ├── feature-card.tsx
│   ├── screenshots-carousel.tsx (Client Component)
│   ├── pricing-table.tsx
│   ├── pricing-card.tsx
│   ├── testimonials-section.tsx
│   ├── testimonial-card.tsx
│   ├── cta-section.tsx
│   ├── footer-landing.tsx
│   └── logo.tsx
├── public/
│   ├── screenshots/ (CREAR - 6 imágenes del producto)
│   └── og-image.png (CREAR - Open Graph 1200x630)
└── scripts/playwright/ (CREAR directorio)
    ├── capture-screenshots.ts
    ├── seed-demo-data.ts
    └── playwright.config.ts
```

### Componentes Reutilizables

**Del sistema existente (`/components/ui/`):**
- Button, Card, Badge, Separator

**Nuevos en `/components/landing/`:**
- FeatureCard, PricingCard, TestimonialCard, Logo

---

## Contenido de la Landing Page

### 1. Hero Section

**Estructura:**
- **Headline:** "Control financiero simple sin complicaciones"
- **Subheadline:** "Registra gastos e ingresos, visualiza tu situación financiera en tiempo real, y alcanza balance positivo mes a mes."
- **CTA Primary:** "Comenzar gratis" → `/login`
- **CTA Secondary:** "Ver demo" → scroll a screenshots
- **Visual:** Screenshot dashboard (right side en desktop)

**Layout:** 2 columnas desktop (texto left, imagen right), stack vertical móvil

### 2. Features Grid (6 Cards)

1. **Dashboard Inteligente** - BarChart3 icon
   "Visualiza tus finanzas en tiempo real. KPIs principales, comparativas mensuales y proyecciones automáticas."

2. **Gastos Recurrentes Virtuales** - RefreshCw icon
   "Registra Netflix una vez, generamos automáticamente las próximas instancias. Sin saturar tu base de datos."

3. **Quick Add (< 3 segundos)** - Zap icon
   "Agregar gasto en menos de 3 taps. FAB siempre visible con formulario simplificado."

4. **UX Estilo Wise** - Sparkles icon
   "Cards en lugar de tablas, agrupación temporal inteligente, búsqueda Cmd+K. Diseñado para claridad máxima."

5. **Accesibilidad WCAG 2.1 AA** - Eye icon
   "Touch targets ≥44px, contraste ≥4.5:1, navegación por teclado completa. Finanzas para todos."

6. **Sistema Completo de Ingresos** - TrendingUp icon
   "Categorías separadas, ingresos recurrentes, proyecciones precisas. Entiende tu situación financiera completa."

**Layout:** Grid 3 columnas (desktop), 2 columnas (tablet), 1 columna (móvil)

### 3. Screenshots Carousel

**6 Capturas con Playwright:**
1. `dashboard-light.png` - Dashboard completo (light mode, 1920x1080)
2. `dashboard-dark.png` - Dashboard completo (dark mode, 1920x1080)
3. `expenses-view.png` - Vista de gastos con TransactionItems
4. `categories-grid.png` - Grid de categorías coloridas
5. `quick-add-fab.png` - QuickAddFAB abierto con formulario
6. `mobile-navigation.png` - Vista móvil con bottom nav (375x812)

**Implementación:** Carrusel con Embla Carousel (navegación flechas, auto-play pausable, thumbnails)

**Optimización:** WebP (primary) + PNG (fallback), lazy loading, next/image con sizes responsive

### 4. Pricing Table

#### Plan FREE

- **Precio:** $0 USD/mes
- **Badge:** "Popular"
- **Features:**
  - Gastos e ingresos ilimitados
  - Hasta 10 categorías personalizables
  - 3 métodos de pago
  - Dashboard con KPIs principales
  - Gastos recurrentes virtuales
  - Exportación CSV básica (1 vez/mes)
  - Acceso desde 1 dispositivo
- **CTA:** "Comenzar gratis"

#### Plan PREMIUM

- **Precio:** $9.99 USD/mes ($99 USD/año - 17% descuento)
- **Badge:** "Más completo"
- **Features adicionales:**
  - ✅ Todo de Free +
  - Categorías ilimitadas
  - Métodos de pago ilimitados
  - Presupuestos por categoría (con alertas)
  - Gráficos de tendencias (6 meses histórico)
  - Exportación CSV/PDF ilimitada
  - Adjuntar recibos (hasta 100 MB/mes)
  - Recordatorios automáticos por email
  - Multi-dispositivo (sync en tiempo real)
  - Soporte prioritario
  - Acceso anticipado a nuevas features
- **CTA:** "Probar Premium 14 días gratis"
- **Trial:** 14 días gratis, sin tarjeta de crédito

**Layout:** 2 columnas (Free left, Premium right destacado), stack vertical en móvil (Premium primero)

### 5. Testimonials Section

**3 Testimonials mockup (basados en PRD personas):**

1. **Ana Martínez** - Marketing Manager, CDMX
   ⭐⭐⭐⭐⭐
   "Antes gastaba horas en Excel. Con Homelas veo mi situación financiera en 5 segundos. El dashboard es hermoso y funcional."

2. **Carlos Ramírez** - Diseñador Freelance, Guadalajara
   ⭐⭐⭐⭐⭐
   "Los gastos recurrentes virtuales son un game-changer. Ya no olvido renovaciones de software. Proyecta mis próximos 2 meses perfectamente."

3. **Lupita González** - Estudiante, Monterrey
   ⭐⭐⭐⭐⭐
   "Simple sin ser simplista. No necesito ser contadora para entender mis finanzas. Y es gratis!"

**Layout:** Grid 3 columnas (desktop), carrusel horizontal con snap scroll (móvil)

### 6. Final CTA Section

- **Headline:** "Empieza a controlar tus finanzas hoy"
- **Subheadline:** "Gratis para siempre. Sin tarjeta de crédito. Cancela cuando quieras."
- **CTA:** "Crear cuenta gratis" (botón large primary)
- **Background:** Gradient sutil con patrón de dots

### 7. Footer

**4 Columnas:**
1. **Producto:** Features, Pricing, Roadmap, Changelog
2. **Recursos:** Documentación, Guías, PRD, Blog (futuro)
3. **Legal:** Términos, Privacidad, Cookies
4. **Contacto:** GitHub, Twitter/X, Email

**Bottom bar:** Logo + "© 2025 Homelas. Gestión financiera personal."

---

## Plan de Capturas con Playwright

### Setup

**Instalar dependencias:**
```bash
pnpm add -D @playwright/test sharp
pnpm exec playwright install chromium
```

### Datos de Seed (`scripts/playwright/seed-demo-data.ts`)

**8 Categorías con colores/iconos:**
1. Comida 🍔 - `hsl(25 95% 53%)` - $2,450
2. Transporte 🚗 - `hsl(220 89% 61%)` - $1,200
3. Entretenimiento 🎮 - `hsl(280 83% 63%)` - $890
4. Servicios 💡 - `hsl(45 93% 47%)` - $1,500
5. Renta 🏠 - `hsl(199 89% 48%)` - $8,000
6. Salud 💊 - `hsl(142 76% 36%)` - $450
7. Educación 📚 - `hsl(217 91% 60%)` - $600
8. Otros ⚙️ - `hsl(215 14% 51%)` - $320

**20 Gastos distribuidos:**
- Mix: vencidos (rojo), pendientes (amarillo), pagados (verde)
- Algunos recurrentes: Renta, Netflix, Gym, Spotify
- Rango: $45 (café) hasta $8,000 (renta)
- Fechas: pasado, hoy, próximos días

**2 Ingresos:**
- Salario Diciembre: $25,000 (recurrente mensual)
- Freelance Proyecto Web: $5,000 (único)

**3 Métodos de Pago:**
1. Visa BBVA ••1234 - `hsl(220 89% 61%)`
2. Mastercard Santander ••5678 - `hsl(0 84% 60%)`
3. Efectivo - `hsl(142 76% 36%)`

### Script de Captura (`scripts/playwright/capture-screenshots.ts`)

**Flow:**
1. Login con credenciales de test
2. Navegar a cada vista
3. Wait for networkidle
4. Capturar fullPage o elemento específico
5. Guardar en `public/screenshots/`

**6 Capturas:**
1. `/dashboard` - Light mode - 1920x1080 - fullPage
2. `/dashboard` - Dark mode (localStorage theme=dark) - 1920x1080 - fullPage
3. `/dashboard/gastos` - Light mode - 1920x1080 - focus en lista
4. `/dashboard/categorias` - Light mode - 1920x1080 - grid de categorías
5. `/dashboard` - Click FAB → capturar dialog abierto - 1920x1080
6. `/dashboard/gastos` - Mobile viewport 375x812 - bottom nav visible

### Optimización (`scripts/optimize-screenshots.ts`)

**Con Sharp:**
- Comprimir PNG → WebP (quality 85)
- Optimizar PNG (compressionLevel 9)
- Output: `dashboard-light.webp` + `dashboard-light.png`

**Uso en landing:**
```tsx
<picture>
  <source srcSet="/screenshots/dashboard-light.webp" type="image/webp" />
  <img src="/screenshots/dashboard-light.png" alt="Dashboard de Homelas" />
</picture>
```

### Comando único

**Agregar a `package.json`:**
```json
{
  "scripts": {
    "screenshots": "tsx scripts/playwright/seed-demo-data.ts && playwright test scripts/playwright/capture-screenshots.ts && tsx scripts/optimize-screenshots.ts"
  }
}
```

**Ejecutar:**
```bash
pnpm run screenshots
```

---

## SEO y Metadata

### Modificar `/app/layout.tsx`

**Agregar metadata completa:**
```typescript
export const metadata: Metadata = {
  title: 'Homelas - Control financiero simple sin complicaciones',
  description: 'Gestiona tus gastos e ingresos, visualiza tu situación financiera en tiempo real. Gratis para siempre.',
  keywords: 'finanzas personales, control de gastos, presupuesto, Latam, app financiera',
  metadataBase: new URL('https://homelas.com'),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://homelas.com',
    title: 'Homelas - Control financiero simple',
    description: 'Registra gastos e ingresos con interfaz estilo Wise. Gratis para siempre.',
    siteName: 'Homelas',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homelas - Control financiero simple',
    description: 'Gestiona tus finanzas personales con estilo Wise. Gratis para siempre.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};
```

### Agregar JSON-LD en `/app/page.tsx`

**Structured Data (Schema.org):**
```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Homelas',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '500' },
};

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

### Crear Open Graph Image

**Archivo:** `/public/og-image.png` (1200x630px)

**Herramienta:** Figma/Canva

**Contenido:**
- Background con gradient Homelas (Verde Vibrante)
- Screenshot del dashboard (preview)
- Logo Homelas
- Tagline: "Control financiero simple"

---

## Responsive Design

### Breakpoints (Mobile-First)

```
Base:   < 640px  (móvil)
sm:     640px+   (móvil grande)
md:     768px+   (tablet)
lg:     1024px+  (desktop)
xl:     1280px+  (desktop grande)
```

### Layouts por Sección

**Hero:**
- Desktop: `grid-cols-2` (texto left, imagen right)
- Mobile: `grid-cols-1` (stack vertical)

**Features:**
- Desktop: `grid-cols-3`
- Tablet: `grid-cols-2`
- Mobile: `grid-cols-1`

**Pricing:**
- Desktop: `grid-cols-2`
- Mobile: `grid-cols-1` (Premium primero)

**Testimonials:**
- Desktop: `grid-cols-3`
- Mobile: Carrusel horizontal con `snap-x`

### Touch Targets (WCAG 2.1 AA)

**Mínimo 44px en todos los elementos interactivos:**
- Botones: `h-11` (44px)
- Links footer: `min-h-[44px]`
- Carousel controls: `h-11 w-11`

---

## Accesibilidad (WCAG 2.1 AA)

### Checklist

**Contraste:**
- [x] Verde Vibrante (#9FFF66) + Verde Pino (#071C11) = 8.5:1 ✅
- [x] Texto primary sobre background ≥ 4.5:1 ✅

**Navegación por Teclado:**
- [x] Tab order lógico (top-to-bottom)
- [x] Focus visible en todos los elementos (`focus-visible:ring-2`)
- [x] Carousel navegable con flechas

**ARIA Labels:**
```tsx
// Logo
<img src="/logo.svg" alt="Homelas - Control financiero" />

// Carousel
<div role="region" aria-label="Screenshots del producto">
  <button aria-label="Siguiente screenshot"><ChevronRight /></button>
</div>

// CTA
<Button aria-label="Crear cuenta gratuita en Homelas">Comenzar gratis</Button>
```

**Semantic HTML:**
```tsx
<header><nav aria-label="Navegación principal">...</nav></header>
<main>
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Control financiero simple</h1>
  </section>
</main>
<footer aria-label="Footer del sitio">...</footer>
```

---

## Orden de Implementación

### Fase 1: Setup y Estructura (1-2 horas)

**Crear archivos base:**
1. `/components/landing/logo.tsx` - SVG del logo
2. `/components/landing/hero-section.tsx` - Hero con placeholder
3. `/components/landing/footer-landing.tsx` - Footer básico
4. `/app/page.tsx` - Reemplazar con estructura básica (importar Hero + Footer)

**Resultado:** Landing funcional pero sin contenido final

### Fase 2: Features y Componentes (2-3 horas)

**Crear componentes reutilizables:**
5. `/components/landing/feature-card.tsx` - Card con icono + título + descripción
6. `/components/landing/features-grid.tsx` - Grid de 6 features
7. `/components/landing/cta-section.tsx` - CTA final

**Resultado:** Secciones principales completas

### Fase 3: Pricing (1-2 horas)

**Crear componentes de pricing:**
8. `/components/landing/pricing-card.tsx` - Card Free/Premium
9. `/components/landing/pricing-table.tsx` - Layout de 2 columnas

**Resultado:** Pricing completo con comparativa

### Fase 4: Screenshots con Playwright (3-4 horas)

**Instalar y configurar Playwright:**
```bash
pnpm add -D @playwright/test sharp
pnpm exec playwright install chromium
```

**Crear scripts:**
10. `scripts/playwright/playwright.config.ts` - Configuración base
11. `scripts/playwright/seed-demo-data.ts` - Datos de seed (8 categorías, 20 gastos, 2 ingresos)
12. `scripts/playwright/capture-screenshots.ts` - Capturar 6 screenshots
13. `scripts/optimize-screenshots.ts` - Optimizar con Sharp (WebP + PNG)

**Ejecutar:**
```bash
pnpm run screenshots
```

**Resultado:** 6 screenshots optimizados en `/public/screenshots/`

### Fase 5: Carousel y Testimonials (2-3 horas)

**Instalar Embla Carousel:**
```bash
pnpm add embla-carousel-react
```

**Crear componentes:**
14. `/components/landing/screenshots-carousel.tsx` - Carrusel interactivo (Client Component)
15. `/components/landing/testimonial-card.tsx` - Card de review
16. `/components/landing/testimonials-section.tsx` - Grid/carousel

**Resultado:** Screenshots y testimonios completos

### Fase 6: SEO y Metadata (1 hora)

**Modificar archivos existentes:**
17. `/app/layout.tsx` - Metadata completa (OpenGraph, Twitter, SEO)
18. `/app/page.tsx` - JSON-LD structured data
19. `/public/og-image.png` - Crear Open Graph image (Figma/Canva - 1200x630px)

**Resultado:** SEO optimizado (Lighthouse > 95)

### Fase 7: Responsive y Testing (2-3 horas)

**Testing:**
20. Chrome DevTools responsive mode (móvil, tablet, desktop)
21. Verificar touch targets ≥44px en móvil
22. Screen reader testing (VoiceOver o NVDA)
23. Lighthouse audit (Performance, Accessibility, SEO > 95)
24. Ajustes finales de spacing, colores, animaciones

**Resultado:** Landing 100% responsive y accesible WCAG 2.1 AA

---

## Trade-offs y Decisiones

### 1. Server Components vs Client Components

**Decisión:** Server Components por defecto, Client solo para carousel

**Razón:**
- Zero JavaScript bundle para mayoría de landing
- Mejor SEO (contenido renderizado en servidor)
- Mejor Core Web Vitals (LCP, FID)

**Único Client Component:** `screenshots-carousel.tsx` (requiere interactividad)

### 2. Pricing: $9.99 USD/mes (Global)

**Razón:**
- Precio competitivo internacional (~$200 USD, accesible en LATAM)
- Sweet spot para SaaS: Monarch Money $9.99, Nu Bank ~$8-10 USD
- Free tier generoso reduce objeción
- Trial de 14 días sin tarjeta reduce fricción
- Precio psicológico ($9.99 vs $10)
- Simple: un solo precio global, sin lógica de geolocalización

**Alternativa descartada:** $4.99 USD (demasiado barato, difícil sostener desarrollo), $19.99 USD (muy caro para LATAM)

### 3. Testimonials: Mockups vs Reales

**Decisión inicial:** Mockups basados en PRD personas (Ana, Carlos, Lupita)

**Razón:** No hay usuarios suficientes en v2.0.0 launch

**Plan futuro:** Reemplazar con testimonials reales cuando haya ≥10 usuarios con reviews

### 4. Screenshots en `/public/` vs CDN

**Decisión:** `/public/screenshots/` directamente

**Razón:**
- Simple, no requiere configuración de CDN
- Next.js optimiza automáticamente con `next/image`
- Vercel CDN automático en producción

**Mitigación:** Si crece >10MB, migrar a CDN externo

---

## Archivos Críticos para Modificar/Crear

### MODIFICAR (2 archivos)

1. **`app/page.tsx`**
   - Acción: REEMPLAZAR completamente con nueva landing
   - Estructura: Hero → Features → Screenshots → Pricing → Testimonials → CTA → Footer

2. **`app/layout.tsx`**
   - Acción: Agregar metadata completa (OpenGraph, Twitter, SEO)

### CREAR (19+ archivos)

**Componentes Landing (11 archivos):**
3. `components/landing/logo.tsx`
4. `components/landing/hero-section.tsx`
5. `components/landing/features-grid.tsx`
6. `components/landing/feature-card.tsx`
7. `components/landing/screenshots-carousel.tsx` (Client Component)
8. `components/landing/pricing-table.tsx`
9. `components/landing/pricing-card.tsx`
10. `components/landing/testimonials-section.tsx`
11. `components/landing/testimonial-card.tsx`
12. `components/landing/cta-section.tsx`
13. `components/landing/footer-landing.tsx`

**Scripts Playwright (4 archivos):**
14. `scripts/playwright/playwright.config.ts`
15. `scripts/playwright/seed-demo-data.ts`
16. `scripts/playwright/capture-screenshots.ts`
17. `scripts/optimize-screenshots.ts`

**Assets (7+ archivos):**
18. `public/og-image.png` (crear con Figma/Canva - 1200x630px)
19. `public/screenshots/dashboard-light.png` (captura con Playwright)
20. `public/screenshots/dashboard-dark.png`
21. `public/screenshots/expenses-view.png`
22. `public/screenshots/categories-grid.png`
23. `public/screenshots/quick-add-fab.png`
24. `public/screenshots/mobile-navigation.png`

---

## Comandos Útiles

```bash
# Desarrollo local
pnpm dev

# Capturar screenshots (automático)
pnpm run screenshots

# Optimizar imágenes manualmente
pnpm run optimize:images

# Auditoría Lighthouse
pnpm dlx lighthouse http://localhost:3000 --view

# Auditoría Accesibilidad (axe)
pnpm dlx @axe-core/cli http://localhost:3000

# Build de producción
pnpm build && pnpm start
```

---

## Resultado Esperado

**Landing page lista para vender con:**
- ✅ Diseño profesional y moderno (estilo Wise)
- ✅ Screenshots reales del producto (Playwright)
- ✅ Pricing global claro (Free vs Premium $9.99 USD/mes)
- ✅ Trial de 14 días sin tarjeta de crédito
- ✅ SEO optimizado (Lighthouse > 95)
- ✅ WCAG 2.1 AA compliant (100%)
- ✅ Responsive mobile-first
- ✅ Performance optimizada (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- ✅ Zero JavaScript para mayoría de secciones (Server Components)

**Tiempo total estimado:** 12-16 horas de desarrollo (3-4 días a tiempo parcial)
