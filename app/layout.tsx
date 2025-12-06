import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control de Gastos',
  description:
    'Aplicación de control de gastos personales con Next.js, Supabase y Tailwind CSS.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
