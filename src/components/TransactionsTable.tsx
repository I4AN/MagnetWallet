import type { Transaction } from "../types/transaction";

type TransactionsTableProps = {
  rows: Transaction[];
  onDelete: (id: string) => void;
};

export function TransactionsTable({ rows, onDelete }: TransactionsTableProps) {
  return (
    <section className="card">
      <h2>Movimientos del mes</h2>

      {rows.length === 0 ? (
        <div className="muted">No hay movimientos en este mes.</div>
      ) : (
        <div className="table">
          <div className="row row--head">
            <div>Fecha</div>
            <div>Categoria</div>
            <div>Tipo</div>
            <div className="right">Monto</div>
            <div></div>
          </div>

          {rows.map((row) => (
            <div className="row" key={row.id}>
              <div>{row.date}</div>
              <div>{row.category}</div>
              <div>{row.type === "expense" ? "Gasto" : "Ingreso"}</div>
              <div className="right">{row.amount.toLocaleString()}</div>
              <div className="right">
                <button className="btn btn--ghost" onClick={() => onDelete(row.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
