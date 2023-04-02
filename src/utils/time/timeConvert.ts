export function timeConvert(date: string): number | undefined {
  const datesNumber = {
    s: 1,
    min: 60,
    h: 3600,
    d: 86400,
    w: 86400 * 7,
    m: 86400 * 30,
    y: 86400 * 30 * 365,
  };
  let res = 0;
  const dates = Object.keys(datesNumber);
  const splited = date.split(" ");

  const regex = /[a-z]/gi;

  for (let i = splited.length - 1; i >= 0; i--) {
    const key = splited[i];
    let numbers = key.substring(0, key.length - 1);
    let value = key.substring(key.length - 1, key.length);
    if (numbers.match(regex)) {
      numbers = key.substring(0, key.length - 3);
      value = key.substring(key.length - 3, key.length);
    }

    if (!dates.includes(value)) {
      return undefined;
    } else {
      res += datesNumber[value as keyof typeof datesNumber] * +numbers;
    }
  }

  return +res;
}
