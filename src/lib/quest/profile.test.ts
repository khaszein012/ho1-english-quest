import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { DEFAULT_STUDENT_NAME, normalizeStudentName } from "./profile.ts";

describe("customizable student name", () => {
  test("old saved progress without a name retains the existing student", () => {
    assert.equal(normalizeStudentName(undefined), "Arsyad");
  });
  test("saves the student's chosen name rather than the default", () => {
    assert.equal(normalizeStudentName("  Maya   Putri  "), "Maya Putri");
    assert.equal(normalizeStudentName("محمد"), "محمد");
  });
  test("an empty name keeps a usable default", () => {
    assert.equal(normalizeStudentName("   "), DEFAULT_STUDENT_NAME);
  });
});
