import type { Transaction } from "../types/transaction";
import { inMonth, pad2 } from "./date";

export function filterTransactionsByMonth(txs: Transaction[], yyyyMm: string) {
  return txs.filter((t) => inMonth(t.date, yyyyMm));
}

export function computeTotals(monthTxs: Transaction[]) {
  let expenses = 0;
  let incomes = 0;
  for (const t of monthTxs) {
    if (t.type === "expense") expenses += t.amount;
    else incomes += t.amount;
  }
  return { expenses, incomes, net: incomes - expenses };
}

export function groupExpensesByCategory(monthTxs: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of monthTxs) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function buildDailyExpenses(monthTxs: Transaction[], yyyyMm: string) {
  const map = new Map<string, number>();
  for (const t of monthTxs) {
    if (t.type !== "expense") continue;
    const day = t.date.slice(8, 10);
    map.set(day, (map.get(day) ?? 0) + t.amount);
  }
  const [year, month] = yyyyMm.split("-").map(Number);
  const last = new Date(year, month, 0).getDate();
  const rows = [];
  for (let d = 1; d <= last; d++) {
    const key = pad2(d);
    rows.push({ day: key, value: map.get(key) ?? 0 });
  }
  return rows;
}
