export function yyyyMmFromDate(date: Date) {
  return date.toISOString().slice(0, 7);
}

export function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function firstDayOfMonth(yyyyMm: string) {
  return `${yyyyMm}-01`;
}

export function nextMonth(yyyyMm: string) {
  const [year, month] = yyyyMm.split("-").map(Number);
  const next = new Date(year, month, 1);
  return `${next.getFullYear()}-${pad2(next.getMonth() + 1)}`;
}

export function inMonth(dateStr: string, yyyyMm: string) {
  return dateStr.startsWith(`${yyyyMm}-`);
}
