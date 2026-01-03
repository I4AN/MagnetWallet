import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CategoryTotal = {
  name: string;
  value: number;
};

type DailyTotal = {
  day: string;
  value: number;
};

type MonthlySummaryProps = {
  month: string;
  byCategory: CategoryTotal[];
  daily: DailyTotal[];
};

export function MonthlySummary({ month, byCategory, daily }: MonthlySummaryProps) {
  return (
    <div className="card">
      <h2>Graficos del mes</h2>
      <div className="muted">Mes: {month}</div>
      <div className="charts">
        <div className="chart">
          <div className="chart__title">Gastos por categoria</div>
          <div className="chart__box">
            {byCategory.length === 0 ? (
              <div className="muted">Aun no hay gastos en este mes.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={90} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="chart">
          <div className="chart__title">Gasto diario</div>
          <div className="chart__box">
            {daily.every((d) => d.value === 0) ? (
              <div className="muted">Aun no hay gastos en este mes.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
