export function isIncludeLink(str: string, whitelist: string[] = []): boolean {
  for (let key of whitelist) {
    if (str.includes(key)) return false;
  }
  const links = ["http://", "https://"];
  return links.map((l) => str.includes(l) && str.length > 7).includes(true);
}
