import clsx, { type ClassValue } from "clsx";

/**
 * Merge conditional className values into a single string.
 * Thin wrapper around clsx — kept as a named export so components
 * import a stable `cn` helper regardless of the underlying lib.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
