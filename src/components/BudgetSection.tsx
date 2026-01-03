import type { CategoryGroup } from "../lib/categories";
import type { BudgetCategory } from "../services/budgets";

type CategoryTotal = {
  name: string;
  value: number;
};

type BudgetSectionProps = {
  month: string;
  budgets: BudgetCategory[];
  spentByCategory: CategoryTotal[];
  categoryGroups: CategoryGroup[];
  categoryGroup: string;
  onCategoryGroupChange: (value: string) => void;
  categoryInput: string;
  onCategoryChange: (value: string) => void;
  amountInput: string;
  onAmountChange: (value: string) => void;
  onSaveBudget: () => void;
};

export function BudgetSection({
  month,
  budgets,
  spentByCategory,
  categoryGroups,
  categoryGroup,
  onCategoryGroupChange,
  categoryInput,
  onCategoryChange,
  amountInput,
  onAmountChange,
  onSaveBudget,
}: BudgetSectionProps) {
  const activeGroup = categoryGroups.find((group) => group.title === categoryGroup) ?? categoryGroups[0];
  const categories = activeGroup?.items ?? [];

  const budgetMap = new Map(budgets.map((budget) => [budget.name, budget.amount]));
  const spentMap = new Map(spentByCategory.map((row) => [row.name, row.value]));
  const names = new Set([...budgetMap.keys(), ...spentMap.keys()]);
  const rows = Array.from(names)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const budget = budgetMap.get(name) ?? null;
      const spent = spentMap.get(name) ?? 0;
      const remaining = budget === null ? null : budget - spent;
      return {
        name,
        budget,
        spent,
        remaining,
        over: remaining !== null && remaining < 0,
      };
    });

  return (
    <div className="card">
      <h2>Presupuesto por categoria</h2>
      <div className="budget__meta muted">Mes: {month}</div>
      <div className="budget__form">
        <label className="field">
          <span>Tipo de gasto</span>
          <select
            className={`category-select${categoryGroup ? " category-select--active" : ""}`}
            value={categoryGroup}
            onChange={(e) => onCategoryGroupChange(e.target.value)}
          >
            {categoryGroups.map((group) => (
              <option key={group.title} value={group.title}>
                {group.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Categoria</span>
          <select
            className={`category-select${categoryInput ? " category-select--active" : ""}`}
            value={categoryInput}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Presupuesto</span>
          <input
            type="number"
            min={0}
            value={amountInput}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Ej: 300"
          />
        </label>
        <button className="btn btn--primary" onClick={onSaveBudget}>
          Guardar presupuesto
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="muted">Aun no hay presupuestos ni gastos en este mes.</div>
      ) : (
        <div className="budget__table">
          <div className="budget__row budget__row--head">
            <div>Categoria</div>
            <div className="right">Presupuesto</div>
            <div className="right">Gastado</div>
            <div className="right">Restante</div>
          </div>
          {rows.map((row) => (
            <div className={`budget__row${row.over ? " budget__row--over" : ""}`} key={row.name}>
              <div>{row.name}</div>
              <div className="right">
                {row.budget === null ? <span className="muted">Sin presupuesto</span> : row.budget.toLocaleString()}
              </div>
              <div className="right">{row.spent.toLocaleString()}</div>
              <div className="right">
                {row.remaining === null ? "--" : row.remaining.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
