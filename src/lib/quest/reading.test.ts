import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { splitSentences } from "./reading.ts";

const texts = (paragraphs: string[]) => splitSentences(paragraphs).map((s) => s.text);

describe("splitSentences keeps quoted dialogue whole", () => {
  test("punctuation inside quotes does not split", () => {
    assert.deepEqual(texts(['"What is it? It is a doll."']), ['"What is it? It is a doll."']);
  });

  test("curly quotes behave like straight quotes", () => {
    assert.deepEqual(texts(["“Look!” says Dito."]), ["“Look!” says Dito."]);
  });

  test("attribution stays with its quote", () => {
    assert.deepEqual(texts(["'Look!' says Dito. 'Run!'"]), ["'Look!' says Dito.", "'Run!'"]);
  });

  test("comma-attribution stays with its quote until the sentence truly ends", () => {
    assert.deepEqual(texts(["'It is my favorite old toy,' my grandfather says."]), [
      "'It is my favorite old toy,' my grandfather says.",
    ]);
  });

  test("a quoted title closes its sentence when nothing follows", () => {
    const result = texts(["The class makes a poster called 'Our Families.'"]);
    assert.deepEqual(result, ["The class makes a poster called 'Our Families.'"]);
  });

  test("apostrophes inside words never open a quote", () => {
    assert.deepEqual(texts(["Margaret doesn't have a notebook. She writes on a slate."]), [
      "Margaret doesn't have a notebook.",
      "She writes on a slate.",
    ]);
  });

  test("repeated ending punctuation stays together", () => {
    assert.deepEqual(texts(["Oh no! He fell down... then he laughed!"]), [
      "Oh no!",
      "He fell down...",
      "then he laughed!",
    ]);
  });

  test("each sentence remembers its paragraph", () => {
    const sentences = splitSentences(["One. Two.", "Three!"]);
    assert.deepEqual(
      sentences.map((s) => [s.paragraph, s.text]),
      [
        [0, "One."],
        [0, "Two."],
        [1, "Three!"],
      ],
    );
  });

  test("empty input yields no sentences", () => {
    assert.deepEqual(splitSentences([]), []);
  });
});
