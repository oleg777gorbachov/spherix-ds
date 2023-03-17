export function isColor(color: string): boolean {
  if (color.match(/[0-9A-Fa-f]{6}/g)) return true;
  return false;
}
