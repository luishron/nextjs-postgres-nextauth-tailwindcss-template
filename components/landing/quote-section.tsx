export function QuoteSection() {
  return (
    <section className="py-16 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Lo que no se mide,{" "}
            <span className="text-primary">se descontrola</span>.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mt-6">
            Homelas mide. Tú controlas.
          </p>
        </div>
      </div>
    </section>
  );
}
