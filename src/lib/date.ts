import { formatInTimeZone } from "date-fns-tz";

const SAO_PAULO_TIMEZONE = "America/Sao_Paulo";
const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})/;

type DateValue = string | number | Date;

function toDateForTimezone(value: DateValue): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const dateOnlyMatch = value.match(DATE_ONLY_REGEX);
  if (dateOnlyMatch && !value.includes("T")) {
    const [, year, month, day] = dateOnlyMatch;
    // Noon in UTC avoids previous/next-day shifts when formatting to a timezone.
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatInSaoPaulo(value: DateValue, formatPattern: string): string {
  const parsed = toDateForTimezone(value);
  if (!parsed) return "";
  return formatInTimeZone(parsed, SAO_PAULO_TIMEZONE, formatPattern);
}

export function formatDateInSaoPaulo(value?: string | null): string {
  if (!value) return "-";

  const dateOnlyMatch = value.match(DATE_ONLY_REGEX);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${day}/${month}/${year}`;
  }

  return formatInSaoPaulo(value, "dd/MM/yyyy") || "-";
}

export const formatDate = formatDateInSaoPaulo;

export function formatDateTimeInSaoPaulo(value: DateValue): string {
  return formatInSaoPaulo(value, "dd/MM/yyyy HH:mm:ss") || "-";
}

export function toDateInputValueInSaoPaulo(value?: string | null): string {
  if (!value) return "";

  const dateOnlyMatch = value.match(DATE_ONLY_REGEX);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${year}-${month}-${day}`;
  }

  return formatInSaoPaulo(value, "yyyy-MM-dd");
}

export function todayDateInputInSaoPaulo(): string {
  return formatInSaoPaulo(new Date(), "yyyy-MM-dd");
}
