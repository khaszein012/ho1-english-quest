import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import type { Lesson } from "./config.ts";
import { assertValidLessons, validateLessons } from "./config-validator.ts";

/** The smallest lesson that passes every invariant — copy, then break one rule per test. */
function baseLesson(): Lesson {
  return {
    id: "test-lesson",
    number: 1,
    title: "Test Lesson",
    subtitle: "Sub",
    emoji: "🧪",
    sentenceFrames: ["I have a ___."],
    speedRoundSeconds: 10,
    vocabulary: [
      { word: "pen", meaning: "a tool for writing in ink", example: "I have a pen.", emoji: "🖊️" },
      {
        word: "ruler",
        meaning: "a straight tool for lines",
        example: "I have a ruler.",
        emoji: "📏",
      },
    ],
    grammar: {
      title: "Have",
      explanation: "Use have.",
      patterns: [{ subject: "I", verb: "have", rest: "a pen." }],
      examples: ["I have a pen.", "I have two rulers.", "Do you have a pen?"],
      yourTurn: [{ question: "I ___ a pen.", options: ["have", "has"], answer: "have" }],
    },
    expressions: [{ prompt: "What do you have?", answer: "I have a pen." }],
    practice: { title: "Backpack Check", instructions: "Say it." },
    reading: {
      title: "Story",
      paragraphs: ["I have a blue pen. My pen is new."],
      questions: [
        { question: "What colour is the pen?", options: ["blue", "red", "green"], answer: "blue" },
      ],
      spotlight: {
        sound: "short E",
        exampleWord: "pen",
        instruction: "Find them!",
        words: ["pen"],
      },
    },
    rolePlay: {
      title: "Talk",
      conversation: {
        title: "Scene",
        scene: "Two friends talk.",
        image: "scene.jpg",
        imageAlt: "Two friends.",
        roles: ["Dito", "Sari"],
        lines: [
          { role: 1, text: "What do you have?" },
          { role: 0, text: "I have a pen." },
        ],
      },
      prompts: [],
      twists: [],
      homework: "Record your bag.",
    },
    selfCheck: ["Can I say what I have?"],
    boss: [{ question: "I ___ a pen.", options: ["have", "has"], answer: "have" }],
    sticker: { name: "Test Sticker", emoji: "🧪" },
  };
}

const paths = (lesson: Lesson) => validateLessons([lesson]).map((issue) => issue.message);

describe("validateLessons accepts a fully valid lesson", () => {
  test("no issues for the baseline fixture", () => {
    assert.deepEqual(validateLessons([baseLesson()]), []);
  });

  test("assertValidLessons does not throw", () => {
    assert.doesNotThrow(() => assertValidLessons([baseLesson()]));
  });
});

describe("validateLessons catches broken content", () => {
  test("quiz answer must be one of the options", () => {
    const lesson = baseLesson();
    lesson.boss[0]!.answer = "am";
    assert.ok(paths(lesson).some((m) => m.includes('answer "am" is not in options')));
  });

  test("comprehension answers must appear in the passage", () => {
    const lesson = baseLesson();
    lesson.reading.questions[0]!.answer = "red";
    assert.ok(paths(lesson).some((m) => m.includes('answer "red" does not appear in the passage')));
  });

  test("word-hunt targets must appear in the passage", () => {
    const lesson = baseLesson();
    lesson.reading.spotlight.words = ["elephant"];
    assert.ok(paths(lesson).some((m) => m.includes('word-hunt target "elephant"')));
  });

  test("conversation roles must alternate", () => {
    const lesson = baseLesson();
    lesson.rolePlay.conversation.lines[1]!.role = 1;
    assert.ok(paths(lesson).some((m) => m.includes("roles should alternate")));
  });

  test("grammar patterns need a verb unless they are Is she/Is he/Are they questions", () => {
    const plain = baseLesson();
    plain.grammar.patterns[0]!.verb = "";
    assert.ok(paths(plain).some((m) => m.includes("verb is required")));

    const question = baseLesson();
    question.grammar.patterns[0] = { subject: "Is she", verb: "", rest: "your mother?" };
    assert.deepEqual(validateLessons([question]), []);
  });

  test("listening questions need at least three grammar examples", () => {
    const lesson = baseLesson();
    lesson.grammar.examples = ["I have a pen."];
    assert.ok(paths(lesson).some((m) => m.includes("at least three examples")));
  });

  test("duplicate vocabulary words are reported", () => {
    const lesson = baseLesson();
    lesson.vocabulary[1]!.word = "pen";
    assert.ok(paths(lesson).some((m) => m.includes("duplicate vocabulary word")));
  });

  test("duplicate lesson ids are reported", () => {
    const issues = validateLessons([baseLesson(), baseLesson()]);
    assert.ok(issues.some((issue) => issue.message === "duplicate lesson id"));
  });

  test("units after the first need a PIN", () => {
    const locked = baseLesson();
    locked.number = 2;
    assert.ok(paths(locked).some((m) => m.includes("need a PIN")));
    locked.pin = "2468";
    assert.ok(!paths(locked).some((m) => m.includes("PIN")));
  });

  test("two units cannot share a PIN", () => {
    const a = baseLesson();
    a.number = 2;
    a.id = "test-lesson-2";
    a.pin = "2468";
    const b = baseLesson();
    b.number = 3;
    b.id = "test-lesson-3";
    b.pin = "2468";
    const issues = validateLessons([a, b]);
    assert.ok(issues.some((issue) => issue.message.includes("share the PIN")));
  });

  test("session plan minutes must sum to plannedMinutes", () => {
    const lesson = baseLesson();
    lesson.plannedMinutes = 75;
    lesson.sessionPlan = [
      { label: "Games", minutes: 60 },
      { label: "Wrap-up", minutes: 15 },
    ];
    assert.deepEqual(validateLessons([lesson]), []);
    lesson.sessionPlan[1]!.minutes = 10;
    assert.ok(
      paths(lesson).some((m) =>
        m.includes("session plan totals 70 minutes but plannedMinutes is 75"),
      ),
    );
  });

  test("assertValidLessons lists every issue when it throws", () => {
    const lesson = baseLesson();
    lesson.boss[0]!.answer = "am";
    lesson.reading.questions[0]!.answer = "red";
    assert.throws(
      () => assertValidLessons([lesson]),
      (error: Error) => {
        assert.match(error.message, /2 issues/);
        assert.match(error.message, /answer "am" is not in options/);
        assert.match(error.message, /answer "red" does not appear in the passage/);
        return true;
      },
    );
  });
});
