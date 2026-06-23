const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatDateTime(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return `${DATE_FORMATTER.format(value)} ${TIME_FORMATTER.format(value)}`;
}

export function toDateTimeLocal(date: Date | string | null): string {
  if (!date) return "";
  const value = typeof date === "string" ? new Date(date) : date;
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}
