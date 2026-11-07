/* =============================================================================
 * ARSYAD'S ENGLISH QUEST — SINGLE LESSON CONFIG FILE
 * -----------------------------------------------------------------------------
 * EVERY piece of lesson content the app shows lives in the LESSONS array at the
 * bottom of this file: one entry per lesson. Screens and components read from it
 * and never hardcode content.
 *
 * TO ADD LESSON 2 (or 3...8):
 *   1. Copy the `lesson1` object below, rename it `lesson2`.
 *   2. Change `id`, `number`, `title`, `subtitle`, `emoji` and fill in the
 *      content fields (vocabulary of ANY length, grammar, expressions,
 *      practice, reading + questions + spotlight, rolePlay + homework,
 *      selfCheck, boss, sticker).
 *   3. Append it: `export const LESSONS: Lesson[] = [lesson1, lesson2];`
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

/**
 * The ONLY browser-storage key this app touches. The "quest_" prefix keeps it in
 * its own namespace, so the app can never read or overwrite data written by any
 * other app on the same browser. Bump the version suffix if the saved shape changes.
 */
export const STORAGE_KEY = "quest_arsyad_english_v1";

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
 * The boss has HP; a correct answer deals `hpPerHit`, a miss lets the boss
 * recover `bossRegen`. The fight ends only when HP reaches 0.
 */
export type BossFightConfig = {
  minQuestions?: number;
  hpPerHit?: number;
  bossRegen?: number;
  reviewQuestions?: number;
  maxHp?: number;
  /** Safety net: after this many total attempts the boss simply surrenders. */
  surrenderAfter?: number;
  /** Friendly (never scary!) boss character. */
  name?: string;
  emoji?: string;
};

export const BOSS_FIGHT_DEFAULTS = {
  minQuestions: 12,
  hpPerHit: 10,
  bossRegen: 10,
  reviewQuestions: 2,
  maxHp: 100,
  surrenderAfter: 25,
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

const lesson1: Lesson = {
  id: "lesson-1",
  number: 1,
  title: "My School Supplies",
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
      word: "notebook",
      meaning: "a book for writing your own notes",
      example: "I have one notebook for English.",
      emoji: "📓",
    },
    {
      word: "pencil case",
      meaning: "a small bag for pens and pencils",
      example: "My pencil case is blue.",
      emoji: "🧰",
    },
    {
      word: "ruler",
      meaning: "a straight tool for measuring and drawing lines",
      example: "I use a ruler in Math class.",
      emoji: "📏",
    },
    {
      word: "stapler",
      meaning: "a tool that joins papers together",
      example: "Do you have a stapler?",
      emoji: "📎",
    },
    {
      word: "sticky tape",
      meaning: "a tape for sticking paper together",
      example: "I use sticky tape for my project.",
      emoji: "🩹",
    },
    {
      word: "textbook",
      meaning: "a book you study from in class",
      example: "I don't have a textbook for Science.",
      emoji: "📕",
    },
    { word: "pen", meaning: "a tool for writing in ink", example: "I have three blue pens.", emoji: "🖊️" },
    {
      word: "pencil",
      meaning: "a tool for writing in grey lead",
      example: "I have five pencils in my case.",
      emoji: "✏️",
    },
    {
      word: "highlighter",
      meaning: "a bright marker for important words",
      example: "I use a yellow highlighter.",
      emoji: "🖍️",
    },
    {
      word: "eraser",
      meaning: "a tool for removing pencil marks",
      example: "Can I borrow your eraser?",
      emoji: "🧽",
    },
    {
      word: "calculator",
      meaning: "a tool for doing math",
      example: "I don't have a real calculator.",
      emoji: "🧮",
    },
    {
      word: "glue",
      meaning: "a sticky liquid for joining paper",
      example: "I need glue for this project.",
      emoji: "🧴",
    },
    { word: "scissors", meaning: "a tool for cutting paper", example: "Do you have scissors?", emoji: "✂️" },
  ],
  grammar: {
    title: "Have / Don't Have",
    explanation:
      "Use have to say what is yours. Use don't have to say what is NOT yours. To ask a friend, start with Do you have...?",
    patterns: [
      { subject: "I", verb: "have", rest: "a backpack." },
      { subject: "I", verb: "don't have", rest: "a stapler." },
      { subject: "Do you", verb: "have", rest: "a ruler?", note: "Yes, I do. / No, I don't." },
      { subject: "I", verb: "have", rest: "ONE pen.", note: "one thing → no -s" },
      { subject: "I", verb: "have", rest: "FIVE pens.", note: "more than one → add -s" },
    ],
    examples: [
      "I have a blue pencil case.",
      "I don't have a calculator.",
      "Do you have a highlighter?",
      "I have five pencils and one eraser.",
    ],
    yourTurn: [
      { question: "I ___ a backpack.", options: ["have", "has", "having"], answer: "have" },
      { question: "I have five ___.", options: ["pencil", "pencils", "pencilses"], answer: "pencils" },
      { question: "___ you have a ruler?", options: ["Do", "Does", "Are"], answer: "Do" },
    ],
  },
  expressions: [
    {
      prompt: "What do you have in your backpack?",
      answer: "I have a textbook and a pencil case.",
    },
    { prompt: "Do you have a stapler?", answer: "Yes, I do. / No, I don't." },
    { prompt: "How many pens do you have?", answer: "I have three pens." },
    { prompt: "Do you have a calculator?", answer: "No, I don't. I use an app instead." },
    { prompt: "What's in your pencil case?", answer: "I have pens, pencils, and an eraser." },
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
      "My name is Dito. I study at a special school in the city. I don't have a paper textbook — I have a tablet instead. I read my lessons on the screen, and I watch short videos to learn new topics.",
      "I don't use a pencil case full of pens; I have just one stylus for writing. My little sister thinks the stylus is cute! In Math class, I have a calculator app, so I don't carry a real calculator.",
      "I still have a few old-style tools, though — I have a ruler and a highlighter for my notes, and my backpack has one blue notebook for drawing ideas. At break time, everyone has a lunchbox. I love lunch on Tuesdays — that's pizza day!",
    ],
    questions: [
      {
        question: "What does Dito use instead of a paper textbook?",
        options: ["a tablet", "a notebook", "a calculator", "a ruler"],
        answer: "a tablet",
      },
      {
        question: "What does Dito use for writing instead of pens?",
        options: ["a stylus", "a pencil", "a highlighter", "a pen"],
        answer: "a stylus",
      },
      {
        question: "What colour is Dito's notebook?",
        options: ["blue", "red", "green", "yellow"],
        answer: "blue",
      },
      {
        question: "What day is pizza day?",
        options: ["Tuesday", "Monday", "Friday", "Sunday"],
        answer: "Tuesday",
      },
    ],
    stretchQuestion: "Why doesn't Dito carry a real calculator?",
    spotlight: {
      sound: "long U",
      exampleWord: "blue",
      instruction: "Find the words with the long U sound, like BLUE!",
      words: ["blue", "school", "Tuesday", "ruler", "cute"],
    },
  },
  rolePlay: {
    title: "What's In My Bag?",
    conversation: {
      title: "Ready for school",
      scene: "Dito and Sari check their bags before class.",
      image: schoolConversationImage,
      imageAlt: "Two schoolchildren talking about pencils, notebooks and a ruler in a red backpack.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 1, text: "Hi, Dito! What do you have in your bag?" },
        { role: 0, text: "I have a notebook, a ruler and a pencil case." },
        { role: 1, text: "How many pencils do you have?" },
        { role: 0, text: "I have three pencils. Do you have a ruler?" },
        { role: 1, text: "No, I don't. Can I borrow your ruler, please?" },
        { role: 0, text: "Yes, of course. Here you are!" },
        { role: 1, text: "Thank you! Do you have a calculator?" },
        { role: 0, text: "No, I don't. I don't need one today." },
      ],
    },
    prompts: [
      "Tell me three things you have in your bag.",
      "Tell me one thing you don't have.",
      "Ask me: Do you have a ___?",
      "Ask me: How many ___ do you have?",
    ],
    twists: [
      "I have twenty pens in my bag!",
      "I don't have a bag today — I forgot it at home!",
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
    { question: "Which word means 'a tool for cutting paper'?", options: ["scissors", "glue", "ruler", "pen"], answer: "scissors" },
    { question: "I ___ have a calculator. (say it is NOT yours)", options: ["don't", "doesn't", "not", "am not"], answer: "don't" },
    { question: "I have three ___.", options: ["pens", "pen", "penes", "pen's"], answer: "pens" },
    { question: "Which word means 'a bright marker for important words'?", options: ["highlighter", "eraser", "stapler", "notebook"], answer: "highlighter" },
    { question: "___ you have a pencil case?", options: ["Do", "Does", "Is", "Have"], answer: "Do" },
  ],
  bossFight: { minQuestions: 12, hpPerHit: 10, bossRegen: 10, name: "Backpack Bandit", emoji: "🧹" },
  sticker: { name: "Golden Backpack", emoji: "🎒" },
};

const lesson2: Lesson = {
  id: "lesson-2",
  number: 2,
  title: "My Things",
  subtitle: "It Is / They Are + my / your",
  emoji: "🛹",
  sentenceFrames: ["It is a ___.", "They are ___.", "Is it your ___?"],
  speedRoundSeconds: 10,
  vocabulary: [
    { word: "bicycle", meaning: "a two-wheel vehicle you ride", example: "It's my bicycle.", emoji: "🚲" },
    { word: "skateboard", meaning: "a board with wheels you stand on", example: "Is it your skateboard?", emoji: "🛹" },
    { word: "board game", meaning: "a game you play on a board with pieces", example: "It's a board game.", emoji: "🎲" },
    {
      word: "playing cards",
      meaning: "a set of cards for games (always plural!)",
      example: "They are my playing cards.",
      emoji: "🃏",
      tag: "Always plural!",
    },
    { word: "puzzle", meaning: "many small pieces you join to make a picture", example: "It's a puzzle.", emoji: "🧩" },
    { word: "video game", meaning: "a game you play on a screen", example: "It's my favourite video game.", emoji: "🎮" },
    {
      word: "headphones",
      meaning: "you wear them to listen (always plural!)",
      example: "They are my headphones.",
      emoji: "🎧",
      tag: "Always plural!",
    },
    { word: "phone", meaning: "a device for calling and messaging", example: "It's my phone.", emoji: "📱" },
    { word: "football", meaning: "a ball for playing football", example: "It's my football.", emoji: "⚽" },
    { word: "badminton racket", meaning: "you hit a shuttlecock with it", example: "It's a badminton racket.", emoji: "🏸" },
    { word: "backpack", meaning: "a bag for your back", example: "It's my backpack.", emoji: "🎒" },
    { word: "watch", meaning: "you wear it to see the time", example: "Is it your watch?", emoji: "⌚" },
    { word: "wallet", meaning: "you keep money and cards in it", example: "It's my wallet.", emoji: "👛" },
    { word: "water bottle", meaning: "you drink water from it", example: "It's my water bottle.", emoji: "🧴" },
  ],
  grammar: {
    title: "It Is / They Are + my / your",
    explanation:
      "Use It is for ONE thing. Use They are for MANY things. Say my for your own things, and ask with your. Careful: headphones and playing cards are always many!",
    patterns: [
      { subject: "What", verb: "is", rest: "it?", note: "It is a bicycle. (ONE thing)" },
      { subject: "What", verb: "are", rest: "they?", note: "They are headphones. (MANY things)" },
      { subject: "It", verb: "is", rest: "my phone.", note: "It's my phone." },
      { subject: "Is it", verb: "", rest: "your watch?", note: "Yes, it's my watch. / No, it isn't." },
      { subject: "They", verb: "are", rest: "my playing cards.", note: "always many → They are" },
    ],
    examples: [
      "It is a skateboard.",
      "They are my playing cards.",
      "Is it your football?",
      "No, it isn't. It's my brother's.",
    ],
    yourTurn: [
      { question: "___ is it?", options: ["What", "What are", "Is"], answer: "What" },
      { question: "They ___ my headphones.", options: ["is", "are", "am"], answer: "are" },
      { question: "It ___ a bicycle.", options: ["are", "is", "am"], answer: "is" },
    ],
  },
  expressions: [
    { prompt: "What is it?", answer: "It is a bicycle." },
    { prompt: "What are they?", answer: "They are my headphones." },
    { prompt: "Is it your phone?", answer: "Yes, it's my phone." },
    { prompt: "Are they your playing cards?", answer: "No, they aren't. They're my brother's." },
    { prompt: "Is it your watch?", answer: "No, it isn't." },
    { prompt: "What's your favourite thing?", answer: "My favourite thing is my video game." },
  ],
  practice: {
    title: "What Is It?",
    instructions:
      "Flip a belongings card face-down, then reveal it. Ask the right question and answer it: What is it? → It is a ___. / What are they? → They are ___. Then the app asks: Is it your ___? Answer Yes, it's my ___. / No, it isn't.",
  },
  reading: {
    title: "Grandpa's Toy Box",
    illustration: {
      image: grandpaToysReadingImage,
      alt: "A grandfather and child explore a wooden toy airplane, blocks, a grey rocking horse and a brown-and-white pony beside modern games and headphones.",
    },
    paragraphs: [
      "My grandfather has an old wooden toy box. Look at his old toys! Are they the same as your things today? How are they different?",
      "It is an old toy airplane. It has two wings. One wing is a little broken. My grandfather says, 'It's my favourite old toy!'",
      "They are old wooden blocks. There are ten blocks in a small bag. My grandfather likes to build towers with them.",
      "It is an old rocking horse. It is small and grey. I like to sit on it every time I visit. My grandfather also has a small toy pony. It is brown and white.",
      "My things today are different. I have a video game and headphones, not wooden blocks or a rocking horse. But old toys and new things are both fun. Let's play with Grandpa's toys together!",
    ],
    questions: [
      {
        question: "What toy has two wings?",
        options: ["an airplane", "a rocking horse", "wooden blocks", "a toy pony"],
        answer: "an airplane",
      },
      { question: "How many wooden blocks are in the bag?", options: ["ten", "five", "eight", "three"], answer: "ten" },
      { question: "What colour is the rocking horse?", options: ["grey", "white", "brown", "black"], answer: "grey" },
      {
        question: "What does the writer have today instead of wooden blocks?",
        options: ["a video game", "a toy monkey", "a rocking horse", "a puzzle"],
        answer: "a video game",
      },
    ],
    stretchQuestion: "How are Grandpa's old toys different from your things today?",
    spotlight: {
      sound: "long O",
      exampleWord: "boat",
      instruction: "Listen to each word. They all have the long O sound, like BOAT! Tap to confirm each one.",
      words: ["boat", "coat", "cold", "nose", "pony", "video game"],
      mode: "sound_sort",
      sortStyle: "confirm_all",
      sortWords: [
        { word: "boat", isTarget: true, emoji: "⛵" },
        { word: "coat", isTarget: true, emoji: "🧥" },
        { word: "cold", isTarget: true, emoji: "❄️" },
        { word: "nose", isTarget: true, emoji: "👃" },
        { word: "pony", isTarget: true, emoji: "🐴" },
        { word: "video game", isTarget: true, emoji: "🎮" },
      ],
      note: "You already know 'pony' and 'video game' from today's story!",
    },
  },
  rolePlay: {
    title: "Show and Tell: My Real Things",
    conversation: {
      title: "Whose things are these?",
      scene: "Sari and Dito meet in the park with their favorite things.",
      image: thingsConversationImage,
      imageAlt: "Two children identifying a blue bottle, headphones, playing cards and a red bicycle at a park table.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 1, text: "Is it your water bottle, Dito?" },
        { role: 0, text: "Yes, it is. It's my blue water bottle." },
        { role: 1, text: "What are they?" },
        { role: 0, text: "They are my headphones. I use them to listen to music." },
        { role: 1, text: "Are they your playing cards, too?" },
        { role: 0, text: "No, they aren't. They're my brother's playing cards." },
        { role: 0, text: "Is it your bicycle, Sari?" },
        { role: 1, text: "Yes, it is! It's red. Let's ride to the playground." },
      ],
    },
    prompts: [
      "Show me 3 things you have. Say: 'It's my ___.'",
      "Show me one thing that's always plural (headphones or playing cards). Say: 'They are my ___.'",
      "Ask me: Is it your ___?",
      "Ask me: What is it? / What are they?",
    ],
    twists: [
      "It's not my phone — it's my sister's!",
      "They aren't my headphones — I can't find them anywhere!",
    ],
    homework:
      "Record a tour of 4 of your favourite things. Use 'It's my ___' for single items and 'They're my ___' for at least one plural item (like headphones or playing cards).",
  },
  selfCheck: [
    "Can I say 'It is' for ONE thing?",
    "Can I say 'They are' for MANY things?",
    "Can I use 'my' and 'your' correctly?",
    "Can I remember headphones and playing cards are always plural?",
  ],
  boss: [
    { question: "What ___ they?", options: ["are", "is", "am", "be"], answer: "are" },
    { question: "It ___ my skateboard.", options: ["is", "are", "am", "be"], answer: "is" },
    { question: "Which word is ALWAYS plural?", options: ["headphones", "phone", "watch", "puzzle"], answer: "headphones" },
    { question: "Is it your football? (say NO)", options: ["No, it isn't.", "No, they aren't.", "No, I don't.", "No, it don't."], answer: "No, it isn't." },
    { question: "Which word means 'you wear it to see the time'?", options: ["watch", "wallet", "phone", "football"], answer: "watch" },
  ],
  bossFight: { minQuestions: 12, hpPerHit: 10, bossRegen: 10, name: "Mix-Up Monster", emoji: "👽" },
  sticker: { name: "Treasure Chest", emoji: "🧰" },
};

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
    { word: "bookcase", meaning: "a piece of furniture that holds books", example: "That is a big bookcase.", emoji: "📚", cue: "far" },
    { word: "calendar", meaning: "shows the days and months on a wall", example: "The calendar is on the wall.", emoji: "📅", cue: "far" },
    { word: "chair", meaning: "you sit on it", example: "This is my chair.", emoji: "🪑", cue: "near" },
    { word: "clock", meaning: "shows the time", example: "The clock is red.", emoji: "🕐", cue: "far" },
    { word: "computer", meaning: "a machine for work and games", example: "There is a computer on the desk.", emoji: "💻", cue: "near" },
    { word: "cupboard", meaning: "furniture with doors for keeping things", example: "Those are cupboards.", emoji: "🗄️", cue: "far", many: true },
    { word: "desk", meaning: "the table where you study", example: "This is my desk.", emoji: "🪑", cue: "near" },
    { word: "drawer", meaning: "a part that slides out of a desk", example: "My pens are in the drawer.", emoji: "🗃️", cue: "near" },
    { word: "map", meaning: "a picture of countries or the world", example: "That map shows Indonesia.", emoji: "🗺️", cue: "far" },
    { word: "poster", meaning: "a big picture on the wall", example: "Those are new posters.", emoji: "🖼️", cue: "far", many: true },
    { word: "shelf", meaning: "a flat board on the wall for keeping things", example: "The books are on the shelf.", emoji: "📚", cue: "far" },
    { word: "whiteboard", meaning: "a big white board the teacher writes on", example: "The whiteboard is clean.", emoji: "⬜", cue: "far" },
    { word: "projector", meaning: "shows the teacher's screen on the wall", example: "The projector is on.", emoji: "📽️", cue: "far" },
    { word: "air conditioner", meaning: "keeps the classroom cool", example: "The air conditioner is on the wall.", emoji: "❄️", cue: "far" },
  ],
  grammar: {
    title: "This / That / These / Those",
    explanation:
      "Near you → this (ONE) and these (MANY). Far away → that (ONE) and those (MANY). To say a colour, use: The ___ is ___.",
    patterns: [
      { subject: "This", verb: "is", rest: "a pen.", note: "NEAR + ONE → What is this?" },
      { subject: "That", verb: "is", rest: "a clock.", note: "FAR + ONE → What is that?" },
      { subject: "These", verb: "are", rest: "pencils.", note: "NEAR + MANY → What are these?" },
      { subject: "Those", verb: "are", rest: "posters.", note: "FAR + MANY → What are those?" },
      { subject: "The clock", verb: "is", rest: "red.", note: "The ___ is ___. (colour)" },
    ],
    examples: [
      "This is my desk.",
      "That is a whiteboard.",
      "These are my pencils.",
      "Those are posters.",
      "The clock is red.",
    ],
    yourTurn: [
      { question: "___ is my pen. (it is close, in my hand)", options: ["This", "That", "Those"], answer: "This" },
      { question: "___ are the posters. (far away, on the wall)", options: ["These", "Those", "This"], answer: "Those" },
      { question: "The whiteboard ___ white.", options: ["are", "is", "am"], answer: "is" },
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
    title: "A School With One Room",
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
      words: ["bee", "eraser", "leaf", "desk", "pen", "pencil"],
      mode: "sound_sort",
      sortStyle: "two_buckets",
      buckets: [
        { id: "long-e", label: "Long E — like BEE" },
        { id: "short-e", label: "Short E — like DESK" },
      ],
      sortWords: [
        { word: "bee", emoji: "🐝", bucket: "long-e" },
        { word: "eraser", emoji: "🧽", bucket: "long-e" },
        { word: "leaf", emoji: "🍃", bucket: "long-e" },
        { word: "desk", emoji: "🪑", bucket: "short-e" },
        { word: "pen", emoji: "🖊️", bucket: "short-e" },
        { word: "pencil", emoji: "✏️", bucket: "short-e" },
      ],
      note: "You already knew desk, pen, and pencil — and 'desk' appeared in today's story!",
    },
  },
  rolePlay: {
    title: "Describe Your Study Space",
    conversation: {
      title: "A look around our classroom",
      scene: "Dito and Sari look at things near their desk and across the room.",
      image: classroomConversationImage,
      imageAlt: "A boy pointing to a nearby pencil and books while a girl shows a whiteboard and distant posters.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 0, text: "This is my pencil. It's yellow." },
        { role: 1, text: "What are these on the desk?" },
        { role: 0, text: "These are my books. I read them after class." },
        { role: 1, text: "What is that over there?" },
        { role: 0, text: "That is our whiteboard. It's next to the cupboard." },
        { role: 1, text: "And what are those on the far wall?" },
        { role: 0, text: "Those are posters. My favorite poster is green." },
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
    { question: "___ is my pen. (near me)", options: ["This", "Those", "These", "That"], answer: "This" },
    { question: "___ are the posters on the far wall.", options: ["Those", "This", "These", "That"], answer: "Those" },
    { question: "The whiteboard ___ white.", options: ["is", "are", "am", "be"], answer: "is" },
    { question: "Which word means 'shows the time'?", options: ["clock", "map", "shelf", "drawer"], answer: "clock" },
    { question: "What are these? (many pencils, near you)", options: ["These are pencils.", "This is pencils.", "Those is pencils.", "That are pencils."], answer: "These are pencils." },
  ],
  bossFight: { minQuestions: 12, hpPerHit: 10, bossRegen: 10, name: "Chalk Dust Dragon", emoji: "🐉" },
  sticker: { name: "Golden Whiteboard", emoji: "🏫" },
};

const lesson4: Lesson = {
  id: "lesson-4",
  number: 4,
  title: "Family, Friends & Neighbors",
  subtitle: "Is she? / Is he? / Are they?",
  emoji: "👨‍👩‍👧‍👦",
  sentenceFrames: ["Is she your ___?", "Is he your ___?", "Are they your ___?", "___ is ___ years old."],
  speedRoundSeconds: 10,
  vocabulary: [
    { word: "aunt", meaning: "your mother's or father's sister", example: "She is my aunt.", emoji: "👩" },
    { word: "uncle", meaning: "your mother's or father's brother", example: "Is he your uncle?", emoji: "🧔" },
    { word: "cousin", meaning: "your aunt's or uncle's child", example: "My cousin is 14 years old.", emoji: "🧒" },
    {
      word: "grandparents",
      meaning: "grandmother + grandfather together (always plural!)",
      example: "They are my grandparents.",
      emoji: "👴👵",
      tag: "Always plural!",
    },
    { word: "neighbor", meaning: "someone who lives near your house", example: "Our neighbor is kind.", emoji: "🏠" },
    {
      word: "children",
      meaning: "more than one child (always plural!)",
      example: "They have three children.",
      emoji: "🧒🧒",
      tag: "Always plural!",
    },
  ],
  // Taught in an earlier course: they join the games, but not the words-learned bar.
  reviewVocabulary: [
    { word: "mother", meaning: "your female parent", example: "Is she your mother?", emoji: "👩" },
    { word: "father", meaning: "your male parent", example: "He is my father.", emoji: "👨" },
    { word: "brother", meaning: "a boy with the same parents as you", example: "My brother is 15.", emoji: "👦" },
    { word: "sister", meaning: "a girl with the same parents as you", example: "She is my sister.", emoji: "👧" },
    { word: "grandmother", meaning: "your mother's or father's mother", example: "My grandmother is kind.", emoji: "👵" },
    { word: "grandfather", meaning: "your mother's or father's father", example: "My grandfather is 72.", emoji: "👴" },
    { word: "parents", meaning: "your mother and father together", example: "They are my parents.", emoji: "👫" },
  ],
  grammar: {
    title: "Is she? / Is he? / Are they?",
    explanation:
      "To ask about ONE girl or woman, start with Is she. For ONE boy or man, start with Is he. For MANY people, start with Are they. To say an age: ___ is ___ years old.",
    patterns: [
      { subject: "Is she", verb: "", rest: "your mother?", note: "Yes, she is. / No, she isn't." },
      { subject: "Is he", verb: "", rest: "your uncle?", note: "Yes, he is. / No, he isn't." },
      { subject: "Are they", verb: "", rest: "your grandparents?", note: "Yes, they are. / No, they aren't." },
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
    ],
  },
  expressions: [
    { prompt: "Is she your mother?", answer: "Yes, she is." },
    { prompt: "Is he your uncle?", answer: "No, he isn't. He's my father." },
    { prompt: "Are they your grandparents?", answer: "Yes, they are." },
    { prompt: "How old is your cousin?", answer: "She is 14 years old." },
    { prompt: "Who is your neighbor?", answer: "Our neighbor is Mr. Budi. He is kind." },
    { prompt: "Do you have any cousins?", answer: "Yes, I have two cousins." },
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
      { id: "f1", name: "Grandpa Hasan", age: 72, emoji: "👴", gender: "male", relation: "grandparent" },
      { id: "f2", name: "Grandma Siti", age: 70, emoji: "👵", gender: "female", relation: "grandparent" },
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
    // Passage, questions and in-passage word hunt are pure config — fill them in later.
    paragraphs: [],
    placeholder: "Reading passage coming soon — the tutor will add the text.",
    questions: [],
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
      scene: "Sari shows Dito some photos in her family album.",
      image: familyConversationImage,
      imageAlt: "Two children looking at family photos of grandparents, an aunt and a cousin in an album.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 0, text: "Are they your grandparents?" },
        { role: 1, text: "Yes, they are. They live near our house." },
        { role: 0, text: "Is she your mother?" },
        { role: 1, text: "No, she isn't. She's my aunt. She is 35 years old." },
        { role: 0, text: "Is he your cousin?" },
        { role: 1, text: "Yes, he is. His name is Rafi." },
        { role: 0, text: "How old is he?" },
        { role: 1, text: "He is 14 years old. We like playing football together." },
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
    { question: "Are they your grandparents? (say YES)", options: ["Yes, they are.", "Yes, she is.", "Yes, he is.", "Yes, it is."], answer: "Yes, they are." },
    { question: "My cousin ___ 14 years old.", options: ["is", "are", "am", "be"], answer: "is" },
    { question: "Which word means 'someone who lives near your house'?", options: ["neighbor", "cousin", "uncle", "aunt"], answer: "neighbor" },
    { question: "Which word is ALWAYS plural?", options: ["children", "child", "cousin", "aunt"], answer: "children" },
  ],
  bossFight: { minQuestions: 12, hpPerHit: 10, bossRegen: 10, name: "Question Kraken", emoji: "🐙" },
  sticker: { name: "Family Photo Frame", emoji: "🖼️" },
};

export const LESSONS: Lesson[] = [lesson1, lesson2, lesson3, lesson4];


