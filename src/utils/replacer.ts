interface replaceI {
  label: string;
  value: string;
}

export function replacer(str: string, replace: replaceI[]): string {
  let res = str;
  for (let key of replace) {
    const regexp = new RegExp(key.label, "g");
    res = res.replace(regexp, key.value);
  }
  return res;
}
