import type { ReportingPeriod } from './app-state.model';

/** First and last day of the current calendar month (ISO date strings). */
export function getCurrentMonthPeriod(): ReportingPeriod {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: toIsoDate(start),
    end: toIsoDate(end),
  };
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isDateWithinPeriod(date: string, period: ReportingPeriod): boolean {
  return date >= period.start && date <= period.end;
}
