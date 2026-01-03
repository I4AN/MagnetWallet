import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export type BudgetCategory = {
  id: string;
  name: string;
  amount: number;
  month: string;
  updatedAt?: number;
};

function budgetCollection(uid: string, month: string) {
  return collection(db, "users", uid, "budgets", month, "categories");
}

function budgetDocId(name: string) {
  return encodeURIComponent(name.trim().toLowerCase());
}

export function subscribeMonthlyBudgets(
  uid: string,
  month: string,
  onData: (budgets: BudgetCategory[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(budgetCollection(uid, month), orderBy("name"));
  return onSnapshot(
    q,
    (snap) => {
      const budgets = snap.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          name: String(data.name ?? ""),
          amount: Number(data.amount ?? 0),
          month: String(data.month ?? month),
          updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : undefined,
        } satisfies BudgetCategory;
      });
      onData(budgets);
    },
    (e) => onError?.(e as Error)
  );
}

export async function upsertBudgetCategory(uid: string, month: string, name: string, amount: number) {
  const id = budgetDocId(name);
  await setDoc(
    doc(budgetCollection(uid, month), id),
    {
      name: name.trim(),
      amount,
      month,
      updatedAt: Date.now(),
      updatedAtServer: serverTimestamp(),
    },
    { merge: true }
  );
}
