import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import type { Transaction, TransactionCreateInput } from "../types/transaction";
import { createTransaction, deleteTransaction, subscribeTransactions } from "../services/transactions";
import {
  buildDailyExpenses,
  computeTotals,
  filterTransactionsByMonth,
  groupExpensesByCategory,
} from "../lib/transaction-metrics";

export function useTransactions(user: User | null, month: string) {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTxs([]);
      return;
    }
    setError(null);
    const unsub = subscribeTransactions(user.uid, month, (data) => setTxs(data), (e) => setError(e.message));
    return () => unsub();
  }, [user, month]);

  const monthTxs = useMemo(() => filterTransactionsByMonth(txs, month), [txs, month]);
  const totals = useMemo(() => computeTotals(monthTxs), [monthTxs]);
  const byCategory = useMemo(() => groupExpensesByCategory(monthTxs), [monthTxs]);
  const daily = useMemo(() => buildDailyExpenses(monthTxs, month), [monthTxs, month]);

  const addTransaction = useCallback(
    async (input: TransactionCreateInput) => {
      if (!user) return false;
      setError(null);

      if (!input.date || !input.category.trim()) {
        setError("Completa fecha y categoria.");
        return false;
      }
      if (!Number.isFinite(input.amount) || input.amount <= 0) {
        setError("El monto debe ser mayor que 0.");
        return false;
      }

      try {
        await createTransaction(user.uid, {
          ...input,
          category: input.category.trim(),
          note: input.note?.trim() ? input.note.trim() : "",
          createdAt: input.createdAt ?? Date.now(),
        });
        return true;
      } catch (e: any) {
        setError(e?.message ?? "No se pudo guardar el movimiento.");
        return false;
      }
    },
    [user]
  );

  const removeTransaction = useCallback(
    async (id: string) => {
      if (!user) return false;
      setError(null);
      try {
        await deleteTransaction(user.uid, id);
        return true;
      } catch (e: any) {
        setError(e?.message ?? "No se pudo eliminar el movimiento.");
        return false;
      }
    },
    [user]
  );

  return { txs, monthTxs, totals, byCategory, daily, addTransaction, removeTransaction, error };
}
