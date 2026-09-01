export function formatAreaCode(code: string, isLegacy: boolean): string {
  return isLegacy ? `MSM-${code}` : code;
}