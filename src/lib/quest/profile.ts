export const DEFAULT_STUDENT_NAME = "Arsyad";

/** A profile label never changes the identity or keys of saved lesson progress. */
export function normalizeStudentName(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_STUDENT_NAME;
  return value.trim().replace(/\s+/g, " ").slice(0, 40) || DEFAULT_STUDENT_NAME;
}