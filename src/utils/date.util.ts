export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function diffInDays(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function isDateInPast(date: Date): boolean {
  return date < new Date();
}

export function isValidDateRange(checkIn: Date, checkOut: Date): boolean {
  return checkOut > checkIn;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function toStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}