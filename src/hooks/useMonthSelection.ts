import { useEffect, useState } from "react";
import { firstDayOfMonth, inMonth, yyyyMmFromDate } from "../lib/date";

export function useMonthSelection() {
  const [month, setMonth] = useState(() => yyyyMmFromDate(new Date()));
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!inMonth(date, month)) setDate(firstDayOfMonth(month));
  }, [date, month]);

  return { month, setMonth, date, setDate };
}
