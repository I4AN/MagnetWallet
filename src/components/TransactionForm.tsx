import type { CategoryGroup } from "../lib/categories";
import type { TransactionType } from "../types/transaction";

type TransactionFormProps = {
  categoryGroups: CategoryGroup[];
  categoryGroup: string;
  onCategoryGroupChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  type: TransactionType;
  onTypeChange: (value: TransactionType) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  note: string;
  onNoteChange: (value: string) => void;
  onSave: () => void;
};

export function TransactionForm({
  categoryGroups,
  categoryGroup,
  onCategoryGroupChange,
  month,
  onMonthChange,
  date,
  onDateChange,
  amount,
  onAmountChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  note,
  onNoteChange,
  onSave,
}: TransactionFormProps) {
  const activeGroup = categoryGroups.find((group) => group.title === categoryGroup) ?? categoryGroups[0];
  const categories = activeGroup?.items ?? [];

  return (
    <div className="card">
      <h2>Nuevo movimiento</h2>

      <div className="form">
        <label className="field">
          <span>Mes</span>
          <input type="month" value={month} onChange={(e) => onMonthChange(e.target.value)} />
        </label>

        <label className="field">
          <span>Fecha</span>
          <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </label>

        <label className="field">
          <span>Monto</span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Ej: 120"
          />
        </label>

        <label className="field">
          <span>Tipo</span>
          <select value={type} onChange={(e) => onTypeChange(e.target.value as TransactionType)}>
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </label>

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
            className={`category-select${category ? " category-select--active" : ""}`}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Nota</span>
          <input value={note} onChange={(e) => onNoteChange(e.target.value)} placeholder="Opcional" />
        </label>

        <button className="btn btn--primary" onClick={onSave}>
          Guardar
        </button>
      </div>
    </div>
  );
}
