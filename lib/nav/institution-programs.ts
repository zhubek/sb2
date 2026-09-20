// Select the same offerings for both institution pages and their summary counts.
export function institutionPrograms<T>(kind: string, details: T[], collegeFallback: T[]): T[] {
  if (kind === "v") return details;
  if (kind === "c") return details.length ? details : collegeFallback;
  return [];
}
