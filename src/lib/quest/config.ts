/* =============================================================================
 * ARSYAD'S ENGLISH QUEST — SINGLE LESSON CONFIG FILE (COURSE LEVEL: A2)
 * -----------------------------------------------------------------------------
 * EVERY piece of lesson content the app shows lives in the LESSONS array at the
 * bottom of this file: one entry per lesson. Screens and components read from it
 * and never hardcode content.
 *
 * The lesson material follows the course book's scope (Units 1-4): the grammar
 * targets, word lists, reading titles and phonics sets below come straight from
 * the book. The "A2" adjustment lives in the DEPTH of the content — richer
 * meanings, longer natural sentences, fuller reading passages and harder game
 * tuning — never in new grammar outside the book.
 *   lesson 1 — School Things: have / don't have, Do you have…?, one vs many
 *   lesson 2 — My Toys: It is / They are + my / your
 *   lesson 3 — My Classroom: this / that / these / those + colour adjectives
 *   lesson 4 — Family and Friends: Is she…? Is he…? Are they…? + ages
 *
 * TO ADD LESSON 5 (or 6...8):
 *   1. Copy the `lesson4` object below, rename it `lesson5`.
 *   2. Change `id`, `number`, `title`, `subtitle`, `emoji` and fill in the
 *      content fields (vocabulary of ANY length, grammar, expressions,
 *      practice, reading + questions + spotlight, rolePlay + homework,
 *      selfCheck, boss, sticker).
 *   3. Append it: `export const LESSONS: Lesson[] = [lesson1, ...lesson5];`
 *   That is all. No layout or component changes are needed — the lesson picker,
 *   star dashboard, sticker album, progress screen and Boss Challenge (which
 *   automatically mixes in review questions from earlier lessons) all adapt.
 * ============================================================================= */

import schoolConversationImage from "@/assets/conversation-school.jpg";
import thingsConversationImage from "@/assets/conversation-things.jpg";
import classroomConversationImage from "@/assets/conversation-classroom.jpg";
import familyConversationImage from "@/assets/conversation-family.jpg";
import futureSchoolReadingImage from "@/assets/reading-future-school.jpg";
import grandpaToysReadingImage from "@/assets/reading-grandpa-toys.jpg";
import oneRoomSchoolReadingImage from "@/assets/reading-one-room-school.jpg";
import familiesReadingImage from "@/assets/reading-families.jpg";
import { assertValidLessons } from "./config-validator";

/**
 * The ONLY browser-storage key this app touches. The "quest_" prefix keeps it in
 * its own namespace, so the app can never read or overwrite data written by any
 * other app on the same browser. Bump the version suffix if the saved shape changes.
 * v1 held the finished A1 course; v2 is the book-scope A2-depth course from zero.
 */
export const STORAGE_KEY = "quest_arsyad_english_v2";

/** Older key from before the namespace prefix — read once, then migrated. */
export const LEGACY_STORAGE_KEYS = ["arsyad-english-quest-v1"];

export type VocabWord = {
  word: string;
  meaning: string;
  example: string;
  emoji: string;
  imagePath?: string;
  /** Small badge shown on the word card, e.g. "Always plural!". */
  tag?: string;
  /** Optional near/far distance cue for the Practice Game zoom frame (e.g. this/that lessons). */
  cue?: "near" | "far";
  /** True when the Practice Game should treat this word as MANY (these/those). */
  many?: boolean;
};

/**
 * Sound & Spelling Spotlight. Two modes:
 *  - "word_hunt"  (default): tap the target words inside the reading passage.
 *  - "sound_sort": word cards.
 *      `sortStyle: "confirm_all"` = every card is a correct example (listen-and-confirm).
 *      `sortStyle: "two_buckets"` = one card at a time, sorted into one of the two
 *      `buckets`; each card's `bucket` names the bucket id it belongs in.
 */
export type Spotlight = {
  sound: string;
  exampleWord: string;
  instruction: string;
  words: string[];
  mode?: "word_hunt" | "sound_sort";
  sortStyle?: "confirm_all" | "two_buckets";
  sortWords?: { word: string; isTarget?: boolean; emoji?: string; bucket?: string }[];
  /** Two labelled buckets, used only by `sortStyle: "two_buckets"`. */
  buckets?: { id: string; label: string }[];
  note?: string;
};

export type QuizItem = {
  question: string;
  options: string[];
  answer: string;
};

/**
 * Boss fight tuning, per lesson (all fields optional — see BOSS_FIGHT_DEFAULTS).
 * The boss has HP; a correct answer deals `hpPerHit` (more on combos and when
 * the ⚡ Super Move is armed), a miss lets the boss recover `bossRegen`
 * (`criticalRegen` while the boss is in its final third of health). The fight
 * ends only when HP reaches 0 — or the boss surrenders after `surrenderAfter`
 * attempts, so it can never be lost.
 */
export type BossFightConfig = {
  minQuestions?: number;
  hpPerHit?: number;
  bossRegen?: number;
  reviewQuestions?: number;
  maxHp?: number;
  /** Safety net: after this many total attempts the boss simply surrenders. */
  surrenderAfter?: number;
  /** Every Nth correct answer IN A ROW is a COMBO worth +`comboBonus` damage. */
  comboEvery?: number;
  comboBonus?: number;
  /** Correct answers that charge the ⚡ Super Move; an armed hit deals `superDamage`. */
  superEvery?: number;
  superDamage?: number;
  /** Boss heal on a miss while the boss is in its final third of health. */
  criticalRegen?: number;
  /** Friendly (never scary!) boss character. */
  name?: string;
  emoji?: string;
};

/** Per-boss fight personality. All lines must stay funny and friendly — never scary. */
export type BossPersona = {
  /** Shown after a correct answer (the boss just got hit). */
  hurt: string[];
  /** Shown after a miss (the boss gloats). */
  taunt: string[];
  /** Shown once when the boss weakens: [two-thirds health left, one-third left]. */
  phases: string[];
};

/** A2 fights are longer and mix in more review than the A1 course did. */
export const BOSS_FIGHT_DEFAULTS = {
  minQuestions: 15,
  hpPerHit: 10,
  bossRegen: 10,
  reviewQuestions: 3,
  maxHp: 100,
  surrenderAfter: 30,
  comboEvery: 3,
  comboBonus: 5,
  superEvery: 3,
  superDamage: 20,
  criticalRegen: 15,
  name: "Grammar Gremlin",
  emoji: "\u{1F479}",
} as const;

/** One-time star bonus for defeating a lesson boss. */
export const BOSS_WIN_BONUS = 5;

/**
 * One face in the "Family Detective 🕵️" practice game. All answers the app gives
 * are derived truthfully from these attributes — nothing is randomised.
 */
export type DetectiveFace = {
  id: string;
  name: string;
  age: number;
  emoji: string;
  gender: "female" | "male";
  /** Relation used by "Is she your mother?" style questions. */
  relation: "mother" | "father" | "grandparent" | "aunt" | "uncle" | "cousin" | "neighbor";
};

export type DetectiveConfig = {
  title: string;
  instructions: string;
  faces: DetectiveFace[];
};

export type Lesson = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  sentenceFrames: string[];
  speedRoundSeconds: number;
  vocabulary: VocabWord[];
  /**
   * Words taught in an earlier course. They join the Match It / Listen & Pick
   * pools but never count toward this lesson's words-learned bar or sticker.
   */
  reviewVocabulary?: VocabWord[];
  grammar: {
    title: string;
    explanation: string;
    /** Optional short tip chip shown on the Grammar screen (e.g. "NOW WORDS — verb + ing"). */
    tip?: string;
    patterns: { subject?: string; verb?: string; rest?: string; note?: string }[];
    examples: string[];
    yourTurn: QuizItem[];
  };
  expressions: { prompt: string; answer: string }[];
  practice: { title: string; instructions: string };
  /** Which practice game this lesson uses. Omit for the classic flip-card game. */
  practiceGame?: "flip_and_say" | "detective";
  /** Required when practiceGame is "detective". */
  detective?: DetectiveConfig;
  reading: {
    title: string;
    /** Optional story illustration; the passage and exercises stay independent. */
    illustration?: { image: string; alt: string };
    /** Leave empty and set `placeholder` while the passage is still pending. */
    paragraphs: string[];
    questions: QuizItem[];
    stretchQuestion?: string;
    /** Shown instead of the passage when `paragraphs` is empty. */
    placeholder?: string;
    spotlight: Spotlight;
  };
  rolePlay: {
    title: string;
    /** Guided conversation always comes before the independent role-play. */
    conversation: {
      title: string;
      scene: string;
      image: string;
      imageAlt: string;
      roles: [string, string];
      lines: { role: 0 | 1; text: string }[];
    };
    prompts: string[];
    twists: string[];
    homework: string;
    /** Set true to show the "Draw & Describe ✏️" sketchpad on this lesson. */
    drawAndDescribe?: boolean;
    /** Checklist shown beside the sketchpad. */
    drawChecklist?: string[];
  };
  selfCheck: string[];
  boss: QuizItem[];
  /** Optional per-lesson boss fight tuning; omit to use BOSS_FIGHT_DEFAULTS. */
  bossFight?: BossFightConfig;
  /** Optional boss personality lines; fights fall back to generic praise without them. */
  bossPersona?: BossPersona;
  sticker: { name: string; emoji: string };
};

export const LEVELS = [
  { name: "Explorer", min: 0, max: 15, emoji: "🧭" },
  { name: "Adventurer", min: 16, max: 35, emoji: "🗺️" },
  { name: "Champion", min: 36, max: 60, emoji: "🛡️" },
  { name: "Legend", min: 61, max: Infinity, emoji: "👑" },
] as const;

/** A word counts as "learned" after this many correct interactions with it. */
export const WORD_MASTERY_TARGET = 3;

/** How many lesson slots the sticker album shows (empty ones read "Coming soon"). */
export const PLANNED_LESSON_COUNT = 8;

/**
 * Game tuning. These are MAXIMUMS — every game clamps them to the actual number
 * of words/questions in a lesson, so a lesson with 3 words works exactly as well
 * as one with 12.
 */
export const GAME_TUNING = {
  matchPairsPerRound: 5,
  listenRounds: 6,
  listenOptions: 4,
  bossQuestions: 5,
  bossReviewQuestions: 2,
} as const;

export const SCREENS = [
  { id: "vocabulary", label: "Vocabulary", emoji: "📚" },
  { id: "grammar", label: "Grammar Focus", emoji: "🧩" },
  { id: "learn", label: "Learn", emoji: "💬" },
  { id: "practice", label: "Practice Game", emoji: "🎮" },
  { id: "reading", label: "Reading", emoji: "📖" },
  { id: "roleplay", label: "Role-Play", emoji: "🎭" },
  { id: "progress", label: "My Progress", emoji: "✅" },
] as const;

export type ScreenId = (typeof SCREENS)[number]["id"];

export const BOSS_REQUIRED: ScreenId[] = [
  "vocabulary",
  "grammar",
  "learn",
  "practice",
  "reading",
  "roleplay",
];

export function levelFor(totalStars: number) {
  const index = LEVELS.findIndex((l) => totalStars >= l.min && totalStars <= l.max);
  const i = index === -1 ? 0 : index;
  return { ...LEVELS[i]!, level: i + 1 };
}

/* =============================================================================
 * LESSON 1 — SCHOOL THINGS · have / don't have (book Unit 1)
 * ============================================================================= */

const lesson1: Lesson = {
  id: "lesson-1",
  number: 1,
  title: "School Things",
  subtitle: "Have / Don't Have",
  emoji: "🎒",
  sentenceFrames: ["I have a ___.", "I don't have a ___.", "Do you have a ___?"],
  speedRoundSeconds: 10,
  vocabulary: [
    {
      word: "backpack",
      meaning: "a bag you carry on your back for school",
      example: "I have a red backpack.",
      emoji: "🎒",
    },
    {
      word: "crayon",
      meaning: "a stick of coloured wax for drawing",
      example: "I have twelve crayons in my pencil case.",
      emoji: "🖍️",
    },
    {
      word: "eraser",
      meaning: "a small rubber tool for removing pencil marks",
      example: "I don't have an eraser. Can I borrow yours?",
      emoji: "🧽",
    },
    {
      word: "glue stick",
      meaning: "a tube of sticky glue for paper crafts",
      example: "Do you have a glue stick for art class?",
      emoji: "🧴",
    },
    {
      word: "lunchbox",
      meaning: "a small box for your food at school",
      example: "I have a lunchbox with two parts.",
      emoji: "🍱",
    },
    {
      word: "marker",
      meaning: "a thick pen with bright ink for big writing",
      example: "I have three markers in my bag.",
      emoji: "🖊️",
    },
    {
      word: "notebook",
      meaning: "a book with empty pages for your notes",
      example: "I have one notebook for English.",
      emoji: "📓",
    },
    {
      word: "paintbrush",
      meaning: "a brush with soft hairs for paint",
      example: "I don't have a paintbrush today.",
      emoji: "🖌️",
    },
    {
      word: "pen",
      meaning: "a tool for writing in ink",
      example: "I have three blue pens.",
      emoji: "🖊️",
    },
    {
      word: "pencil",
      meaning: "a tool for writing in grey lead",
      example: "I have five pencils and one pen.",
      emoji: "✏️",
    },
    {
      word: "pencil case",
      meaning: "a small bag for pens and pencils",
      example: "My pencil case has my name on it.",
      emoji: "🧰",
    },
    {
      word: "pencil sharpener",
      meaning: "a small tool that makes a pencil pointy again",
      example: "Do you have a pencil sharpener? My pencil is flat!",
      emoji: "⚙️",
    },
    {
      word: "ruler",
      meaning: "a straight tool for measuring and drawing lines",
      example: "I have a ruler for Math class.",
      emoji: "📏",
    },
    {
      word: "stapler",
      meaning: "a tool that joins papers together",
      example: "I don't have a stapler. The teacher has one.",
      emoji: "📎",
    },
    {
      word: "tape",
      meaning: "a sticky roll for sticking paper together",
      example: "Do you have tape for my poster?",
      emoji: "🩹",
      tag: "Uncountable!",
    },
    {
      word: "textbook",
      meaning: "a big book you study from in class",
      example: "I have one textbook for every subject.",
      emoji: "📕",
    },
  ],
  grammar: {
    title: "Have / Don't Have",
    explanation:
      "Use have to say what is yours, and don't have for what is not. Ask a friend with Do you have…? — answer Yes, I do. / No, I don't. One thing takes no -s; more than one thing adds -s: one pen, five pens.",
    tip: "💛 OWN IT — have / don't have",
    patterns: [
      { subject: "I", verb: "have", rest: "a backpack.", note: "one thing → a" },
      { subject: "I", verb: "don't have", rest: "a stapler.", note: "don't = do not" },
      { subject: "Do you", verb: "have", rest: "a ruler?", note: "Yes, I do. / No, I don't." },
      { subject: "I", verb: "have", rest: "ONE pen.", note: "one thing → no -s" },
      { subject: "I", verb: "have", rest: "FIVE pens.", note: "more than one → add -s" },
    ],
    examples: [
      "I have a blue pencil case.",
      "I don't have a stapler, but the teacher has one.",
      "Do you have a glue stick? — Yes, I do!",
      "I have one eraser and three crayons.",
    ],
    yourTurn: [
      { question: "I ___ a backpack.", options: ["have", "has", "having"], answer: "have" },
      {
        question: "I have five ___.",
        options: ["pencil", "pencils", "pencilses"],
        answer: "pencils",
      },
      { question: "___ you have a ruler?", options: ["Do", "Does", "Are"], answer: "Do" },
      {
        question: "I ___ have a stapler at home.",
        options: ["don't", "doesn't", "am not"],
        answer: "don't",
      },
      { question: "I have one ___.", options: ["ruler", "rulers", "rulering"], answer: "ruler" },
      {
        question: "What ___ you have in your pencil case?",
        options: ["do", "does", "are"],
        answer: "do",
      },
    ],
  },
  expressions: [
    {
      prompt: "What do you have in your backpack?",
      answer: "I have a textbook, a notebook and two pencils.",
    },
    { prompt: "Do you have a stapler?", answer: "No, I don't. I don't have one at school." },
    { prompt: "How many pens do you have?", answer: "I have three pens and one pencil." },
    { prompt: "Do you have a marker?", answer: "Yes, I do. I have two markers — black and blue." },
    { prompt: "What's in your pencil case?", answer: "I have pencils, crayons and an eraser." },
    { prompt: "Can I borrow your ruler?", answer: "Sure, here you are!" },
  ],
  practice: {
    title: "Backpack Check",
    instructions:
      "Flip a card and say: I have a ___. or I don't have a ___. Then your tutor asks: Do you have a ___? Answer: Yes, I do. / No, I don't.",
  },
  reading: {
    title: "Students of the Future",
    illustration: {
      image: futureSchoolReadingImage,
      alt: "Dito uses a tablet and stylus at school, with a blue notebook, ruler, highlighter and pizza lunchbox nearby.",
    },
    paragraphs: [
      "My name is Dito. I have a special school in the city, and I have one tablet for all my books. I don't have a heavy backpack with ten textbooks — I have one blue tablet and a stylus. My little sister thinks my tablet is cute!",
      "I don't have a pencil case full of pens. I have a ruler, a glue stick for art class, and one pencil. In Math class, I have a calculator app, so I don't carry a real calculator. On rainy days, I have my yellow boots under my desk. And on Tuesday, I have art — that is my favorite day.",
      "My friends have paper books, and I have a screen, but we all have the same subjects. After class, we all have soccer practice. I always have fun at my school — even on days when I don't have any homework!",
    ],
    questions: [
      {
        question: "What does Dito have for all his books?",
        options: ["one tablet", "ten textbooks", "a heavy backpack", "a paper notebook"],
        answer: "one tablet",
      },
      {
        question: "What does Dito have under his desk on rainy days?",
        options: ["yellow boots", "a real calculator", "a heavy backpack", "his lunchbox"],
        answer: "yellow boots",
      },
      {
        question: "What does Dito have on Tuesday?",
        options: ["art class", "soccer practice", "a test", "no homework"],
        answer: "art class",
      },
      {
        question: "What do Dito and his friends all have after class?",
        options: ["soccer practice", "paper books", "ten textbooks", "a school bus"],
        answer: "soccer practice",
      },
    ],
    stretchQuestion:
      "Dito has a tablet, and his friends have paper books. What do you have in your school bag that Dito doesn't have?",
    spotlight: {
      sound: "long U",
      exampleWord: "blue",
      instruction: "Find the words with the long U sound, like BLUE!",
      words: ["blue", "boots", "cute", "glue stick", "ruler", "school", "Tuesday"],
    },
  },
  rolePlay: {
    title: "What's In My Bag?",
    conversation: {
      title: "Ready for school",
      scene: "Dito and Sari check their bags before art class.",
      image: schoolConversationImage,
      imageAlt:
        "Two schoolchildren talking about pencils, notebooks and a ruler in a red backpack.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 1, text: "Hi, Dito! What do you have in your bag today?" },
        {
          role: 0,
          text: "I have one notebook, a ruler and three pens. But I don't have my textbook!",
        },
        { role: 1, text: "No textbook? Do you have your tablet?" },
        { role: 0, text: "Yes, I do. I have one tablet for all my books!" },
        { role: 1, text: "Nice! Do you have a glue stick? I don't have one for art class." },
        { role: 0, text: "Yes, I have two glue sticks. Here — you can have one." },
        { role: 1, text: "Thank you! Now we both have a glue stick." },
        { role: 0, text: "And we both have art on Tuesday. See you there!" },
      ],
    },
    prompts: [
      "Tell me three things you have in your bag.",
      "Tell me one thing you don't have.",
      "Ask me: Do you have a ___?",
      "Ask me: How many ___ do you have?",
    ],
    twists: [
      "I have twenty pens in my bag — and they all have different colors!",
      "I don't have a bag today — I have everything in my arms!",
    ],
    homework:
      "Record yourself describing your real school bag: 3 things you have, 1 thing you don't have, and why.",
  },
  selfCheck: [
    "Can I say what I have in my bag?",
    "Can I say what I DON'T have?",
    "Can I ask 'Do you have...?'",
    "Can I use one/five with the correct word ending?",
  ],
  boss: [
    {
      question: "Which word means 'a tool that joins papers together'?",
      options: ["stapler", "glue stick", "ruler", "backpack"],
      answer: "stapler",
    },
    {
      question: "I ___ have a calculator. (say it is NOT yours)",
      options: ["don't", "doesn't", "not", "am not"],
      answer: "don't",
    },
    { question: "I have three ___.", options: ["pens", "pen", "penes", "pen's"], answer: "pens" },
    {
      question: "Which word means 'a thick pen with bright ink'?",
      options: ["marker", "notebook", "stapler", "backpack"],
      answer: "marker",
    },
    {
      question: "___ you have a pencil case?",
      options: ["Do", "Does", "Is", "Have"],
      answer: "Do",
    },
    { question: "I have one ___.", options: ["ruler", "rulers", "rulering"], answer: "ruler" },
    {
      question: "What ___ you have in your pencil case?",
      options: ["do", "does", "are"],
      answer: "do",
    },
  ],
  bossFight: { name: "Backpack Bandit", emoji: "🧹" },
  bossPersona: {
    hurt: ["Oof! My supplies! 🧹", "Hey, that was my favorite ruler!", "Not the homework! NOOOO!"],
    taunt: [
      "You'll never find your pencil case now! 🎒",
      "I've hidden ALL the glue sticks! Hehe!",
      "So messy! So sneaky! 🧹",
    ],
    phases: [
      "Backpack Bandit is digging around frantically! 🎒",
      "Backpack Bandit is out of breath! 😤",
    ],
  },
  sticker: { name: "Golden Backpack", emoji: "🎒" },
};

/* =============================================================================
 * LESSON 2 — MY TOYS · It is / They are + my / your (book Unit 2)
 * ============================================================================= */

const lesson2: Lesson = {
  id: "lesson-2",
  number: 2,
  title: "My Toys",
  subtitle: "It Is / They Are + my / your",
  emoji: "🛹",
  sentenceFrames: ["It is a ___.", "They are ___.", "Is it your ___?"],
  speedRoundSeconds: 10,
  vocabulary: [
    {
      word: "airplane",
      meaning: "a flying machine with wings",
      example: "It is my toy airplane.",
      emoji: "✈️",
    },
    {
      word: "baseball glove",
      meaning: "a big leather glove for catching balls",
      example: "Is it your baseball glove?",
      emoji: "🧤",
    },
    {
      word: "bike",
      meaning: "a two-wheel ride you pedal",
      example: "It is not my bike. My bike is at home.",
      emoji: "🚲",
    },
    {
      word: "blocks",
      meaning: "small pieces you build towers with (always plural!)",
      example: "They are my blocks. I build towers with them.",
      emoji: "🧱",
      tag: "Always plural!",
    },
    {
      word: "board game",
      meaning: "a game you play on a board with pieces",
      example: "It is my favorite board game.",
      emoji: "🎲",
    },
    {
      word: "cards",
      meaning: "a set of small cards for games (always plural!)",
      example: "They are your cards — I can see your name!",
      emoji: "🃏",
      tag: "Always plural!",
    },
    {
      word: "doll",
      meaning: "a small toy baby or person you can hold",
      example: "It is my sister's doll.",
      emoji: "🪆",
    },
    {
      word: "elephant",
      meaning: "a huge grey animal with a trunk — the toy kind lives in your room!",
      example: "It is my toy elephant. It is soft.",
      emoji: "🐘",
    },
    {
      word: "hula hoop",
      meaning: "a big ring you spin around your waist",
      example: "It is a pink hula hoop.",
      emoji: "⭕",
    },
    {
      word: "jump rope",
      meaning: "a long rope for jumping games (always plural!)",
      example: "They are our jump ropes for recess.",
      emoji: "🪢",
      tag: "Always plural!",
    },
    {
      word: "kite",
      meaning: "a light frame that flies on a string",
      example: "It is my kite. It is blue and yellow.",
      emoji: "🪁",
    },
    {
      word: "puzzle",
      meaning: "many small pieces you join to make a picture",
      example: "It is a puzzle with 100 pieces!",
      emoji: "🧩",
    },
    {
      word: "rollerblades",
      meaning: "shoes with wheels on the bottom (always plural!)",
      example: "They are my new rollerblades!",
      emoji: "🛼",
      tag: "Always plural!",
    },
    {
      word: "skateboard",
      meaning: "a board with wheels you stand on",
      example: "Is it your skateboard?",
      emoji: "🛹",
    },
    {
      word: "soccer ball",
      meaning: "the ball for playing soccer",
      example: "It is not my soccer ball. It is yours!",
      emoji: "⚽",
    },
    {
      word: "video game",
      meaning: "a game you play on a screen",
      example: "It is my favorite video game.",
      emoji: "🎮",
    },
  ],
  grammar: {
    title: "It Is / They Are + my / your",
    explanation:
      "Use It is for ONE thing and They are for MANY things. Say my for things that belong to you, and your for things that belong to the person you talk to. Careful: cards, blocks, jump ropes and rollerblades are always many!",
    tip: "💛 ONE OR MANY — it is / they are + my / your",
    patterns: [
      { subject: "What", verb: "is", rest: "it?", note: "It is a doll. (ONE thing)" },
      { subject: "What", verb: "are", rest: "they?", note: "They are blocks. (MANY things)" },
      { subject: "It is", verb: "my", rest: "airplane.", note: "my = it belongs to me" },
      {
        subject: "They are",
        verb: "your",
        rest: "rollerblades.",
        note: "your = they belong to you",
      },
      { subject: "It is not", verb: "your", rest: "soccer ball.", note: "is not = isn't" },
    ],
    examples: [
      "It is a kite. It is blue and yellow.",
      "They are my blocks. I build towers with them.",
      "Is it your soccer ball? — Yes, it is!",
      "No, it isn't. It is your baseball glove!",
    ],
    yourTurn: [
      { question: "___ is it?", options: ["What", "What are", "Is"], answer: "What" },
      { question: "They ___ my rollerblades.", options: ["is", "are", "am"], answer: "are" },
      { question: "It ___ a puzzle.", options: ["are", "is", "am"], answer: "is" },
      {
        question: "They are ___ cards. (they belong to you)",
        options: ["your", "my", "his"],
        answer: "my",
      },
      {
        question: "Is it ___ bike? (it belongs to me)",
        options: ["my", "your", "our"],
        answer: "my",
      },
      { question: "___ is my favorite toy.", options: ["It", "They", "You"], answer: "It" },
    ],
  },
  expressions: [
    { prompt: "What is it?", answer: "It is my toy airplane." },
    { prompt: "What are they?", answer: "They are my blocks." },
    { prompt: "Is it your kite?", answer: "Yes, it is. It is my new kite!" },
    { prompt: "Are they your cards?", answer: "No, they aren't. They are your cards!" },
    { prompt: "Is it your skateboard?", answer: "No, it isn't. It is my brother's." },
    { prompt: "What's your favorite toy?", answer: "My favorite toy is my video game." },
  ],
  practice: {
    title: "What Is It?",
    instructions:
      "Flip a toy card face-down, then reveal it. Ask the right question and answer it: What is it? → It is a ___. / What are they? → They are ___. Then the app asks: Is it your ___? Answer: Yes, it's my ___. / No, it isn't.",
  },
  reading: {
    title: "Old Toys",
    illustration: {
      image: grandpaToysReadingImage,
      alt: "A grandfather and child explore a wooden toy airplane, blocks, a grey rocking horse and a brown-and-white pony beside modern games and headphones.",
    },
    paragraphs: [
      "This is my grandfather. His old toys are in a big box under his bed. They are very, very old toys — they are older than my father!",
      "It is an old toy airplane. It is white and blue, and one wing is a little broken. 'It is my favorite old toy,' my grandfather says.",
      "They are old wooden blocks. It is a small bag with ten blocks in it. My grandfather builds big towers with them, and then — crash! They are on the floor!",
      "It is an old rocking horse. It is small and grey, and it is my favorite toy in the whole house. My grandfather also has a small toy pony. It is brown and white.",
      "My toys are new. My favorite toy is a video game. It is fast and loud! But old toys and new toys are both fun. Let's play together!",
    ],
    questions: [
      {
        question: "Where are the old toys?",
        options: ["in a big box", "in a small bag", "on the table", "in the garden"],
        answer: "in a big box",
      },
      {
        question: "What is Grandfather's favorite old toy?",
        options: ["an old toy airplane", "a rocking horse", "a toy pony", "a video game"],
        answer: "an old toy airplane",
      },
      {
        question: "What is in the small bag?",
        options: ["old wooden blocks", "two toy ponies", "new cards", "a kite"],
        answer: "old wooden blocks",
      },
      {
        question: "What colour is the rocking horse?",
        options: ["grey", "white", "brown", "black"],
        answer: "grey",
      },
    ],
    stretchQuestion:
      "Old toys and new toys are both fun. What is the same about them, and what is different?",
    spotlight: {
      sound: "long O",
      exampleWord: "boat",
      instruction:
        "Listen to each word. They all have the long O sound, like BOAT! Tap to confirm each one.",
      words: ["boat", "coat", "cold", "jump rope", "nose", "pony", "video game"],
      mode: "sound_sort",
      sortStyle: "confirm_all",
      sortWords: [
        { word: "boat", isTarget: true, emoji: "⛵" },
        { word: "coat", isTarget: true, emoji: "🧥" },
        { word: "cold", isTarget: true, emoji: "❄️" },
        { word: "jump rope", isTarget: true, emoji: "🪢" },
        { word: "nose", isTarget: true, emoji: "👃" },
        { word: "pony", isTarget: true, emoji: "🐴" },
        { word: "video game", isTarget: true, emoji: "🎮" },
      ],
      note: "'Pony' and 'video game' are from today's story — and 'jump rope' is one of your new words!",
    },
  },
  rolePlay: {
    title: "Show and Tell: My Real Toys",
    conversation: {
      title: "Whose things are these?",
      scene: "Sari and Dito meet in the park with their favorite toys.",
      image: thingsConversationImage,
      imageAlt:
        "Two children identifying a blue bottle, headphones, playing cards and a red bicycle at a park table.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 1, text: "Is it your kite, Dito? It is in the tree!" },
        { role: 0, text: "Yes, it is! It is my new kite. It is blue and yellow." },
        { role: 1, text: "What are those in your bag? Are they your cards?" },
        { role: 0, text: "No, they aren't. They are my blocks — my favorite toy!" },
        { role: 1, text: "And what is that? Is it your baseball glove?" },
        {
          role: 0,
          text: "No, it isn't! It is YOUR baseball glove, Sari. Look — it has your name!",
        },
        { role: 1, text: "Oh, you are right! It is my glove. Thank you!" },
        { role: 0, text: "You're welcome. Now we have one ball and two gloves. Let's play!" },
      ],
    },
    prompts: [
      "Show me 3 toys. Say: 'It is my ___.' or 'They are my ___.'",
      "Show me one toy that is always plural (cards, blocks, rollerblades). Say: 'They are my ___.'",
      "Ask me: Is it your ___?",
      "Ask me: What is it? / What are they?",
    ],
    twists: [
      "It is not my kite — it is my sister's kite!",
      "They aren't my cards. I can't find my cards anywhere!",
    ],
    homework:
      "Record a tour of 4 of your favorite toys. Use 'It is my ___' for single toys and 'They are my ___' for at least one always-plural toy (like cards, blocks or rollerblades).",
  },
  selfCheck: [
    "Can I say 'It is' for ONE thing?",
    "Can I say 'They are' for MANY things?",
    "Can I use 'my' and 'your' correctly?",
    "Can I remember cards, blocks and rollerblades are always plural?",
  ],
  boss: [
    { question: "What ___ they?", options: ["are", "is", "am", "be"], answer: "are" },
    { question: "It ___ my skateboard.", options: ["is", "are", "am", "be"], answer: "is" },
    {
      question: "Which word is ALWAYS plural?",
      options: ["rollerblades", "kite", "doll", "puzzle"],
      answer: "rollerblades",
    },
    {
      question: "Is it your soccer ball? (say NO)",
      options: ["No, it isn't.", "No, they aren't.", "No, I don't.", "No, it don't."],
      answer: "No, it isn't.",
    },
    {
      question: "Which word means 'a toy baby you can hold'?",
      options: ["doll", "kite", "blocks", "board game"],
      answer: "doll",
    },
    {
      question: "They are ___ cards. (they belong to you)",
      options: ["your", "my", "our"],
      answer: "your",
    },
    { question: "What is it? — It ___ a kite.", options: ["is", "are", "am"], answer: "is" },
  ],
  bossFight: { name: "Mix-Up Monster", emoji: "👽" },
  bossPersona: {
    hurt: [
      "Bzzzt! My mix-ups! 👽",
      "Error! Error! Does not compute! 🤖",
      "That answer was TOO correct!",
    ],
    taunt: [
      "One thing? Many things? Who knows! 👽",
      "Is it my/your? Hmmm... maybe!",
      "My puzzles puzzle everyone!",
    ],
    phases: ["Mix-Up Monster is glitching! ⚡", "Mix-Up Monster is out of mix-ups! 🤖"],
  },
  sticker: { name: "Treasure Chest", emoji: "🧰" },
};

/* =============================================================================
 * LESSON 3 — MY CLASSROOM · this / that / these / those (book Unit 3)
 * ============================================================================= */

const lesson3: Lesson = {
  id: "lesson-3",
  number: 3,
  title: "My Classroom",
  subtitle: "This / That / These / Those",
  emoji: "🏫",
  sentenceFrames: ["This is a ___.", "That is a ___.", "These are ___.", "Those are ___."],
  speedRoundSeconds: 10,
  vocabulary: [
    // `cue` + `many` feed the Practice Game's near/far zoom frame (this/that/these/those).
    {
      word: "bookcase",
      meaning: "a piece of furniture that holds books",
      example: "That is a big bookcase.",
      emoji: "📚",
      cue: "far",
    },
    {
      word: "calendar",
      meaning: "shows the days and months on a wall",
      example: "That is the class calendar.",
      emoji: "📅",
      cue: "far",
    },
    {
      word: "chair",
      meaning: "you sit on it",
      example: "This is my chair.",
      emoji: "🪑",
      cue: "near",
    },
    {
      word: "clock",
      meaning: "shows the time",
      example: "The clock is red.",
      emoji: "🕐",
      cue: "far",
    },
    {
      word: "computer",
      meaning: "a machine for work and games",
      example: "That is a new computer.",
      emoji: "💻",
      cue: "near",
    },
    {
      word: "cupboard",
      meaning: "furniture with doors for keeping things",
      example: "Those are cupboards.",
      emoji: "🗄️",
      cue: "far",
      many: true,
    },
    {
      word: "desk",
      meaning: "the table where you study",
      example: "This is my desk.",
      emoji: "🪑",
      cue: "near",
    },
    {
      word: "drawer",
      meaning: "a part that slides out of a desk",
      example: "This is a messy drawer!",
      emoji: "🗃️",
      cue: "near",
    },
    {
      word: "drawing",
      meaning: "a picture you make with a pencil or pen",
      example: "This is my drawing of a cat.",
      emoji: "📝",
      cue: "near",
    },
    {
      word: "easel",
      meaning: "a stand that holds a painting or board",
      example: "That is the art easel.",
      emoji: "🎨",
      cue: "far",
    },
    {
      word: "map",
      meaning: "a picture of countries or the world",
      example: "That map shows Indonesia.",
      emoji: "🗺️",
      cue: "far",
    },
    {
      word: "mat",
      meaning: "a soft flat cover for the floor",
      example: "This is my sleeping mat.",
      emoji: "🟫",
      cue: "near",
    },
    {
      word: "poster",
      meaning: "a big picture on the wall",
      example: "Those are new posters.",
      emoji: "🖼️",
      cue: "far",
      many: true,
    },
    {
      word: "shelf",
      meaning: "a flat board on the wall for keeping things",
      example: "The books are on the shelf.",
      emoji: "📚",
      cue: "far",
    },
    {
      word: "wastebasket",
      meaning: "a small basket for paper rubbish",
      example: "This is the wastebasket. It is empty!",
      emoji: "🗑️",
      cue: "near",
    },
    {
      word: "whiteboard",
      meaning: "a big white board the teacher writes on",
      example: "The whiteboard is clean.",
      emoji: "⬜",
      cue: "far",
    },
  ],
  grammar: {
    title: "This / That / These / Those",
    explanation:
      "Near you → this (ONE) and these (MANY). Far away → that (ONE) and those (MANY). To describe a thing, put an adjective after it: The clock is red.",
    tip: "📍 POINT IT OUT — this / that / these / those",
    patterns: [
      { subject: "This", verb: "is", rest: "a pen.", note: "NEAR + ONE → What is this?" },
      { subject: "That", verb: "is", rest: "a clock.", note: "FAR + ONE → What is that?" },
      { subject: "These", verb: "are", rest: "pencils.", note: "NEAR + MANY → What are these?" },
      { subject: "Those", verb: "are", rest: "posters.", note: "FAR + MANY → What are those?" },
      { subject: "The clock", verb: "is", rest: "red.", note: "adjective → The ___ is ___." },
    ],
    examples: [
      "This is my desk.",
      "That is a whiteboard.",
      "These are my pencils.",
      "Those are posters.",
      "The clock is red.",
    ],
    yourTurn: [
      {
        question: "___ is my pen. (it is close, in my hand)",
        options: ["This", "That", "Those"],
        answer: "This",
      },
      {
        question: "___ are the posters. (far away, on the wall)",
        options: ["These", "Those", "This"],
        answer: "Those",
      },
      { question: "The whiteboard ___ white.", options: ["are", "is", "am"], answer: "is" },
      {
        question: "What is that? (one computer, far away)",
        options: [
          "That is a computer.",
          "That are a computer.",
          "Those is a computer.",
          "It are a computer.",
        ],
        answer: "That is a computer.",
      },
      { question: "The chairs ___ brown.", options: ["are", "is", "am", "be"], answer: "are" },
    ],
  },
  expressions: [
    { prompt: "What is this?", answer: "This is my chair." },
    { prompt: "What is that?", answer: "That is a whiteboard." },
    { prompt: "What are these?", answer: "These are my pencils." },
    { prompt: "What are those?", answer: "Those are posters." },
    { prompt: "What colour is the clock?", answer: "The clock is red." },
    { prompt: "What colour are those cupboards?", answer: "They are brown." },
  ],
  practice: {
    title: "Near or Far?",
    instructions:
      "Look at the card: is the thing NEAR you or FAR away? One thing or many? Say it: This is a ___. / That is a ___. / These are ___. / Those are ___. Then answer the colour question: What colour is it? → The ___ is ___.",
  },
  reading: {
    title: "One-room School",
    illustration: {
      image: oneRoomSchoolReadingImage,
      alt: "An illustrated 1930 one-room school with a red building, white porch, one teacher and Margaret writing with chalk on a slate.",
    },
    paragraphs: [
      "This is a photo of an old school in the United States. It is from 1930. Look — that is the school building. It is small and red, with a white porch.",
      "This is Margaret. She lives in a small town, and she goes to a one-room school. All the students are in one room together. That is her teacher — she is the only teacher in the school. These are Margaret's classmates, and those are their desks. Her older brother William is in the same class!",
      "Margaret doesn't have a notebook or a pencil case. Look at her desk — this is a slate. It is black, and she writes on it with chalk. And those books on the shelf? They are not Margaret's. Only the teacher has a textbook.",
      "Margaret likes history the best, because her teacher tells good stories about the past. When she grows up, Margaret wants to be a teacher, too.",
    ],
    questions: [
      {
        question: "Where does Margaret live?",
        options: ["a small town", "a big city", "a village", "a farm"],
        answer: "a small town",
      },
      {
        question: "What does Margaret write on instead of a notebook?",
        options: ["a slate", "paper", "a tablet", "a whiteboard"],
        answer: "a slate",
      },
      {
        question: "Who has the only textbook?",
        options: ["the teacher", "Margaret", "William", "nobody"],
        answer: "the teacher",
      },
      {
        question: "What is Margaret's favourite subject?",
        options: ["history", "math", "science", "English"],
        answer: "history",
      },
    ],
    stretchQuestion: "What does Margaret want to be when she grows up, and why?",
    spotlight: {
      sound: "long E and short E",
      exampleWord: "bee",
      instruction:
        "Listen to each word, then drop it in the right basket: long E like BEE, or short E like DESK. Use the speaker first — this is about hearing, not spelling!",
      words: ["bee", "easel", "eraser", "leaf", "desk", "pen", "pencil"],
      mode: "sound_sort",
      sortStyle: "two_buckets",
      buckets: [
        { id: "long-e", label: "Long E — like BEE" },
        { id: "short-e", label: "Short E — like DESK" },
      ],
      sortWords: [
        { word: "bee", emoji: "🐝", bucket: "long-e" },
        { word: "easel", emoji: "🎨", bucket: "long-e" },
        { word: "eraser", emoji: "🧽", bucket: "long-e" },
        { word: "leaf", emoji: "🍃", bucket: "long-e" },
        { word: "desk", emoji: "🪑", bucket: "short-e" },
        { word: "pen", emoji: "🖊️", bucket: "short-e" },
        { word: "pencil", emoji: "✏️", bucket: "short-e" },
      ],
      note: "'Desk', 'pen' and 'pencil' are old friends — and 'easel' is one of your new classroom words!",
    },
  },
  rolePlay: {
    title: "Describe Your Study Space",
    conversation: {
      title: "A look around our classroom",
      scene: "Dito is showing Sari around the classroom for the first time.",
      image: classroomConversationImage,
      imageAlt:
        "A boy pointing to a nearby pencil and books while a girl shows a whiteboard and distant posters.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 0, text: "This is my pencil. It is yellow — and look, my ruler is yellow, too!" },
        { role: 1, text: "What are these on the desk?" },
        { role: 0, text: "These are my books. I read them after class." },
        { role: 1, text: "What is that over there?" },
        { role: 0, text: "That is our whiteboard. It is next to the cupboard." },
        { role: 1, text: "And what are those on the far wall?" },
        { role: 0, text: "Those are posters. My favorite poster is green — it is a big tree." },
        { role: 1, text: "I like it, too. Our classroom is a nice place to learn!" },
      ],
    },
    prompts: [
      "Point near you: 'This is my ___.'",
      "Point far from you: 'That is a ___.'",
      "Say the colour of two things: 'The ___ is ___.'",
      "Ask me about my room: 'What is that?' / 'What are those?'",
    ],
    twists: [
      "That is my cat — she sleeps on my desk!",
      "These are not my books — they're my brother's!",
    ],
    homework:
      "Record a tour of your study space: name 5 objects with this/that/these/those, and say the colour of at least 2 of them.",
  },
  selfCheck: [
    "Can I use 'this' for near and 'that' for far?",
    "Can I use 'these' and 'those' for many things?",
    "Can I say the colour of something ('The clock is red')?",
    "Can I hear the difference between long E and short E?",
  ],
  boss: [
    {
      question: "___ is my pen. (near me)",
      options: ["This", "Those", "These", "That"],
      answer: "This",
    },
    {
      question: "___ are the posters on the far wall.",
      options: ["Those", "This", "These", "That"],
      answer: "Those",
    },
    { question: "The whiteboard ___ white.", options: ["is", "are", "am", "be"], answer: "is" },
    {
      question: "Which word means 'shows the time'?",
      options: ["clock", "map", "shelf", "drawer"],
      answer: "clock",
    },
    {
      question: "What are these? (many pencils, near you)",
      options: ["These are pencils.", "This is pencils.", "Those is pencils.", "That are pencils."],
      answer: "These are pencils.",
    },
    {
      question: "What is that? (one computer, far away)",
      options: [
        "That is a computer.",
        "That are a computer.",
        "Those is a computer.",
        "It are a computer.",
      ],
      answer: "That is a computer.",
    },
    { question: "The chairs ___ brown.", options: ["are", "is", "am", "be"], answer: "are" },
  ],
  bossFight: { name: "Chalk Dust Dragon", emoji: "🐉" },
  bossPersona: {
    hurt: [
      "Rawr! Watch the dust! 🐉",
      "My chalk armor! It crumbles!",
      "Achoo! That one went up my nose!",
    ],
    taunt: [
      "Cough cough! CHALK CLOUD! 💨",
      "You can't read the board through my dust!",
      "Dragons never erase!",
    ],
    phases: ["Chalk Dust Dragon is losing its dust! 💨", "Chalk Dust Dragon is almost erased! 😵"],
  },
  sticker: { name: "Golden Whiteboard", emoji: "🏫" },
};

/* =============================================================================
 * LESSON 4 — FAMILY AND FRIENDS · Is she? / Is he? / Are they? (book Unit 4)
 * ============================================================================= */

const lesson4: Lesson = {
  id: "lesson-4",
  number: 4,
  title: "Family and Friends",
  subtitle: "Is she? / Is he? / Are they?",
  emoji: "👨‍👩‍👧‍👦",
  sentenceFrames: [
    "Is she your ___?",
    "Is he your ___?",
    "Are they your ___?",
    "___ is ___ years old.",
  ],
  speedRoundSeconds: 10,
  vocabulary: [
    {
      word: "aunt",
      meaning: "your mother's or father's sister",
      example: "My aunt is 35 years old.",
      emoji: "👩",
    },
    {
      word: "children",
      meaning: "more than one child (always plural!)",
      example: "The children are in the yard.",
      emoji: "🧒🧒",
      tag: "Always plural!",
    },
    {
      word: "cousin",
      meaning: "your aunt's or uncle's child",
      example: "My cousin is 14 years old.",
      emoji: "🧑‍🤝‍🧑",
    },
    {
      word: "family",
      meaning: "the people you are related to — parents, sisters, brothers...",
      example: "My family is big and happy.",
      emoji: "👨‍👩‍👧‍👦",
    },
    {
      word: "friend",
      meaning: "a person you like and play with",
      example: "My best friend is in my class.",
      emoji: "🙂",
    },
    {
      word: "neighbor",
      meaning: "someone who lives near your house",
      example: "Our neighbor is very kind.",
      emoji: "🏠",
    },
    {
      word: "teacher",
      meaning: "a person who helps you learn at school",
      example: "My teacher is from this town.",
      emoji: "🧑‍🏫",
    },
    {
      word: "uncle",
      meaning: "your mother's or father's brother",
      example: "My uncle is 38 years old.",
      emoji: "🧔",
    },
    {
      word: "grandparents",
      meaning: "grandmother + grandfather together (always plural!)",
      example: "They are my grandparents.",
      emoji: "👴👵",
      tag: "Always plural!",
    },
  ],
  // Taught in an earlier course: they join the games, but not the words-learned bar.
  reviewVocabulary: [
    { word: "mother", meaning: "your female parent", example: "Is she your mother?", emoji: "👩" },
    { word: "father", meaning: "your male parent", example: "He is my father.", emoji: "👨" },
    {
      word: "brother",
      meaning: "a boy with the same parents as you",
      example: "My brother is 15.",
      emoji: "👦",
    },
    {
      word: "sister",
      meaning: "a girl with the same parents as you",
      example: "She is my sister.",
      emoji: "👧",
    },
    {
      word: "grandmother",
      meaning: "your mother's or father's mother",
      example: "My grandmother is kind.",
      emoji: "👵",
    },
    {
      word: "grandfather",
      meaning: "your mother's or father's father",
      example: "My grandfather is 72.",
      emoji: "👴",
    },
    {
      word: "parents",
      meaning: "your mother and father together",
      example: "They are my parents.",
      emoji: "👫",
    },
  ],
  grammar: {
    title: "Is she? / Is he? / Are they?",
    explanation:
      "To ask about ONE girl or woman, start with Is she. For ONE boy or man, start with Is he. For MANY people, start with Are they. Answer with Yes, she is. / No, she isn't. — and say an age with numbers: He is 10 years old.",
    tip: "💛 ASK ABOUT PEOPLE — Is she…? Is he…? Are they…?",
    patterns: [
      { subject: "Is she", verb: "", rest: "your mother?", note: "Yes, she is. / No, she isn't." },
      { subject: "Is he", verb: "", rest: "your uncle?", note: "Yes, he is. / No, he isn't." },
      {
        subject: "Are they",
        verb: "",
        rest: "your grandparents?",
        note: "Yes, they are. / No, they aren't.",
      },
      { subject: "My cousin", verb: "is", rest: "14 years old.", note: "___ is ___ years old." },
    ],
    examples: [
      "Is she your aunt?",
      "No, she isn't. She's my mother.",
      "Are they your grandparents?",
      "My uncle is 35 years old.",
    ],
    yourTurn: [
      { question: "___ she your aunt?", options: ["Is", "Are", "Am"], answer: "Is" },
      {
        question: "Are they your ___? (two older people)",
        options: ["grandparents", "grandfather", "cousin"],
        answer: "grandparents",
      },
      { question: "My uncle ___ 35 years old.", options: ["are", "is", "am"], answer: "is" },
      { question: "___ they your parents?", options: ["Are", "Is", "Am"], answer: "Are" },
      { question: "My aunt ___ 41 years old.", options: ["is", "are", "am", "be"], answer: "is" },
    ],
  },
  expressions: [
    { prompt: "Is she your mother?", answer: "Yes, she is." },
    { prompt: "Is he your uncle?", answer: "No, he isn't. He's my father." },
    { prompt: "Are they your grandparents?", answer: "Yes, they are." },
    { prompt: "How old is your cousin?", answer: "She is 14 years old." },
    { prompt: "Who is your neighbor?", answer: "Our neighbor is Mr. Budi. He is very kind." },
    {
      prompt: "How many people are in your family?",
      answer: "There are five people in my family.",
    },
  ],
  practice: {
    title: "Family Detective 🕵️",
    instructions:
      "I picked one secret person from the family. Ask Yes/No questions — Is she...? Is he...? Are they...? — then tap the faces you can cross out. When you're sure, tap I know who! Fewer questions = more stars!",
  },
  practiceGame: "detective",
  detective: {
    title: "The Santoso Family",
    instructions: "Tap a question to ask it out loud. Grey out the people it can't be.",
    faces: [
      {
        id: "f1",
        name: "Grandpa Hasan",
        age: 72,
        emoji: "👴",
        gender: "male",
        relation: "grandparent",
      },
      {
        id: "f2",
        name: "Grandma Siti",
        age: 70,
        emoji: "👵",
        gender: "female",
        relation: "grandparent",
      },
      { id: "f3", name: "Mrs. Dewi", age: 41, emoji: "👩", gender: "female", relation: "mother" },
      { id: "f4", name: "Mr. Rudi", age: 44, emoji: "👨", gender: "male", relation: "father" },
      { id: "f5", name: "Aunt Lina", age: 36, emoji: "👩‍🦰", gender: "female", relation: "aunt" },
      { id: "f6", name: "Uncle Bayu", age: 38, emoji: "🧔", gender: "male", relation: "uncle" },
      { id: "f7", name: "Nadia", age: 14, emoji: "👧", gender: "female", relation: "cousin" },
      { id: "f8", name: "Tomi", age: 11, emoji: "👦", gender: "male", relation: "cousin" },
      { id: "f9", name: "Rina", age: 8, emoji: "🧒", gender: "female", relation: "cousin" },
      { id: "f10", name: "Mr. Budi", age: 58, emoji: "👨‍🦳", gender: "male", relation: "neighbor" },
    ],
  },
  reading: {
    title: "Different Kinds of Families",
    illustration: {
      image: familiesReadingImage,
      alt: "Different families enjoy a picnic: a child with two parents, a child with a mother, and children with grandparents.",
    },
    paragraphs: [
      "Families come in all shapes and sizes. In Sari's class, every family is different — and every family is special.",
      "Dito is with his parents and his older sister. His cousin Rafa is with Dito's family this month, because Rafa's parents are in another city. 'It is fun!' says Dito. 'We play badminton every afternoon, and Grandma cooks delicious food for us.'",
      "Ana's family is small — it is just her and her mother. 'My mother works hard, and she is my best friend,' says Ana. 'On Sundays we make pancakes and watch a movie together.'",
      "Bimo is with his grandparents and his aunt. His aunt has three cats, and Bimo loves them. 'My grandmother tells the funniest stories,' he says. 'We laugh for hours!'",
      "The class makes a big poster called 'Our Families.' It is full of photos: brothers, sisters, cousins, aunts, uncles, and grandparents. Miss Rina writes one sentence at the bottom: 'Families are different, but love is the same.'",
    ],
    questions: [
      {
        question: "Why is Rafa with Dito's family?",
        options: [
          "Rafa's parents are in another city",
          "his house is too small",
          "he loves badminton",
          "his school is closed",
        ],
        answer: "Rafa's parents are in another city",
      },
      {
        question: "What do Ana and her mother do on Sundays?",
        options: [
          "make pancakes and watch a movie",
          "go to the beach",
          "play badminton",
          "visit grandparents",
        ],
        answer: "make pancakes and watch a movie",
      },
      {
        question: "Who is Bimo with?",
        options: [
          "his grandparents and his aunt",
          "his parents and his sister",
          "his cousins",
          "his uncle and aunt",
        ],
        answer: "his grandparents and his aunt",
      },
      {
        question: "What does Miss Rina write on the poster?",
        options: [
          "Families are different, but love is the same",
          "Family means one house",
          "Every family is the same",
          "Families need a garden",
        ],
        answer: "Families are different, but love is the same",
      },
    ],
    stretchQuestion:
      "How is your family special? Tell the class about the people in your family and how old they are!",
    spotlight: {
      sound: "soft C and hard C",
      exampleWord: "city",
      instruction:
        "Listen to each word, then drop it in the right basket: soft C like CITY (ssss) or hard C like CAR (k). Use the speaker first — this is about hearing, not spelling!",
      words: ["bicycle", "cell phone", "city", "car", "color", "computer", "cupboard"],
      mode: "sound_sort",
      sortStyle: "two_buckets",
      buckets: [
        { id: "soft-c", label: "Soft C — like CITY (ssss sound)" },
        { id: "hard-c", label: "Hard C — like CAR (k sound)" },
      ],
      sortWords: [
        { word: "bicycle", emoji: "🚲", bucket: "soft-c" },
        { word: "cell phone", emoji: "📱", bucket: "soft-c" },
        { word: "city", emoji: "🏙️", bucket: "soft-c" },
        { word: "car", emoji: "🚗", bucket: "hard-c" },
        { word: "color", emoji: "🎨", bucket: "hard-c" },
        { word: "computer", emoji: "💻", bucket: "hard-c" },
        { word: "cupboard", emoji: "🗄️", bucket: "hard-c" },
      ],
      note: "You already knew bicycle (Lesson 2), computer and cupboard (Lesson 3), and city from before — the soft/hard C sounds were hiding in words you already own!",
    },
  },
  rolePlay: {
    title: "Draw My Family",
    conversation: {
      title: "Meet my family",
      scene: "Sari is drawing her family and shows Dito the family photos.",
      image: familyConversationImage,
      imageAlt:
        "Two children looking at family photos of grandparents, an aunt and a cousin in an album.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 0, text: "Are they your grandparents?" },
        { role: 1, text: "Yes, they are. They live near our house." },
        { role: 0, text: "Is she your mother?" },
        { role: 1, text: "No, she isn't. She's my aunt. She is 35 years old." },
        { role: 0, text: "Is he your cousin?" },
        { role: 1, text: "Yes, he is. His name is Rafi." },
        { role: 0, text: "How old is he?" },
        { role: 1, text: "He is 14 years old. We play football together after school." },
      ],
    },
    prompts: [
      "Draw and describe 3 people in your family.",
      "Say each one's name and age: 'This is my ___. He/She is ___ years old.'",
      "Ask your teacher 2 Yes/No questions about THEIR family.",
    ],
    twists: [
      "My cousin is only 2 years old — she's a baby!",
      "My uncle lives in a different city — I never see him!",
    ],
    homework:
      "Interview someone at home in English! Ask their name and age, and one thing they like. Then record your report: 'This is my ___. He/She is ___ years old. He/She likes ___.' If nobody can answer in English, that's OK — ask the questions and answer them for that person yourself.",
    drawAndDescribe: true,
    drawChecklist: [
      "Draw 3 family members (stick figures are perfect!)",
      "Describe each one: 'This is my ___. He/She is ___ years old.'",
      "Let your teacher guess who is who!",
    ],
  },
  selfCheck: [
    "Can I ask 'Is she/he your ___?' correctly?",
    "Can I ask 'Are they your ___?' for plural people?",
    "Can I say someone's age: 'He is ___ years old'?",
    "Can I guess a mystery person using Yes/No questions?",
  ],
  boss: [
    { question: "___ she your aunt?", options: ["Is", "Are", "Am", "Do"], answer: "Is" },
    {
      question: "Are they your grandparents? (say YES)",
      options: ["Yes, they are.", "Yes, she is.", "Yes, he is.", "Yes, it is."],
      answer: "Yes, they are.",
    },
    { question: "My cousin ___ 14 years old.", options: ["is", "are", "am", "be"], answer: "is" },
    {
      question: "Which word means 'someone who lives near your house'?",
      options: ["neighbor", "cousin", "uncle", "aunt"],
      answer: "neighbor",
    },
    {
      question: "Which word is ALWAYS plural?",
      options: ["children", "child", "cousin", "aunt"],
      answer: "children",
    },
    { question: "___ they your parents?", options: ["Are", "Is", "Am", "Do"], answer: "Are" },
    { question: "My aunt ___ 41 years old.", options: ["is", "are", "am", "be"], answer: "is" },
  ],
  bossFight: { name: "Question Kraken", emoji: "🐙" },
  bossPersona: {
    hurt: [
      "Blub! Good hit! 🐙",
      "My tentacles are all tangled!",
      "Eight arms and I still couldn't block that!",
    ],
    taunt: ["Ink incoming! 🦑", "Splash! You're soaked in questions!", "This question is MINE! 🐙"],
    phases: [
      "Question Kraken is splashing wildly! 🌊",
      "Question Kraken is deflating like a balloon! 🎈",
    ],
  },
  sticker: { name: "Family Photo Frame", emoji: "🖼️" },
};

export const LESSONS: Lesson[] = [lesson1, lesson2, lesson3, lesson4];

// Fail fast during development and builds if a content edit breaks a screen
// invariant (answers inside options, word-hunt words present in the passage,
// alternating conversation roles, non-empty grammar patterns, ...).
assertValidLessons(LESSONS);
