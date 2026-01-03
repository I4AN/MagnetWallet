import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";

type SalaryDoc = {
  amount?: number;
  month?: string;
  updatedAt?: number;
};

function salaryDoc(uid: string, month: string) {
  return doc(db, "users", uid, "salaryByMonth", month);
}

export function subscribeMonthlySalary(
  uid: string,
  month: string,
  onData: (salary: number | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    salaryDoc(uid, month),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const data = snap.data() as SalaryDoc;
      const value = Number(data.amount);
      onData(Number.isFinite(value) ? value : null);
    },
    (e) => onError?.(e as Error)
  );
}

export async function setMonthlySalary(uid: string, month: string, amount: number) {
  await setDoc(
    salaryDoc(uid, month),
    {
      amount,
      month,
      updatedAt: Date.now(),
      updatedAtServer: serverTimestamp(),
    },
    { merge: true }
  );
}
