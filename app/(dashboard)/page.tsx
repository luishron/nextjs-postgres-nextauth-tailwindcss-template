export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard de Gastos</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Gastos
          </h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Ingresos
          </h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Balance
          </h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Presupuesto
          </h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen</h2>
        <p className="text-muted-foreground">
          Conecta tu base de datos Supabase para comenzar a registrar tus gastos.
        </p>
      </div>
    </div>
  );
}
