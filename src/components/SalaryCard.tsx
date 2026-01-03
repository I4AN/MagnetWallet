type SalaryCardProps = {
  month: string;
  salary: number | null;
  salaryInput: string;
  onSalaryInputChange: (value: string) => void;
  onSaveSalary: () => void;
};

export function SalaryCard({
  month,
  salary,
  salaryInput,
  onSalaryInputChange,
  onSaveSalary,
}: SalaryCardProps) {
  return (
    <div className="card">
      <h2>Sueldo mensual</h2>
      <div className="salary">
        <div className="salary__header">
          <div className="salary__title">Mes seleccionado</div>
          <div className="salary__subtitle">{month}</div>
        </div>
        <div className="salary__form">
          <label className="field">
            <span>Monto</span>
            <input
              type="number"
              min={0}
              value={salaryInput}
              onChange={(e) => onSalaryInputChange(e.target.value)}
              placeholder="Ej: 1500"
            />
          </label>
          <button className="btn btn--primary" onClick={onSaveSalary}>
            Guardar sueldo
          </button>
        </div>
        <div className="muted">
          Sueldo actual: {salary === null ? "Sin configurar" : salary.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
