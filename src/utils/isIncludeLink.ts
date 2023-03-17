export function isIncludeLink(str: string): boolean {
  const links = ["http://", "https://"];
  return links.map((l) => str.includes(l) && str.length > 7).includes(true);
}
