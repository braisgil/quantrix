import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sanitizes free-text search inputs for use in ilike/LIKE queries.
// - trims, collapses whitespace
// - removes control characters
// - clamps maximum length to 100 chars
// Returns undefined for empty/meaningless input
export function sanitizeSearchQuery(input: string | null | undefined): string | undefined {
  if (!input) return undefined;
  let value = String(input);
  // Remove control chars except tab/newline
  value = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Collapse whitespace
  value = value.replace(/\s+/g, " ").trim();
  if (!value) return undefined;
  if (value.length > 100) value = value.slice(0, 100);
  return value;
}

// Builds a safe ILIKE pattern for Postgres:
// - Normalizes unicode to NFKC
// - Trims and collapses whitespace
// - Clamps length
// - Escapes %, _ and \\ so user input is treated literally
// - Wraps with leading/trailing % for contains-style search
export function buildIlikePattern(input: string | null | undefined, maxLen = 100): string | undefined {
  if (!input) return undefined;
  let value = String(input)
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
  if (!value) return undefined;
  if (value.length > maxLen) value = value.slice(0, maxLen);
  // Escape wildcard chars and backslash for LIKE/ILIKE semantics
  value = value.replace(/[_%\\]/g, (c) => `\\${c}`);
  return `%${value}%`;
}

// Minimal alternative: just clamp and trim (useful when allowing wildcards)
export function clampQuery(input?: string | null, maxLen = 100): string | undefined {
  const v = input?.trim();
  if (!v) return undefined;
  return v.length > maxLen ? v.slice(0, maxLen) : v;
}
