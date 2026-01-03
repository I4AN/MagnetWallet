import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { firstDayOfMonth, nextMonth } from "../lib/date";
import type { Transaction, TransactionCreateInput } from "../types/transaction";

function txCollection(uid: string) {
  return collection(db, "users", uid, "transactions");
}

export async function createTransaction(uid: string, input: TransactionCreateInput) {
  await addDoc(txCollection(uid), {
    ...input,
    createdAt: input.createdAt ?? Date.now(),
    createdAtServer: serverTimestamp(),
  });
}

export async function deleteTransaction(uid: string, id: string) {
  await deleteDoc(doc(db, "users", uid, "transactions", id));
}

export function subscribeTransactions(
  uid: string,
  month: string,
  onData: (txs: Transaction[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const start = firstDayOfMonth(month);
  const end = firstDayOfMonth(nextMonth(month));
  const q = query(txCollection(uid), where("date", ">=", start), where("date", "<", end), orderBy("date", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const txs = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          date: String(data.date ?? ""),
          amount: Number(data.amount ?? 0),
          type: (data.type ?? "expense") as Transaction["type"],
          category: String(data.category ?? "Sin categoría"),
          note: data.note ? String(data.note) : "",
          createdAt: typeof data.createdAt === "number" ? data.createdAt : undefined,
        } satisfies Transaction;
      });
      onData(txs);
    },
    (e) => onError?.(e as Error)
  );
}
