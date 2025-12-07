import Link from 'next/link';
import { Wallet, TrendingUp, PieChart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await getUser();

  // Si el usuario está autenticado, redirigir al dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            <span className="text-xl font-bold">homelas</span>
          </div>
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Gestiona tus finanzas de forma simple
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Controla tus gastos e ingresos, visualiza tus finanzas y toma mejores decisiones económicas.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button size="lg">Comenzar ahora</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/40 py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Control Total</h3>
                <p className="text-muted-foreground">
                  Registra y categoriza todos tus gastos e ingresos en un solo lugar
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Visualización Clara</h3>
                <p className="text-muted-foreground">
                  Gráficos y reportes que te ayudan a entender tu situación financiera
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Seguro y Privado</h3>
                <p className="text-muted-foreground">
                  Tus datos están protegidos y solo tú tienes acceso a ellos
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 homelas. Gestión financiera personal.</p>
        </div>
      </footer>
    </div>
  );
}
