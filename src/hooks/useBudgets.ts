import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { EXPENSE_CATEGORY_GROUPS } from "../lib/categories";
import { subscribeMonthlyBudgets, upsertBudgetCategory, type BudgetCategory } from "../services/budgets";

export function useBudgets(user: User | null, month: string) {
  const defaultGroup =
    EXPENSE_CATEGORY_GROUPS.find((group) => group.items.includes("Supermercado")) ?? EXPENSE_CATEGORY_GROUPS[0];
  const defaultCategory = defaultGroup?.items[0] ?? "";

  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [categoryGroup, setCategoryGroup] = useState(defaultGroup?.title ?? "");
  const [categoryInput, setCategoryInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setCategoryGroup(defaultGroup?.title ?? "");
      setCategoryInput(defaultCategory);
      setAmountInput("");
      return;
    }
    setError(null);
    const unsub = subscribeMonthlyBudgets(
      user.uid,
      month,
      (data) => setBudgets(data),
      (e) => setError(e.message)
    );
    return () => unsub();
  }, [user, month]);

  useEffect(() => {
    const activeGroup =
      EXPENSE_CATEGORY_GROUPS.find((group) => group.title === categoryGroup) ?? EXPENSE_CATEGORY_GROUPS[0];
    if (!activeGroup) return;
    if (!activeGroup.items.includes(categoryInput)) {
      setCategoryInput(activeGroup.items[0] ?? "");
    }
  }, [categoryGroup, categoryInput]);

  const saveBudget = useCallback(async () => {
    if (!user) return false;
    setError(null);

    const name = categoryInput.trim();
    const value = Number(amountInput.trim());
    if (!name) {
      setError("La categoria es obligatoria.");
      return false;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError("El presupuesto debe ser mayor que 0.");
      return false;
    }

    try {
      await upsertBudgetCategory(user.uid, month, name, value);
      setCategoryInput("");
      setAmountInput("");
      return true;
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar el presupuesto.");
      return false;
    }
  }, [amountInput, categoryInput, month, user]);

  const budgetMap = useMemo(() => {
    const map = new Map<string, BudgetCategory>();
    for (const budget of budgets) {
      map.set(budget.name, budget);
    }
    return map;
  }, [budgets]);

  return {
    budgets,
    budgetMap,
    categoryGroup,
    setCategoryGroup,
    categoryInput,
    setCategoryInput,
    amountInput,
    setAmountInput,
    saveBudget,
    error,
  };
}
