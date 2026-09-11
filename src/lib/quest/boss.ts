/* =============================================================================
 * BOSS FIGHT ENGINE
 * -----------------------------------------------------------------------------
 * Builds each lesson's boss question pool from that lesson's own config content
 * (vocabulary, grammar patterns/examples and the `boss` array) plus review
 * questions from earlier lessons. Five question TYPES are generated so the fight
 * mixes recall, grammar and listening. No lesson content is hardcoded here.
 * ============================================================================= */
import { shuffle } from "./fx";
import { BOSS_FIGHT_DEFAULTS, type Lesson, type BossFightConfig } from "./config";

export type BossQuestionKind = "meaning" | "reverse" | "fill" | "error" | "listen";

export type BossQuestion = {
  key: string;
  kind: BossQuestionKind;
  label: string;
  prompt: string;
  options: string[];
  answer: string;
  /** Sentence the app should speak for listening questions. */
  speak?: string;
  hint: string;
  review: boolean;
};

const LABELS: Record<BossQuestionKind, string> = {
  meaning: "What does it mean? 📚",
  reverse: "Name the thing 🔎",
  fill: "Fill the gap 🧩",
  error: "Spot the fix 🔧",
  listen: "Listen and pick 👂",
};

/**
 * Clues NARROW the choice, they never hand over the answer. Short answers (like
 * "is" / "are") would be given away by a letter count, so they get a
 * say-it-out-loud nudge instead of spelling information.
 */
function firstLetterHint(answer: string) {
  const clean = answer.trim();
  const letters = clean.replace(/[^a-zA-Z]/g, "").length;
  if (letters <= 4) return "Say each choice out loud with the whole sentence — only one of them sounds right.";
  return `It starts with "${clean[0]?.toUpperCase()}" and has ${letters} letters.`;
}

function pick<T>(items: T[], count: number, exclude: (i: T) => boolean = () => false): T[] {
  return shuffle(items.filter((i) => !exclude(i))).slice(0, count);
}

function optionSet(answer: string, distractors: string[], size = 4): string[] {
  const seen = new Set([answer]);
  const out = [answer];
  for (const d of distractors) {
    if (out.length >= size) break;
    if (!d || seen.has(d)) continue;
    seen.add(d);
    out.push(d);
  }
  return shuffle(out);
}

const FALLBACK_VERBS = ["is", "are", "am", "have", "has", "don't have", "do", "does"];

/** Every question this lesson can contribute, tagged with `review`. */
function poolFor(lesson: Lesson, review: boolean): BossQuestion[] {
  const out: BossQuestion[] = [];
  const words = lesson.vocabulary;
  const tag = `l${lesson.number}`;

  // (a) word → meaning
  for (const w of words) {
    out.push({
      key: `${tag}-meaning-${w.word}`,
      kind: "meaning",
      label: LABELS.meaning,
      prompt: `What does "${w.word}" mean?`,
      options: optionSet(
        w.meaning,
        pick(words, 3, (o) => o.word === w.word).map((o) => o.meaning),
      ),
      answer: w.meaning,
      hint: `Think of the ${w.emoji} picture on the word card.`,
      review,
    });
    // (b) meaning / picture → word (reverse recall)
    out.push({
      key: `${tag}-reverse-${w.word}`,
      kind: "reverse",
      label: LABELS.reverse,
      prompt: `${w.emoji} Which word means "${w.meaning}"?`,
      options: optionSet(
        w.word,
        pick(words, 3, (o) => o.word === w.word).map((o) => o.word),
      ),
      answer: w.word,
      hint: firstLetterHint(w.word),
      review,
    });
  }

  const verbs = lesson.grammar.patterns.map((p) => p.verb).filter((v): v is string => Boolean(v));

  // (c) grammar fill-in — blank the doing word in a lesson pattern
  for (const p of lesson.grammar.patterns) {
    if (!p.subject || !p.verb || !p.rest) continue;
    out.push({
      key: `${tag}-fill-${p.subject}-${p.rest}`,
      kind: "fill",
      label: LABELS.fill,
      prompt: `${p.subject} ___ ${p.rest}`,
      options: optionSet(p.verb, [...shuffle(verbs.filter((v) => v !== p.verb)), ...FALLBACK_VERBS]),
      answer: p.verb,
      hint: "Say the whole sentence out loud with each choice — which one sounds right?",
      review,
    });

    // (d) find-the-error — same pattern with the wrong doing word, pick the good sentence
    const good = `${p.subject} ${p.verb} ${p.rest}`;
    // Wrong choices come from THIS lesson's own doing words first, so the mistake
    // is always a mix-up inside the lesson's grammar target. Generic fallbacks are
    // only used when the lesson itself doesn't offer enough alternatives.
    const ownWrong = shuffle(verbs.filter((v) => v !== p.verb));
    const badVerbs = [...ownWrong, ...FALLBACK_VERBS.filter((v) => v !== p.verb && !verbs.includes(v))].slice(0, 4);
    const [shown, ...others] = badVerbs;
    if (shown && others.length >= 2) {
      out.push({
        key: `${tag}-error-${p.subject}-${p.rest}`,
        kind: "error",
        label: LABELS.error,
        prompt: `Oops! "${p.subject} ${shown} ${p.rest}" has one mistake. Which sentence is correct?`,
        options: optionSet(good, others.map((v) => `${p.subject} ${v} ${p.rest}`)),
        answer: good,
        hint: "Only the middle word changes. Read each sentence out loud and listen for the one that sounds right.",
        review,
      });
    }
  }

  // (e) listening — the app says a sentence, learner picks the one they heard
  const examples = [...lesson.grammar.examples, ...lesson.expressions.map((e) => e.answer)];
  for (const sentence of examples) {
    if (examples.length < 3) break;
    out.push({
      key: `${tag}-listen-${sentence}`,
      kind: "listen",
      label: LABELS.listen,
      prompt: "Tap 🔊, then choose the sentence you heard.",
      options: optionSet(sentence, pick(examples, 3, (s) => s === sentence)),
      answer: sentence,
      speak: sentence,
      hint: "Tap 🔊 again — listen for the first two words.",
      review,
    });
  }

  // Existing hand-written boss questions from the lesson config
  for (const item of lesson.boss) {
    out.push({
      key: `${tag}-config-${item.question}`,
      kind: "fill",
      label: LABELS.fill,
      prompt: item.question,
      options: shuffle(item.options),
      answer: item.answer,
      hint: firstLetterHint(item.answer),
      review,
    });
  }

  return out;
}

export function bossConfig(lesson: Lesson): Required<BossFightConfig> {
  return { ...BOSS_FIGHT_DEFAULTS, ...(lesson.bossFight ?? {}) };
}

/**
 * Build today's fight: a mix of question types from this lesson plus at least
 * `reviewQuestions` from earlier lessons (spaced repetition), never fewer than
 * `minQuestions` in total as long as the content allows.
 */
export function buildFight(lesson: Lesson, allLessons: Lesson[]): BossQuestion[] {
  const cfg = bossConfig(lesson);
  const earlier = allLessons.filter((l) => l.number < lesson.number);
  const reviewPool = shuffle(earlier.flatMap((l) => poolFor(l, true)));
  const reviewCount = Math.min(cfg.reviewQuestions, reviewPool.length);

  const own = poolFor(lesson, false);
  // Spread the types out: take round-robin across kinds so no single type dominates.
  const byKind = new Map<BossQuestionKind, BossQuestion[]>();
  for (const q of shuffle(own)) {
    const list = byKind.get(q.kind) ?? [];
    list.push(q);
    byKind.set(q.kind, list);
  }
  const ordered: BossQuestion[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const list of byKind.values()) {
      const next = list.shift();
      if (next) {
        ordered.push(next);
        added = true;
      }
    }
  }

  const currentCount = Math.max(cfg.minQuestions - reviewCount, 1);
  return shuffle([...ordered.slice(0, currentCount), ...reviewPool.slice(0, reviewCount)]);
}
