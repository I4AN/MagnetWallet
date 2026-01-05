import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BudgetCategory } from "../services/budgets";
import Carousel from "./Carousel";

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
  budgets: BudgetCategory[];
  spentByCategory: CategoryTotal[];
};

export function MonthlySummary({ month, byCategory, daily, budgets, spentByCategory }: MonthlySummaryProps) {
  const hasCategoryData = byCategory.length > 0;
  const categoryData = hasCategoryData ? byCategory : [{ name: "Sin datos", value: 1 }];

  const hasDailyData = daily.some((d) => d.value > 0);

  const spentMap = new Map(spentByCategory.map((row) => [row.name, row.value]));
  const budgetRows = budgets.map((budget) => ({
    name: budget.name,
    budget: budget.amount,
    spent: spentMap.get(budget.name) ?? 0,
  }));
  const hasBudgetData = budgetRows.length > 0;
  const budgetChartData = hasBudgetData ? budgetRows : [{ name: "Sin datos", budget: 1, spent: 0 }];

  const slides = [
    {
      id: "by-category",
      title: "Gastos por categoria",
      content: (
        <div className="chart-slide">
          <div className="chart-slide__title">Gastos por categoria</div>
          <div className="chart-slide__body">
            {!hasCategoryData && <div className="chart__empty">Sin datos</div>}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
    },
    {
      id: "daily",
      title: "Gasto diario",
      content: (
        <div className="chart-slide">
          <div className="chart-slide__title">Gasto diario</div>
          <div className="chart-slide__body">
            {!hasDailyData && <div className="chart__empty">Sin datos</div>}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
    },
    {
      id: "budget-vs",
      title: "Presupuesto vs Gastos",
      content: (
        <div className="chart-slide">
          <div className="chart-slide__title">Presupuesto vs Gastos</div>
          <div className="chart-slide__body">
            {!hasBudgetData && <div className="chart__empty">Sin presupuestos</div>}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#6aa6ff" name="Presupuesto" />
                <Bar dataKey="spent" fill="#ff8a8a" name="Gasto" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="card card--charts">
      <h2>Graficos del mes</h2>
      <div className="muted">Mes: {month}</div>
      <div className="chart-carousel">
        <Carousel
          items={slides}
          fluid
          loop
          autoplay={false}
          renderItem={(item) => item.content}
          itemClassName="carousel-item--chart"
          containerClassName="carousel-container--chart"
        />
      </div>
    </div>
  );
}
