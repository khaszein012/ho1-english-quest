import { LESSONS, TEACHER_PIN, type Lesson } from "./config";
import { A1_LESSONS } from "./config-a1";

export type { Lesson };
export type CourseLevel = "a1" | "a2";

/** Both courses, keyed by level. Switching keeps each course's progress
 * separate because lesson ids are prefixed per course ("a1-…"). */
export const COURSES: Record<CourseLevel, Lesson[]> = {
  a1: A1_LESSONS,
  a2: LESSONS,
};

export const COURSE_LABEL: Record<CourseLevel, string> = {
  a1: "LEVEL A1 · FIRST WORDS",
  a2: "LEVEL A2 · GRAMMAR & READING",
};

export function lessonsFor(level: CourseLevel): Lesson[] {
  return COURSES[level];
}

/** Every lesson from every course — for profile lookups that must work
 * regardless of the course currently selected. */
export const ALL_LESSONS: Lesson[] = [...A1_LESSONS, ...LESSONS];

// The tutor code must never match a unit PIN in any course.
if (ALL_LESSONS.some((l) => l.pin === TEACHER_PIN)) {
  throw new Error("TEACHER_PIN must be different from every unit PIN");
}
