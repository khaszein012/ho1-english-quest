import { describe, expect, test } from "bun:test";
import { DEFAULT_STUDENT_NAME, normalizeStudentName } from "./profile";

describe("customizable student name", () => {
  test("old saved progress without a name retains the existing student", () => {
    expect(normalizeStudentName(undefined)).toBe("Arsyad");
  });
  test("saves the student's chosen name rather than the default", () => {
    expect(normalizeStudentName("  Maya   Putri  ")).toBe("Maya Putri");
    expect(normalizeStudentName("محمد")).toBe("محمد");
  });
  test("an empty name keeps a usable default", () => {
    expect(normalizeStudentName("   ")).toBe(DEFAULT_STUDENT_NAME);
  });
});