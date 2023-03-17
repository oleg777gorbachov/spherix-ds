export function timeConvert(date: string): number {
  const dates = ["s", "min", "h", "d", "m", "y"];
  const datesNumber = {
    s: 1,
    h: 3600,
    d: 86400,
    m: 86400 * 30,
    y: 86400 * 30 * 365,
  };
  const numbers = date.substring(0, date.length - 1);
  const id = date.substring(date.length - 1, date.length);
  if (dates.includes(id)) {
    return +numbers * datesNumber[id as keyof typeof datesNumber];
  }
  if (date.includes("min")) {
    return +date.substring(0, date.length - 3) * 60;
  }
  if (Number.isNaN(+date)) {
    return 1;
  }
  return +date;
}
