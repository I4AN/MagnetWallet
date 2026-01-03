type Totals = {
  expenses: number;
  incomes: number;
  net: number;
};

type StatsOverviewProps = {
  salary: number | null;
  totals: Totals;
  available: number | null;
};

export function StatsOverview({ salary, totals, available }: StatsOverviewProps) {
  return (
    <section className="card stats-card">
      <h2>Resumen rapido</h2>
      <div className="stats stats--overview">
        <div className="stat">
          <div className="stat__label">Sueldo</div>
          <div className="stat__value">{salary === null ? "Sin configurar" : salary.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat__label">Gastos</div>
          <div className="stat__value">{totals.expenses.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat__label">Disponible</div>
          <div className="stat__value">{available === null ? "--" : available.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat__label">Ingresos</div>
          <div className="stat__value">{totals.incomes.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat__label">Balance</div>
          <div className="stat__value">{totals.net.toLocaleString()}</div>
        </div>
      </div>
    </section>
  );
}
