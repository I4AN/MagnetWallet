import { useCallback, useEffect, useState } from "react";
import { EXPENSE_CATEGORY_GROUPS } from "../lib/categories";
import type { TransactionType } from "../types/transaction";

export function useTransactionForm() {
  const defaultGroup =
    EXPENSE_CATEGORY_GROUPS.find((group) => group.items.includes("Supermercado")) ?? EXPENSE_CATEGORY_GROUPS[0];
  const defaultCategory = defaultGroup?.items[0] ?? "";

  const [categoryGroup, setCategoryGroup] = useState(defaultGroup?.title ?? "");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState(defaultCategory);
  const [note, setNote] = useState("");

  useEffect(() => {
    const activeGroup =
      EXPENSE_CATEGORY_GROUPS.find((group) => group.title === categoryGroup) ?? EXPENSE_CATEGORY_GROUPS[0];
    if (!activeGroup) return;
    if (!activeGroup.items.includes(category)) {
      setCategory(activeGroup.items[0] ?? "");
    }
  }, [category, categoryGroup]);

  const resetAfterSave = useCallback(() => {
    setAmount("");
    setNote("");
  }, []);

  return {
    categoryGroup,
    setCategoryGroup,
    amount,
    setAmount,
    type,
    setType,
    category,
    setCategory,
    note,
    setNote,
    resetAfterSave,
  };
}
