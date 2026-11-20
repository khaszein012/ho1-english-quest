import type { Lesson, QuizItem } from "./config";

export type LessonValidationIssue = {
  lessonId: string;
  path: string;
  message: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function answerAppearsInPassage(answer: string, passage: string) {
  const answerText = normalize(answer).replace(/^a /, "");
  const passageText = normalize(passage);
  return answerText.length > 0 && passageText.includes(answerText);
}

function targetAppearsInPassage(target: string, passage: string) {
  const targetText = normalize(target);
  const passageText = normalize(passage);
  if (!targetText) return false;
  return passageText.includes(targetText) || passageText.includes(targetText.replace(/s$/, ""));
}

function checkQuizItem(
  item: QuizItem,
  path: string,
  issues: LessonValidationIssue[],
  lessonId: string,
) {
  if (!item.question.trim()) issues.push({ lessonId, path, message: "question is empty" });
  if (item.options.length < 2)
    issues.push({ lessonId, path, message: "needs at least two options" });
  if (!item.options.includes(item.answer)) {
    issues.push({ lessonId, path, message: `answer "${item.answer}" is not in options` });
  }
}

/**
 * Validate content invariants that components and generated boss questions rely on.
 * This is intentionally data-only: it can run in CI without a browser or DOM.
 */
export function validateLessons(lessons: Lesson[]): LessonValidationIssue[] {
  const issues: LessonValidationIssue[] = [];
  const ids = new Set<string>();
  const pins = new Map<string, string>();

  lessons.forEach((lesson, lessonIndex) => {
    const path = `LESSONS[${lessonIndex}]`;
    if (ids.has(lesson.id))
      issues.push({ lessonId: lesson.id, path: `${path}.id`, message: "duplicate lesson id" });
    ids.add(lesson.id);

    // Units after the first are PIN-locked: each needs its own code.
    if (lesson.number > 1 && !lesson.pin?.trim()) {
      issues.push({
        lessonId: lesson.id,
        path: `${path}.pin`,
        message: "locked lessons (number > 1) need a PIN",
      });
    }
    if (lesson.number > 1 && lesson.pin?.trim()) {
      const pinKey = lesson.pin.trim().toLowerCase();
      if (pins.has(pinKey)) {
        issues.push({
          lessonId: lesson.id,
          path: `${path}.pin`,
          message: `two lessons share the PIN "${lesson.pin.trim()}" (also used by ${pins.get(pinKey)})`,
        });
      } else {
        pins.set(pinKey, lesson.id);
      }
    }

    if (!lesson.title.trim())
      issues.push({ lessonId: lesson.id, path: `${path}.title`, message: "title is empty" });
    if (lesson.vocabulary.length === 0) {
      issues.push({
        lessonId: lesson.id,
        path: `${path}.vocabulary`,
        message: "needs at least one vocabulary word",
      });
    }

    const words = new Set<string>();
    lesson.vocabulary.forEach((word, index) => {
      const wordPath = `${path}.vocabulary[${index}]`;
      const key = normalize(word.word);
      if (!key)
        issues.push({ lessonId: lesson.id, path: `${wordPath}.word`, message: "word is empty" });
      if (words.has(key))
        issues.push({
          lessonId: lesson.id,
          path: `${wordPath}.word`,
          message: "duplicate vocabulary word",
        });
      words.add(key);
      if (!word.meaning.trim())
        issues.push({
          lessonId: lesson.id,
          path: `${wordPath}.meaning`,
          message: "meaning is empty",
        });
      if (!word.example.trim())
        issues.push({
          lessonId: lesson.id,
          path: `${wordPath}.example`,
          message: "example is empty",
        });
    });

    lesson.grammar.patterns.forEach((pattern, index) => {
      const patternPath = `${path}.grammar.patterns[${index}]`;
      const subject = pattern.subject?.trim() ?? "";
      const verb = pattern.verb?.trim() ?? "";
      const rest = pattern.rest?.trim() ?? "";
      const allowedQuestionPattern = /^(Is she|Is he|Are they)$/.test(subject);
      if (!subject || !rest || (!verb && !allowedQuestionPattern)) {
        issues.push({
          lessonId: lesson.id,
          path: patternPath,
          message:
            "subject and rest are required; verb is required except for Is she/Is he/Are they question patterns",
        });
      }
    });
    if (lesson.grammar.examples.length < 3) {
      issues.push({
        lessonId: lesson.id,
        path: `${path}.grammar.examples`,
        message: "needs at least three examples for listening questions",
      });
    }
    lesson.grammar.yourTurn.forEach((item, index) =>
      checkQuizItem(item, `${path}.grammar.yourTurn[${index}]`, issues, lesson.id),
    );

    lesson.expressions.forEach((expression, index) => {
      if (!expression.prompt.trim() || !expression.answer.trim()) {
        issues.push({
          lessonId: lesson.id,
          path: `${path}.expressions[${index}]`,
          message: "prompt and answer must be non-empty",
        });
      }
    });

    if (lesson.reading.paragraphs.length === 0 && !lesson.reading.placeholder?.trim()) {
      issues.push({
        lessonId: lesson.id,
        path: `${path}.reading`,
        message: "empty passage needs a placeholder",
      });
    }
    const passage = lesson.reading.paragraphs.join(" ");
    lesson.reading.questions.forEach((item, index) => {
      const questionPath = `${path}.reading.questions[${index}]`;
      checkQuizItem(item, questionPath, issues, lesson.id);
      if (passage && !answerAppearsInPassage(item.answer, passage)) {
        issues.push({
          lessonId: lesson.id,
          path: questionPath,
          message: `answer "${item.answer}" does not appear in the passage`,
        });
      }
    });
    if (lesson.reading.spotlight.mode !== "sound_sort" && passage) {
      lesson.reading.spotlight.words.forEach((word) => {
        if (!targetAppearsInPassage(word, passage)) {
          issues.push({
            lessonId: lesson.id,
            path: `${path}.reading.spotlight`,
            message: `word-hunt target "${word}" does not appear in the passage`,
          });
        }
      });
    }

    const roles = lesson.rolePlay.conversation.roles;
    if (roles.length !== 2) {
      issues.push({
        lessonId: lesson.id,
        path: `${path}.rolePlay.conversation.roles`,
        message: "conversation needs exactly two roles",
      });
    }
    lesson.rolePlay.conversation.lines.forEach((line, index) => {
      if (index > 0 && line.role === lesson.rolePlay.conversation.lines[index - 1]?.role) {
        issues.push({
          lessonId: lesson.id,
          path: `${path}.rolePlay.conversation.lines[${index}]`,
          message: "conversation roles should alternate",
        });
      }
      if (!line.text.trim())
        issues.push({
          lessonId: lesson.id,
          path: `${path}.rolePlay.conversation.lines[${index}]`,
          message: "line is empty",
        });
    });

    lesson.boss.forEach((item, index) =>
      checkQuizItem(item, `${path}.boss[${index}]`, issues, lesson.id),
    );
    if (lesson.bossPersona) {
      if (
        lesson.bossPersona.hurt.length === 0 ||
        lesson.bossPersona.taunt.length === 0 ||
        lesson.bossPersona.phases.length < 2
      ) {
        issues.push({
          lessonId: lesson.id,
          path: `${path}.bossPersona`,
          message: "needs hurt, taunt and two phase lines",
        });
      }
    }

    if (lesson.plannedMinutes !== undefined) {
      if (
        !Number.isInteger(lesson.plannedMinutes) ||
        lesson.plannedMinutes < 15 ||
        lesson.plannedMinutes > 180
      ) {
        issues.push({
          lessonId: lesson.id,
          path: `${path}.plannedMinutes`,
          message: "plannedMinutes must be a whole number between 15 and 180",
        });
      }
    }
    if (lesson.sessionPlan) {
      if (lesson.sessionPlan.length === 0) {
        issues.push({
          lessonId: lesson.id,
          path: `${path}.sessionPlan`,
          message: "session plan needs at least one block",
        });
      }
      lesson.sessionPlan.forEach((block, index) => {
        const blockPath = `${path}.sessionPlan[${index}]`;
        if (!block.label.trim())
          issues.push({ lessonId: lesson.id, path: blockPath, message: "label is empty" });
        if (!Number.isInteger(block.minutes) || block.minutes <= 0)
          issues.push({
            lessonId: lesson.id,
            path: blockPath,
            message: "minutes must be a positive whole number",
          });
      });
      if (lesson.plannedMinutes !== undefined) {
        const total = lesson.sessionPlan.reduce((sum, block) => sum + block.minutes, 0);
        if (total !== lesson.plannedMinutes) {
          issues.push({
            lessonId: lesson.id,
            path: `${path}.sessionPlan`,
            message: `session plan totals ${total} minutes but plannedMinutes is ${lesson.plannedMinutes}`,
          });
        }
      }
    }
  });

  return issues;
}

export function assertValidLessons(lessons: Lesson[]) {
  const issues = validateLessons(lessons);
  if (issues.length > 0) {
    const detail = issues
      .map((issue) => `${issue.lessonId} ${issue.path}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Lesson config validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):\n${detail}`,
    );
  }
}
