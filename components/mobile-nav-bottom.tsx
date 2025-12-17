'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  DollarSign,
  FolderOpen,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNavBottom() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/gastos', label: 'Gastos', icon: DollarSign },
    { href: '/dashboard/categorias', label: 'Categorías', icon: FolderOpen },
    { href: '/dashboard/ingresos', label: 'Ingresos', icon: TrendingUp },
    { href: '/dashboard/metodos-pago', label: 'Métodos', icon: CreditCard }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg shadow-2xl sm:hidden">
      {/* Active indicator - top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="grid grid-cols-5 gap-0.5 px-1 py-1.5">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium transition-all duration-200',
                'relative',
                isActive
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              )}
            >
              {/* Active indicator - top dot */}
              {isActive && (
                <span className="absolute top-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary animate-pulse" />
              )}

              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-primary/15 shadow-sm'
                    : 'group-hover:bg-accent'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span className="truncate leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
