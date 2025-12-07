import Link from 'next/link';
import {
  Home,
  LineChart,
  Wallet,
  FolderOpen,
  DollarSign,
  TrendingUp,
  PanelLeft,
  Settings,
  CreditCard
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumb />
            <SearchInput />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Wallet className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Control de Gastos</span>
        </Link>

        <NavItem href="/" label="Dashboard">
          <Home className="h-5 w-5" />
        </NavItem>

        <NavItem href="/gastos" label="Gastos">
          <DollarSign className="h-5 w-5" />
        </NavItem>

        <NavItem href="/categorias" label="Categorías">
          <FolderOpen className="h-5 w-5" />
        </NavItem>

        <NavItem href="/metodos-pago" label="Métodos de Pago">
          <CreditCard className="h-5 w-5" />
        </NavItem>

        <NavItem href="/ingresos" label="Ingresos">
          <TrendingUp className="h-5 w-5" />
        </NavItem>

        <NavItem href="/reportes" label="Reportes">
          <LineChart className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/configuracion"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Configuración</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Configuración</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Wallet className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Control de Gastos</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/gastos"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <DollarSign className="h-5 w-5" />
            Gastos
          </Link>
          <Link
            href="/categorias"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <FolderOpen className="h-5 w-5" />
            Categorías
          </Link>
          <Link
            href="/metodos-pago"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <CreditCard className="h-5 w-5" />
            Métodos de Pago
          </Link>
          <Link
            href="/ingresos"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <TrendingUp className="h-5 w-5" />
            Ingresos
          </Link>
          <Link
            href="/reportes"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Reportes
          </Link>
          <Link
            href="/configuracion"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            Configuración
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Control de Gastos</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
