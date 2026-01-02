import { useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { ResponsiveContainer, PieChart, Pie, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import "./App.css";
import { auth } from "./lib/firebase";
import { createTransaction, deleteTransaction, subscribeTransactions } from "./lib/transactions";
import type { Transaction, TransactionType } from "./types/transaction";

const provider = new GoogleAuthProvider();

function yyyyMmFromDate(date: Date) {
  return date.toISOString().slice(0, 7);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function firstDayOfMonth(yyyyMm: string) {
  return `${yyyyMm}-01`;
}

function inMonth(dateStr: string, yyyyMm: string) {
  return dateStr.startsWith(yyyyMm + "-");
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [month, setMonth] = useState(() => yyyyMmFromDate(new Date()));
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("Comida");
  const [note, setNote] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setTxs([]);
      return;
    }
    setError(null);
    const unsub = subscribeTransactions(
      user.uid,
      (data) => setTxs(data),
      (e) => setError(e.message)
    );
    return () => unsub();
  }, [user]);

  // Keep date within selected month for convenience
  useEffect(() => {
    if (!inMonth(date, month)) setDate(firstDayOfMonth(month));
  }, [month]); // eslint-disable-line react-hooks/exhaustive-deps

  const monthTxs = useMemo(() => txs.filter((t) => inMonth(t.date, month)), [txs, month]);

  const totals = useMemo(() => {
    let expenses = 0;
    let incomes = 0;
    for (const t of monthTxs) {
      if (t.type === "expense") expenses += t.amount;
      else incomes += t.amount;
    }
    return { expenses, incomes, net: incomes - expenses };
  }, [monthTxs]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthTxs) {
      if (t.type !== "expense") continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [monthTxs]);

  const daily = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthTxs) {
      if (t.type !== "expense") continue;
      const day = t.date.slice(8, 10);
      map.set(day, (map.get(day) ?? 0) + t.amount);
    }
    // Build continuous days for nicer chart
    const [y, m] = month.split("-").map(Number);
    const last = new Date(y, m, 0).getDate(); // last day of month
    const rows = [];
    for (let d = 1; d <= last; d++) {
      const key = pad2(d);
      rows.push({ day: key, value: map.get(key) ?? 0 });
    }
    return rows;
  }, [monthTxs, month]);

  async function handleSignIn() {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo iniciar sesión.");
    }
  }

  async function handleSignOut() {
    setError(null);
    try {
      await signOut(auth);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo cerrar sesión.");
    }
  }

  async function handleAdd() {
    if (!user) return;
    setError(null);

    if (!date || !category.trim()) {
      setError("Completa fecha y categoría.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("El monto debe ser mayor que 0.");
      return;
    }

    try {
      await createTransaction(user.uid, {
        date,
        amount,
        type,
        category: category.trim(),
        note: note.trim() ? note.trim() : "",
        createdAt: Date.now(),
      });
      setAmount(0);
      setNote("");
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar el movimiento.");
    }
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setError(null);
    try {
      await deleteTransaction(user.uid, id);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo eliminar el movimiento.");
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand__title">MagnetWallet</div>
          <div className="brand__subtitle">Control personal de gastos</div>
        </div>

        <div className="auth">
          {user ? (
            <>
              <div className="user">
                {user.photoURL ? (
                  <img className="user__avatar" src={user.photoURL} alt="Avatar" />
                ) : (
                  <div className="user__avatar user__avatar--placeholder" />
                )}
                <div className="user__meta">
                  <div className="user__name">{user.displayName ?? "Usuario"}</div>
                  <div className="user__email">{user.email ?? ""}</div>
                </div>
              </div>

              <button className="btn" onClick={handleSignOut}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <button className="btn btn--primary" onClick={handleSignIn}>
              Iniciar sesión con Google
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {error && <div className="alert">{error}</div>}

        {!user ? (
          <section className="card">
            <h2>Antes de empezar</h2>
            <ol className="list">
              <li>En Firebase Console → Authentication → habilita “Google”.</li>
              <li>En Firestore Database → crea la base (modo producción recomendado).</li>
              <li>Luego vuelve aquí e inicia sesión.</li>
            </ol>
            <p className="muted">
              Este proyecto guarda tus movimientos en <code>users/&lt;uid&gt;/transactions</code>.
            </p>
          </section>
        ) : (
          <>
            <section className="grid">
              <div className="card">
                <h2>Nuevo movimiento</h2>

                <div className="form">
                  <label className="field">
                    <span>Mes</span>
                    <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                  </label>

                  <label className="field">
                    <span>Fecha</span>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </label>

                  <label className="field">
                    <span>Monto</span>
                    <input
                      type="number"
                      min={0}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="0"
                    />
                  </label>

                  <label className="field">
                    <span>Tipo</span>
                    <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
                      <option value="expense">Gasto</option>
                      <option value="income">Ingreso</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>Categoría</span>
                    <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Comida" />
                  </label>

                  <label className="field">
                    <span>Nota</span>
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcional" />
                  </label>

                  <button className="btn btn--primary" onClick={handleAdd}>
                    Guardar
                  </button>
                </div>
              </div>

              <div className="card">
                <h2>Resumen del mes</h2>
                <div className="stats">
                  <div className="stat">
                    <div className="stat__label">Gastos</div>
                    <div className="stat__value">{totals.expenses.toLocaleString()}</div>
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

                <div className="charts">
                  <div className="chart">
                    <div className="chart__title">Gastos por categoría</div>
                    <div className="chart__box">
                      {byCategory.length === 0 ? (
                        <div className="muted">Aún no hay gastos en este mes.</div>
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
                        <div className="muted">Aún no hay gastos en este mes.</div>
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
            </section>

            <section className="card">
              <h2>Movimientos del mes</h2>

              {monthTxs.length === 0 ? (
                <div className="muted">No hay movimientos en este mes.</div>
              ) : (
                <div className="table">
                  <div className="row row--head">
                    <div>Fecha</div>
                    <div>Categoría</div>
                    <div>Tipo</div>
                    <div className="right">Monto</div>
                    <div></div>
                  </div>

                  {monthTxs.map((t) => (
                    <div className="row" key={t.id}>
                      <div>{t.date}</div>
                      <div>{t.category}</div>
                      <div>{t.type === "expense" ? "Gasto" : "Ingreso"}</div>
                      <div className="right">{t.amount.toLocaleString()}</div>
                      <div className="right">
                        <button className="btn btn--ghost" onClick={() => handleDelete(t.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <span className="muted">
          Consejo: en Firebase Console puedes desplegar reglas para que solo tu usuario acceda a sus datos.
        </span>
      </footer>
    </div>
  );
}
