import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { setMonthlySalary, subscribeMonthlySalary } from "../services/salary";

export function useMonthlySalary(user: User | null, month: string) {
  const [salary, setSalary] = useState<number | null>(null);
  const [salaryInput, setSalaryInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSalary(null);
      setSalaryInput("");
      return;
    }
    setError(null);
    const unsub = subscribeMonthlySalary(
      user.uid,
      month,
      (value) => {
        setSalary(value);
        setSalaryInput(value === null ? "" : String(value));
      },
      (e) => setError(e.message)
    );
    return () => unsub();
  }, [user, month]);

  const saveSalary = useCallback(async () => {
    if (!user) return false;
    setError(null);

    const raw = salaryInput.trim();
    const value = Number(raw);
    if (!raw || !Number.isFinite(value) || value < 0) {
      setError("El salario debe ser 0 o mayor.");
      return false;
    }

    try {
      await setMonthlySalary(user.uid, month, value);
      return true;
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar el salario.");
      return false;
    }
  }, [month, salaryInput, user]);

  return { salary, salaryInput, setSalaryInput, saveSalary, error };
}
