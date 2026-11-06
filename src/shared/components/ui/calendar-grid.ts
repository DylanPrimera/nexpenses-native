import { dayjs } from "@/core/utils/dates";

export type CalendarDay = {
  key: string;
  day: number;
  outside: boolean;
};

const DAY_FORMAT = "YYYY-MM-DD";

export function monthKey(value?: string) {
  const parsed = value ? dayjs(value.slice(0, 10)) : dayjs();
  return (parsed.isValid() ? parsed : dayjs()).startOf("month").format(DAY_FORMAT);
}

export function shiftMonth(month: string, amount: number) {
  return dayjs(month).add(amount, "month").startOf("month").format(DAY_FORMAT);
}

export function buildMonthGrid(month: string): CalendarDay[] {
  const first = dayjs(month).startOf("month");
  const offset = (first.day() + 6) % 7;
  const start = first.subtract(offset, "day");
  return Array.from({ length: 42 }, (_, index) => {
    const date = start.add(index, "day");
    return { key: date.format(DAY_FORMAT), day: date.date(), outside: date.month() !== first.month() };
  });
}

const FIRST_MONDAY = "2024-01-01";

export function weekdayLabels() {
  return Array.from({ length: 7 }, (_, index) => dayjs(FIRST_MONDAY).add(index, "day").format("dd"));
}

export function monthCaption(month: string) {
  return dayjs(month).format("MMMM YYYY");
}

export function isDayDisabled(key: string, minDate?: string, maxDate?: string) {
  if (minDate && key < minDate.slice(0, 10)) return true;
  if (maxDate && key > maxDate.slice(0, 10)) return true;
  return false;
}

export function todayKey() {
  return dayjs().format(DAY_FORMAT);
}

export function formatPickedDate(value: string) {
  const parsed = dayjs(value.slice(0, 10));
  return parsed.isValid() ? parsed.format("D MMM YYYY").replace(/\./g, "") : "";
}
