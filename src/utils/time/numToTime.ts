export function numToTime(num: number): string {
  const datesNumber = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    month: 86400 * 30,
    year: 86400 * 30 * 365,
  };
  let res = "";
  while (num !== 0) {
    for (let key of Object.entries(datesNumber).reverse()) {
      const number = key[1];
      const name = key[0];
      const math = Math.floor(num / number);
      if (math >= 2) {
        res += `${math} ${name}s `;
        num -= number * math;
      } else if (math === 1) {
        res += `${math} ${name} `;
        num -= number * math;
      }
    }
  }
  return res;
}

export const a = 2;
