import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Homelas - Control financiero simple sin complicaciones',
  description:
    'Gestiona tus gastos e ingresos, visualiza tu situación financiera en tiempo real. Gratis para siempre.',
  keywords:
    'finanzas personales, control de gastos, presupuesto, mexico, app financiera, gastos recurrentes, ingresos',
  metadataBase: new URL('https://homelas.com'),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://homelas.com',
    title: 'Homelas - Control financiero simple',
    description:
      'Registra gastos e ingresos con interfaz estilo Wise. Gratis para siempre.',
    siteName: 'Homelas',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homelas - Control financiero simple',
    description:
      'Gestiona tus finanzas personales con estilo Wise. Gratis para siempre.',
    images: ['/og-image.png']
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen w-full flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
