import dayjs from "dayjs";

export function formatDate(timestamp: number): string {
  const date = dayjs.unix(timestamp);
  return date.format("DD/MM/YYYY [às] HH:mm");
}
