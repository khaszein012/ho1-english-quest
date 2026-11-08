/* =============================================================================
 * ARSYAD'S ENGLISH QUEST — SINGLE LESSON CONFIG FILE (COURSE LEVEL: A2)
 * -----------------------------------------------------------------------------
 * EVERY piece of lesson content the app shows lives in the LESSONS array at the
 * bottom of this file: one entry per lesson. Screens and components read from it
 * and never hardcode content.
 *
 * LEVEL A2 (2026 rewrite, 10-year-old learner). The grammar climbs lesson by
 * lesson and every boss mixes in review questions from earlier lessons:
 *   lesson 1 — present continuous (happening now)
 *   lesson 2 — comparatives & superlatives
 *   lesson 3 — there is / there are + prepositions of place
 *              (this/that/these/those stay as the near/far practice game)
 *   lesson 4 — past simple (was/were + -ed + common irregulars)
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

/**
 * The ONLY browser-storage key this app touches. The "quest_" prefix keeps it in
 * its own namespace, so the app can never read or overwrite data written by any
 * other app on the same browser. Bump the version suffix if the saved shape changes.
 * v1 held the finished A1 course; v2 starts the A2 course from zero stars.
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

/** A2 fights are longer and mix in more review than the A1 course did. */
export const BOSS_FIGHT_DEFAULTS = {
  minQuestions: 15,
  hpPerHit: 10,
  bossRegen: 10,
  reviewQuestions: 3,
  maxHp: 100,
  surrenderAfter: 30,
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
 * LESSON 1 — MY SCHOOL SUPPLIES · Present Continuous
 * ============================================================================= */

const lesson1: Lesson = {
  id: "lesson-1",
  number: 1,
  title: "My School Supplies",
  subtitle: "Present Continuous",
  emoji: "🎒",
  sentenceFrames: [
    "I'm putting my ___ in my backpack.",
    "She's looking for her ___.",
    "What are you doing? — I'm ___-ing.",
  ],
  speedRoundSeconds: 10,
  vocabulary: [
    {
      word: "backpack",
      meaning: "a bag you carry on your back for school",
      example: "I'm putting my books in my backpack.",
      emoji: "🎒",
    },
    {
      word: "notebook",
      meaning: "a book for writing your own notes",
      example: "She's writing the date in her notebook.",
      emoji: "📓",
    },
    {
      word: "pencil case",
      meaning: "a small bag for pens and pencils",
      example: "He's looking for his pencil case.",
      emoji: "🧰",
    },
    {
      word: "ruler",
      meaning: "a straight tool for measuring and drawing lines",
      example: "I'm drawing a straight line with my ruler.",
      emoji: "📏",
    },
    {
      word: "stapler",
      meaning: "a tool that joins papers together",
      example: "The teacher is stapling our test papers.",
      emoji: "📎",
    },
    {
      word: "sticky tape",
      meaning: "tape for sticking paper together",
      example: "I'm sticking the poster up with sticky tape.",
      emoji: "🩹",
      tag: "Uncountable!",
    },
    {
      word: "textbook",
      meaning: "a book you study from in class",
      example: "We're reading page ten in our textbook.",
      emoji: "📕",
    },
    {
      word: "pen",
      meaning: "a tool for writing in ink",
      example: "I'm writing my name with my blue pen.",
      emoji: "🖊️",
    },
    {
      word: "pencil",
      meaning: "a tool for writing in grey lead",
      example: "He's sharpening his pencil.",
      emoji: "✏️",
    },
    {
      word: "highlighter",
      meaning: "a bright marker for important words",
      example: "I'm marking the new words with my highlighter.",
      emoji: "🖍️",
    },
    {
      word: "eraser",
      meaning: "a tool for removing pencil marks",
      example: "She's erasing the mistake with her eraser.",
      emoji: "🧽",
    },
    {
      word: "calculator",
      meaning: "a tool for doing math",
      example: "He's using a calculator for the big numbers.",
      emoji: "🧮",
    },
    {
      word: "glue",
      meaning: "a sticky liquid for joining paper",
      example: "I'm gluing the pieces together with glue.",
      emoji: "🧴",
      tag: "Uncountable!",
    },
    {
      word: "scissors",
      meaning: "a tool with two blades for cutting paper",
      example: "Be careful! She's cutting paper with the scissors.",
      emoji: "✂️",
      tag: "Always plural!",
    },
  ],
  grammar: {
    title: "Present Continuous — Happening Now",
    explanation:
      "When something is happening RIGHT NOW, use am, is, or are + a verb with -ing. I am → I'm. She is → She's. They are → They're. To ask what someone is doing, swap the words around: 'What are you doing?'",
    tip: "💛 NOW WORDS — am / is / are + verb-ing",
    patterns: [
      { subject: "I am", verb: "packing", rest: "my school bag.", note: "I am = I'm" },
      { subject: "She is", verb: "looking", rest: "for her pencil case.", note: "She is = She's" },
      { subject: "We are", verb: "waiting", rest: "for the teacher.", note: "We are = We're" },
      { subject: "He is not", verb: "listening", rest: "to the story.", note: "is not = isn't" },
      {
        subject: "Are you",
        verb: "bringing",
        rest: "your textbook?",
        note: "Yes, I am. / No, I'm not.",
      },
    ],
    examples: [
      "I'm putting my ruler in my backpack.",
      "Sari isn't coming to school today.",
      "What are you doing? — I'm reading a comic.",
      "The students are working in pairs.",
    ],
    yourTurn: [
      {
        question: "Dito ___ his homework right now.",
        options: ["is doing", "does", "do"],
        answer: "is doing",
      },
      { question: "___ you listening to me?", options: ["Are", "Do", "Is"], answer: "Are" },
      {
        question: "The students ___ working in pairs.",
        options: ["are", "is", "be"],
        answer: "are",
      },
      {
        question: "I'm not ___ TV because I'm busy.",
        options: ["watching", "watch", "watches"],
        answer: "watching",
      },
      { question: "Look! It ___ raining.", options: ["is", "are", "am"], answer: "is" },
      { question: "What ___ your friends doing?", options: ["are", "is", "do"], answer: "are" },
    ],
  },
  expressions: [
    {
      prompt: "What are you doing right now?",
      answer: "I'm studying English with my teacher.",
    },
    { prompt: "What is your friend doing?", answer: "She's writing in her notebook." },
    { prompt: "Where is your backpack?", answer: "It's on my chair. I'm keeping it next to me." },
    { prompt: "What are you wearing today?", answer: "I'm wearing my blue school uniform." },
    { prompt: "Is it raining right now?", answer: "No, it isn't. The sun is shining." },
    { prompt: "What are your classmates doing?", answer: "They're opening their textbooks." },
  ],
  practice: {
    title: "Backpack Check",
    instructions:
      "Flip a card and say what is happening now: I'm putting the ruler in my bag! / She's looking for her pencil case! Then your tutor asks: What are you doing? Answer with a verb + -ing.",
  },
  reading: {
    title: "Students of the Future",
    illustration: {
      image: futureSchoolReadingImage,
      alt: "Dito uses a tablet and stylus at school, with a blue notebook, ruler, highlighter and pizza lunchbox nearby.",
    },
    paragraphs: [
      "It is Tuesday morning, and Dito is walking to school with his blue backpack on his back. The sun is shining. In his hand, he is holding a small ruler with a cute robot on it. He is looking for Sari, but she is not at the gate.",
      "Inside the classroom, something exciting is happening. The students are not writing on paper today. They are using tablets, and the teacher is showing a science video on the big whiteboard. 'Look!' Dito says. 'The rocket is flying across the screen!'",
      "After class, everyone is cleaning the room together. Sari is putting the tablets on the shelf, and Dito is stacking the chairs. 'School is changing,' says Sari, 'but we are still learning together — and that will never change.'",
    ],
    questions: [
      {
        question: "What is Dito holding in his hand?",
        options: ["a small ruler", "a tablet", "a rocket", "a comic"],
        answer: "a small ruler",
      },
      {
        question: "What are the students using in class today?",
        options: ["tablets", "paper", "slates", "chalk"],
        answer: "tablets",
      },
      {
        question: "What is the teacher showing on the whiteboard?",
        options: ["a science video", "a cartoon", "a map", "a game"],
        answer: "a science video",
      },
      {
        question: "What is Sari putting on the shelf?",
        options: ["the tablets", "the chairs", "her backpack", "the rulers"],
        answer: "the tablets",
      },
    ],
    stretchQuestion:
      "School is changing, but some things stay the same. What stays the same for Dito and Sari?",
    spotlight: {
      sound: "long U",
      exampleWord: "blue",
      instruction: "Find the words with the long U sound, like BLUE!",
      words: ["blue", "school", "Tuesday", "ruler", "cute"],
    },
  },
  rolePlay: {
    title: "What's Happening Now?",
    conversation: {
      title: "Ready for school",
      scene: "Dito is rushing to school and Sari is waiting at the gate.",
      image: schoolConversationImage,
      imageAlt:
        "Two schoolchildren talking about pencils, notebooks and a ruler in a red backpack.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 1, text: "Morning, Dito! You're walking very fast. Are you late again?" },
        {
          role: 0,
          text: "I think so! It's seven thirty, and I'm still putting my books in my bag.",
        },
        { role: 1, text: "Hurry up! I'm waiting here with two water bottles — one is for you." },
        { role: 0, text: "Thanks, Sari! Hey, what's that in your hand?" },
        { role: 1, text: "It's my new ruler. It has a cute robot on it. See?" },
        { role: 0, text: "It's very cute! My cousin is giving me one like that on Friday." },
        { role: 1, text: "Nice! Shh — the bell is ringing, and we're still outside!" },
        { role: 0, text: "You're right. I'm running now. See you in class!" },
      ],
    },
    prompts: [
      "Act it out: 'I'm putting my ___ in my bag.'",
      "Tell me what your teacher is doing right now.",
      "Ask me: 'What are you doing?' — then answer my question, too.",
      "Say three -ing words you can see around you right now.",
    ],
    twists: [
      "I'm talking to my cat — she's sitting on my notebook!",
      "Shh! My little brother is sleeping, so I'm whispering!",
    ],
    homework:
      "Record yourself doing an action at home: 'I'm ___-ing right now!' Then record a second video and say what a family member is doing: 'He/She is ___-ing.'",
  },
  selfCheck: [
    "Can I say what people are doing right now with verb + -ing?",
    "Can I use I'm / He's / She's / They're correctly?",
    "Can I ask 'What are you doing?'",
    "Can I name my school supplies in English?",
  ],
  boss: [
    { question: "Dito ___ packing his bag right now.", options: ["is", "are", "am"], answer: "is" },
    { question: "Sari ___ looking for her ruler.", options: ["is", "are", "be"], answer: "is" },
    { question: "___ you listening to the story?", options: ["Are", "Is", "Do"], answer: "Are" },
    { question: "The students ___ reading quietly.", options: ["are", "is", "am"], answer: "are" },
    {
      question: "I'm not ___ the TV now.",
      options: ["watching", "watch", "watches"],
      answer: "watching",
    },
    {
      question: "What ___ she doing? — She's drawing.",
      options: ["is", "are", "does"],
      answer: "is",
    },
    {
      question: "Look! The cat ___ sleeping on my chair.",
      options: ["is", "are", "am"],
      answer: "is",
    },
  ],
  bossFight: { name: "Backpack Bandit", emoji: "🧹" },
  sticker: { name: "Golden Backpack", emoji: "🎒" },
};

/* =============================================================================
 * LESSON 2 — MY THINGS · Comparatives & Superlatives
 * ============================================================================= */

const lesson2: Lesson = {
  id: "lesson-2",
  number: 2,
  title: "My Things",
  subtitle: "Comparatives & Superlatives",
  emoji: "🛹",
  sentenceFrames: [
    "My ___ is faster than my ___.",
    "This is the best ___ in the world.",
    "A ___ is more useful than a ___.",
  ],
  speedRoundSeconds: 10,
  vocabulary: [
    {
      word: "bicycle",
      meaning: "a two-wheel vehicle you ride",
      example: "My bicycle is faster than my skateboard.",
      emoji: "🚲",
    },
    {
      word: "skateboard",
      meaning: "a board with wheels you stand on",
      example: "Is your skateboard older than mine?",
      emoji: "🛹",
    },
    {
      word: "board game",
      meaning: "a game you play on a board with pieces",
      example: "Board games are more fun than phone games.",
      emoji: "🎲",
    },
    {
      word: "playing cards",
      meaning: "a set of cards for games (always plural!)",
      example: "These playing cards are older than our house!",
      emoji: "🃏",
      tag: "Always plural!",
    },
    {
      word: "puzzle",
      meaning: "many small pieces you join to make a picture",
      example: "This puzzle is the hardest one in the box.",
      emoji: "🧩",
    },
    {
      word: "video game",
      meaning: "a game you play on a screen",
      example: "My new video game is more exciting than the old one.",
      emoji: "🎮",
    },
    {
      word: "headphones",
      meaning: "you wear them to listen (always plural!)",
      example: "Music sounds better on my new headphones than on my old ones.",
      emoji: "🎧",
      tag: "Always plural!",
    },
    {
      word: "phone",
      meaning: "a device for calling and messaging",
      example: "My phone is newer than my brother's phone.",
      emoji: "📱",
    },
    {
      word: "football",
      meaning: "a ball for playing football",
      example: "A football is cheaper than a badminton racket.",
      emoji: "⚽",
    },
    {
      word: "badminton racket",
      meaning: "you hit a shuttlecock with it",
      example: "This racket is lighter than my old one.",
      emoji: "🏸",
    },
    {
      word: "backpack",
      meaning: "a bag for your back",
      example: "My backpack is heavier than my sister's — I have more books!",
      emoji: "🎒",
    },
    {
      word: "watch",
      meaning: "you wear it to see the time",
      example: "Grandpa's watch is older than my dad's car.",
      emoji: "⌚",
    },
    {
      word: "wallet",
      meaning: "you keep money and cards in it",
      example: "A small wallet is more useful than a big bag.",
      emoji: "👛",
    },
    {
      word: "water bottle",
      meaning: "you drink water from it",
      example: "My water bottle is fuller than yours!",
      emoji: "🧴",
    },
  ],
  grammar: {
    title: "Comparatives & Superlatives — Bigger, Biggest!",
    explanation:
      "Compare TWO things with -er + than (faster than). Pick the winner of MANY things with the -est (the fastest). Long words don't like -er/-est — give them more and the most instead (more exciting, the most exciting).",
    tip: "⭐ COMPARE WORDS — -er / -est / more / the most",
    patterns: [
      {
        subject: "My bicycle is",
        verb: "faster",
        rest: "than your skateboard.",
        note: "fast → faster + than",
      },
      {
        subject: "This puzzle is",
        verb: "harder",
        rest: "than that board game.",
        note: "hard → harder",
      },
      { subject: "It is the", verb: "biggest", rest: "toy in the box.", note: "big → the biggest" },
      {
        subject: "Tablets are",
        verb: "more expensive",
        rest: "than books.",
        note: "long words → more + word",
      },
      {
        subject: "It is the",
        verb: "most beautiful",
        rest: "poster in the class.",
        note: "long words → the most + word",
      },
    ],
    examples: [
      "My headphones are newer than yours.",
      "This is the most exciting video game I have.",
      "A watch is more useful than a toy.",
      "Summer is the hottest time of the year.",
    ],
    yourTurn: [
      {
        question: "My bag is ___ than yours.",
        options: ["heavier", "heavyest", "more heavy"],
        answer: "heavier",
      },
      {
        question: "This is the ___ film of the year.",
        options: ["funniest", "funnier", "most funny"],
        answer: "funniest",
      },
      {
        question: "A drone is ___ exciting than a kite.",
        options: ["more", "most", "much"],
        answer: "more",
      },
      {
        question: "Badminton is ___ than chess for me.",
        options: ["easier", "more easy", "easiest"],
        answer: "easier",
      },
      {
        question: "That was the ___ day of my holiday.",
        options: ["best", "better", "goodest"],
        answer: "best",
      },
      {
        question: "My new bike is ___ than my old one.",
        options: ["faster", "more fast", "fastest"],
        answer: "faster",
      },
    ],
  },
  expressions: [
    { prompt: "Which is faster, your bike or the bus?", answer: "The bus is faster than my bike." },
    {
      prompt: "What is the best thing you own?",
      answer: "My tablet. It's the most useful thing I have.",
    },
    {
      prompt: "Is your backpack heavier than your friend's?",
      answer: "Yes, it is. I'm carrying more books.",
    },
    { prompt: "What is more fun than homework?", answer: "Playing football with my friends!" },
    { prompt: "Which is the biggest city in Indonesia?", answer: "Jakarta is the biggest city." },
    {
      prompt: "What is the most delicious food you know?",
      answer: "My grandmother's fried rice. Nobody cooks it better.",
    },
  ],
  practice: {
    title: "What Is It?",
    instructions:
      "Flip a belongings card face-down, then reveal it. Compare it with another thing: My skateboard is faster than my bicycle! / Headphones are more useful than a watch! Then answer: Which is better — yours or your friend's? Why?",
  },
  reading: {
    title: "Grandpa's Toy Box",
    illustration: {
      image: grandpaToysReadingImage,
      alt: "A grandfather and child explore a wooden toy airplane, blocks, a grey rocking horse and a brown-and-white pony beside modern games and headphones.",
    },
    paragraphs: [
      "Grandpa Bayu keeps an old wooden box under the bed in his room. Inside the box, there are toys from many years ago. 'These toys are older than you!' he laughs. 'Maybe they are even older than your father!'",
      "His favorite toy is a small red car. 'It is smaller than your video games, but it is more special to me,' he says. 'My father made it from real metal. It was the most expensive toy in the shop at that time.'",
      "Sari thinks the toys are fascinating. 'Board games are more fun than phone games,' says Grandpa. 'When I was young, we played together in one room, and the winner was the happiest kid in the street.'",
      "At the end of the afternoon, Dito and Sari help Grandpa close the box. 'The best part of the box isn't a toy,' Grandpa smiles. 'It's the stories.'",
    ],
    questions: [
      {
        question: "Where is the toy box?",
        options: ["under the bed", "in the kitchen", "on the shelf", "in the garden"],
        answer: "under the bed",
      },
      {
        question: "What is Grandpa's favorite toy?",
        options: ["a small red car", "a wooden airplane", "a board game", "a rocking horse"],
        answer: "a small red car",
      },
      {
        question: "What was the little car made from?",
        options: ["real metal", "plastic", "wood", "paper"],
        answer: "real metal",
      },
      {
        question: "What does Grandpa say is the best part of the box?",
        options: ["the stories", "the red car", "the wooden blocks", "the money"],
        answer: "the stories",
      },
    ],
    stretchQuestion:
      "Grandpa says old toys and new toys are both fun. What do you think — and why?",
    spotlight: {
      sound: "long O",
      exampleWord: "boat",
      instruction:
        "Listen to each word. They all have the long O sound, like BOAT! Tap to confirm each one.",
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
      imageAlt:
        "Two children identifying a blue bottle, headphones, playing cards and a red bicycle at a park table.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 1, text: "Whose tablet is this? It's newer than mine." },
        {
          role: 0,
          text: "It's mine! My uncle gave it to me for my birthday. It was the best present ever.",
        },
        { role: 1, text: "Wow. Is it faster than your old phone?" },
        {
          role: 0,
          text: "Much faster! And the camera is better too. Look at this photo of your skateboard.",
        },
        { role: 1, text: "Hey, nice photo! My new skateboard is more colorful than my old one." },
        { role: 0, text: "True! And what's that in the big box under your chair?" },
        {
          role: 1,
          text: "It's my model airplane. It's the most difficult thing I own — a hundred tiny pieces!",
        },
        {
          role: 0,
          text: "Show and Tell is going to be fun today. Your things are more interesting than mine!",
        },
      ],
    },
    prompts: [
      "Show me 3 things and compare them: 'My ___ is ___er than my ___.'",
      "Tell me your favourite thing and why: 'My ___ is the best ___ because...'",
      "Ask me: 'Which is more fun, ___ or ___?'",
      "Use 'the most' with a long word once: 'It's the most exciting ___ I have.'",
    ],
    twists: [
      "My tablet is more expensive than a bicycle — but it was a gift!",
      "These playing cards are older than my grandma!",
    ],
    homework:
      "Record a comparison of 4 of your things: use -er + than twice, more + word once, and the -est / the most once. Example: 'My bicycle is faster than my skateboard. My headphones are more useful than a watch. This video game is the best.'",
  },
  selfCheck: [
    "Can I compare two things with -er + than?",
    "Can I use the -est for the winner of many?",
    "Can I use more / the most with long words?",
    "Can I name my things in English?",
  ],
  boss: [
    {
      question: "My bike is ___ than your bike.",
      options: ["faster", "fast", "fastest"],
      answer: "faster",
    },
    {
      question: "This is the ___ book in the library.",
      options: ["oldest", "older", "old"],
      answer: "oldest",
    },
    {
      question: "A tablet is ___ expensive than a book.",
      options: ["more", "most", "the"],
      answer: "more",
    },
    {
      question: "Summer is ___ than winter.",
      options: ["hotter", "hottest", "more hot"],
      answer: "hotter",
    },
    {
      question: "That was the ___ day ever!",
      options: ["best", "better", "goodest"],
      answer: "best",
    },
    {
      question: "My drone is ___ than my kite.",
      options: ["more exciting", "most exciting", "excited"],
      answer: "more exciting",
    },
    {
      question: "He is the ___ runner in the class.",
      options: ["fastest", "faster", "more fast"],
      answer: "fastest",
    },
  ],
  bossFight: { name: "Mix-Up Monster", emoji: "👽" },
  sticker: { name: "Treasure Chest", emoji: "🧰" },
};

/* =============================================================================
 * LESSON 3 — MY CLASSROOM · There Is / There Are + Prepositions
 * (this/that/these/those stay alive in the "Near or Far?" practice game)
 * ============================================================================= */

const lesson3: Lesson = {
  id: "lesson-3",
  number: 3,
  title: "My Classroom",
  subtitle: "There Is / There Are",
  emoji: "🏫",
  // These four frames feed the near/far Practice Game (this/that/these/those).
  sentenceFrames: ["This is a ___.", "That is a ___.", "These are ___.", "Those are ___."],
  speedRoundSeconds: 10,
  vocabulary: [
    // `cue` + `many` feed the Practice Game's near/far zoom frame (this/that/these/those).
    {
      word: "bookcase",
      meaning: "a piece of furniture that holds books",
      example: "There are two big bookcases in our library.",
      emoji: "📚",
      cue: "far",
    },
    {
      word: "calendar",
      meaning: "shows the days and months on a wall",
      example: "There is a calendar above the teacher's desk.",
      emoji: "📅",
      cue: "far",
    },
    {
      word: "chair",
      meaning: "you sit on it",
      example: "There are twenty chairs in front of me.",
      emoji: "🪑",
      cue: "near",
    },
    {
      word: "clock",
      meaning: "shows the time",
      example: "There is a red clock above the door.",
      emoji: "🕐",
      cue: "far",
    },
    {
      word: "computer",
      meaning: "a machine for work and games",
      example: "There is a computer on my desk.",
      emoji: "💻",
      cue: "near",
    },
    {
      word: "cupboard",
      meaning: "furniture with doors for keeping things",
      example: "Those cupboards are behind the teacher's desk.",
      emoji: "🗄️",
      cue: "far",
      many: true,
    },
    {
      word: "desk",
      meaning: "the table where you study",
      example: "This desk is next to the window.",
      emoji: "🪑",
      cue: "near",
    },
    {
      word: "drawer",
      meaning: "a part that slides out of a desk",
      example: "My pens are in the drawer under my desk.",
      emoji: "🗃️",
      cue: "near",
    },
    {
      word: "map",
      meaning: "a picture of countries or the world",
      example: "There is a map of Indonesia between the windows.",
      emoji: "🗺️",
      cue: "far",
    },
    {
      word: "poster",
      meaning: "a big picture on the wall",
      example: "Those posters are above the whiteboard.",
      emoji: "🖼️",
      cue: "far",
      many: true,
    },
    {
      word: "shelf",
      meaning: "a flat board on the wall for keeping things",
      example: "There is a shelf full of books on the wall.",
      emoji: "📚",
      cue: "far",
    },
    {
      word: "whiteboard",
      meaning: "a big white board the teacher writes on",
      example: "There is a big whiteboard in front of the class.",
      emoji: "⬜",
      cue: "far",
    },
    {
      word: "projector",
      meaning: "shows the teacher's screen on the wall",
      example: "The projector is on the ceiling, above our heads.",
      emoji: "📽️",
      cue: "far",
    },
    {
      word: "air conditioner",
      meaning: "keeps the classroom cool",
      example: "There is an air conditioner above the window.",
      emoji: "❄️",
      cue: "far",
    },
  ],
  grammar: {
    title: "There Is / There Are — Saying Where",
    explanation:
      "Use there is + ONE thing and there are + TWO or more. Say WHERE with prepositions: on, in, under, next to, between, behind, in front of, above. Ask Is there…? for one thing and Are there any…? for many.",
    tip: "📍 WHERE WORDS — on · in · under · next to · between · behind",
    patterns: [
      { subject: "There is", verb: "a map", rest: "on the wall.", note: "ONE thing → there is" },
      {
        subject: "There are",
        verb: "some posters",
        rest: "between the windows.",
        note: "TWO or more → there are",
      },
      {
        subject: "Is there",
        verb: "a computer",
        rest: "in your classroom?",
        note: "Yes, there is. / No, there isn't.",
      },
      {
        subject: "Are there",
        verb: "any plants",
        rest: "in your classroom?",
        note: "Yes, there are. / No, there aren't.",
      },
      {
        subject: "There isn't",
        verb: "a lift",
        rest: "in our school.",
        note: "negative → there isn't / there aren't",
      },
    ],
    examples: [
      "There is a clock above the door.",
      "There are four computers next to the door.",
      "There isn't a lift in our school.",
      "Is there a library in your town? — Yes, there is one behind the market.",
    ],
    yourTurn: [
      {
        question: "There ___ a big bookcase in the corner.",
        options: ["is", "are", "be"],
        answer: "is",
      },
      {
        question: "There ___ some drawers under my desk.",
        options: ["are", "is", "isn't"],
        answer: "are",
      },
      {
        question: "The cat is ___ the table — I can't see it!",
        options: ["under", "above", "between"],
        answer: "under",
      },
      {
        question: "___ there any computers in the library?",
        options: ["Are", "Is", "Do"],
        answer: "Are",
      },
      {
        question: "The teacher's desk is ___ the whiteboard.",
        options: ["in front of", "between", "above"],
        answer: "in front of",
      },
      {
        question: "There isn't ___ glue in my pencil case.",
        options: ["any", "some", "a"],
        answer: "any",
      },
    ],
  },
  expressions: [
    {
      prompt: "What is there on your desk?",
      answer: "There is a lamp, and there are some pencils.",
    },
    {
      prompt: "Is there a whiteboard in your classroom?",
      answer: "Yes, there is. It's in front of the class.",
    },
    {
      prompt: "Are there any plants in your classroom?",
      answer: "Yes, there are two. They're next to the window.",
    },
    { prompt: "Where is the clock in your room?", answer: "It's above the door." },
    { prompt: "What is there under your bed?", answer: "There are some boxes full of toys." },
    {
      prompt: "Is there a library near your house?",
      answer: "Yes, there is one behind the market.",
    },
  ],
  practice: {
    title: "Near or Far?",
    instructions:
      "Look at the card: is the thing NEAR you or FAR away? One thing or many? Say it: This is a ___. / That is a ___. / These are ___. / Those are ___. Then say WHERE it is: It is next to the window. / They are above the whiteboard.",
  },
  reading: {
    title: "A School With One Room",
    illustration: {
      image: oneRoomSchoolReadingImage,
      alt: "An illustrated 1930 one-room school with a red building, white porch, one teacher and Margaret writing with chalk on a slate.",
    },
    paragraphs: [
      "This is a photo of an old school in the United States from 1930. In the picture, there is a small red building with a white porch. There is only one room inside, but there are students of every age in it.",
      "Margaret is one of the students. She lives in a small town with her family. In her classroom, there are three long desks in front of the blackboard, and there is one teacher for everyone. Her older brother William is sitting between two friends near the window.",
      "There aren't any notebooks or pencil cases on the desks. There is a black slate on every desk, and there is some chalk in the box under it. On the shelf behind the teacher, there are a few textbooks — but they are only for the teacher.",
      "Margaret's favorite time is story time, when the teacher tells stories about the past. There is no better class for Margaret — and when she grows up, she wants to be a teacher, too.",
    ],
    questions: [
      {
        question: "Where is the school in the photo?",
        options: ["in the United States", "in Indonesia", "in a big city", "on a farm"],
        answer: "in the United States",
      },
      {
        question: "What is there on every desk?",
        options: ["a black slate", "a notebook", "a textbook", "a pencil case"],
        answer: "a black slate",
      },
      {
        question: "Where are the textbooks?",
        options: [
          "on the shelf behind the teacher",
          "under the desks",
          "in Margaret's bag",
          "next to the door",
        ],
        answer: "on the shelf behind the teacher",
      },
      {
        question: "Who is sitting between two friends near the window?",
        options: ["William", "Margaret", "the teacher", "nobody"],
        answer: "William",
      },
    ],
    stretchQuestion:
      "Margaret has no notebook and no textbook, but she is happy at school. Why do you think that is?",
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
      scene: "Dito is showing Sari around the classroom for the first time.",
      image: classroomConversationImage,
      imageAlt:
        "A boy pointing to a nearby pencil and books while a girl shows a whiteboard and distant posters.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 0, text: "Welcome to our classroom, Sari! Let me show you around." },
        { role: 1, text: "Thanks! Wow, there are so many posters on the walls." },
        {
          role: 0,
          text: "Yes, and there are two big maps above the whiteboard. The world map is my favorite.",
        },
        { role: 1, text: "I see it! And what's that between the bookcase and the window?" },
        {
          role: 0,
          text: "That's our class plant. There isn't another one, so we take turns giving it water.",
        },
        { role: 1, text: "Funny! Are there any computers in here?" },
        {
          role: 0,
          text: "There are four computers next to the door. They're older than the ones in the library, but they still work.",
        },
        {
          role: 1,
          text: "It's a nice room. There's a lot to look at — I think I'll learn a lot here!",
        },
      ],
    },
    prompts: [
      "Describe my desk: 'There is a ___ on it.'",
      "Say where two things are: 'The ___ is next to / above / under the ___.'",
      "Ask me: 'Is there a ___ in your classroom?' / 'Are there any ___?'",
      "Play the near/far game: point and say 'This/That is a ___.'",
    ],
    twists: [
      "There is a spider above the whiteboard — nobody move!",
      "There aren't any chairs today — we're sitting on the floor!",
    ],
    homework:
      "Record a tour of your room: use There is... three times and There are... two times, and say where each thing is (on, in, under, next to, above, behind, between).",
  },
  selfCheck: [
    "Can I use There is for one thing and There are for many?",
    "Can I say where things are with prepositions?",
    "Can I ask 'Is there…?' and 'Are there any…?'",
    "Can I describe my classroom in English?",
  ],
  boss: [
    { question: "There ___ a clock above the door.", options: ["is", "are", "be"], answer: "is" },
    {
      question: "There ___ some chairs in front of the class.",
      options: ["are", "is", "be"],
      answer: "are",
    },
    {
      question: "The ball is ___ the box. I can't see it!",
      options: ["under", "above", "on"],
      answer: "under",
    },
    { question: "___ there any windows behind you?", options: ["Are", "Is", "Do"], answer: "Are" },
    {
      question: "There is a map ___ the two posters.",
      options: ["between", "under", "on"],
      answer: "between",
    },
    {
      question: "There isn't ___ paper on my desk.",
      options: ["any", "some", "many"],
      answer: "any",
    },
    {
      question: "The teacher's desk is ___ ___ the whiteboard.",
      options: ["in front of", "on between", "under above"],
      answer: "in front of",
    },
  ],
  bossFight: { name: "Chalk Dust Dragon", emoji: "🐉" },
  sticker: { name: "Golden Whiteboard", emoji: "🏫" },
};

/* =============================================================================
 * LESSON 4 — FAMILY, FRIENDS & NEIGHBORS · Past Simple
 * ============================================================================= */

const lesson4: Lesson = {
  id: "lesson-4",
  number: 4,
  title: "Family, Friends & Neighbors",
  subtitle: "Past Simple",
  emoji: "👨‍👩‍👧‍👦",
  sentenceFrames: [
    "Yesterday I ___-ed with my ___.",
    "Last weekend we went to ___.",
    "It was the ___ day of the week.",
  ],
  speedRoundSeconds: 10,
  vocabulary: [
    {
      word: "aunt",
      meaning: "your mother's or father's sister",
      example: "My aunt made a big dinner for us yesterday.",
      emoji: "👩",
    },
    {
      word: "uncle",
      meaning: "your mother's or father's brother",
      example: "My uncle told us a funny story last night.",
      emoji: "🧔",
    },
    {
      word: "cousin",
      meaning: "your aunt's or uncle's child",
      example: "My cousin visited us last weekend.",
      emoji: "🧒",
    },
    {
      word: "grandparents",
      meaning: "grandmother + grandfather together (always plural!)",
      example: "We went to my grandparents' house on Sunday.",
      emoji: "👴👵",
      tag: "Always plural!",
    },
    {
      word: "neighbor",
      meaning: "someone who lives near your house",
      example: "Our neighbor helped us carry the boxes.",
      emoji: "🏠",
    },
    {
      word: "children",
      meaning: "more than one child (always plural!)",
      example: "The children played badminton in the street.",
      emoji: "🧒🧒",
      tag: "Always plural!",
    },
    {
      word: "twins",
      meaning: "two children born on the same day to the same mother (always plural!)",
      example: "My cousins are twins — they were born on the same day!",
      emoji: "👯",
      tag: "Always plural!",
    },
    {
      word: "kind",
      meaning: "friendly and helpful to people",
      example: "Grandma was very kind — she gave me her umbrella.",
      emoji: "😊",
    },
    {
      word: "funny",
      meaning: "it makes you laugh",
      example: "Uncle Bayu was the funniest person at the party.",
      emoji: "🤣",
    },
    {
      word: "clever",
      meaning: "quick at learning and understanding things",
      example: "My cousin is clever — she fixed my drone!",
      emoji: "🧠",
    },
    {
      word: "strict",
      meaning: "makes many rules and watches them closely",
      example: "My grandpa was strict, but he was kind, too.",
      emoji: "🧑‍🏫",
    },
    {
      word: "generous",
      meaning: "happy to give things to other people",
      example: "Aunt Lina is generous — she always brings presents.",
      emoji: "🎁",
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
    title: "Past Simple — Yesterday's Stories",
    explanation:
      "Finished actions in the past get -ed: played, visited, watched. Many common verbs are irregular: go → went, eat → ate, see → saw, have → had. Use was with I/he/she/it and were with you/we/they. For negatives use didn't + base verb: I didn't watch TV.",
    tip: "⏪ TIME MACHINE — yesterday + verb-ed",
    patterns: [
      {
        subject: "We",
        verb: "visited",
        rest: "my grandparents last Sunday.",
        note: "visit → visited (+ed)",
      },
      { subject: "I", verb: "went", rest: "to my cousin's house.", note: "go → went (irregular!)" },
      {
        subject: "She",
        verb: "made",
        rest: "fried rice for us.",
        note: "make → made (irregular!)",
      },
      { subject: "My weekend", verb: "was", rest: "really fun.", note: "was = past of is" },
      {
        subject: "I",
        verb: "didn't watch",
        rest: "TV last night.",
        note: "negative: didn't + base verb",
      },
    ],
    examples: [
      "Yesterday we played badminton after school.",
      "We were at my grandma's house all afternoon.",
      "I didn't watch TV last night.",
      "Where were you? — I was in the garden.",
    ],
    yourTurn: [
      {
        question: "I ___ my homework yesterday.",
        options: ["finished", "finish", "finishing"],
        answer: "finished",
      },
      {
        question: "We ___ to the beach last month.",
        options: ["went", "goed", "go"],
        answer: "went",
      },
      {
        question: "She ___ a funny story last night.",
        options: ["told", "tell", "telled"],
        answer: "told",
      },
      {
        question: "My cousins ___ at our house last weekend.",
        options: ["were", "was", "is"],
        answer: "were",
      },
      {
        question: "I ___ eat breakfast this morning.",
        options: ["didn't", "don't", "wasn't"],
        answer: "didn't",
      },
      {
        question: "___ you see the football match?",
        options: ["Did", "Was", "Were"],
        answer: "Did",
      },
    ],
  },
  expressions: [
    {
      prompt: "What did you do last weekend?",
      answer: "I visited my grandparents and played badminton.",
    },
    {
      prompt: "Where were you yesterday afternoon?",
      answer: "I was at home. I was doing my homework.",
    },
    {
      prompt: "Did you watch anything fun last night?",
      answer: "Yes, I did. I watched a cartoon with my sister.",
    },
    {
      prompt: "What was your favorite food when you were little?",
      answer: "It was fried chicken. I ate it every week!",
    },
    {
      prompt: "Who was your best friend in kindergarten?",
      answer: "Rafa was. He lived next to my house.",
    },
    {
      prompt: "What did you eat for breakfast this morning?",
      answer: "I ate eggs and rice. It was tasty.",
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
      "Last week, Sari's teacher asked the class to talk about their families. The students learned that families come in all shapes and sizes — every family was different.",
      "Dito lived with his parents and his older sister. Last month, his cousin Rafa stayed with Dito's family because Rafa's parents worked in another city. 'It was fun!' said Dito. 'We played badminton every afternoon, and Grandma cooked delicious food for us.'",
      "Ana's family was smaller — it was just her and her mother. 'My mother works hard, and she is my best friend,' Ana said. 'Last Sunday we made pancakes and watched a movie.'",
      "Bimo lived next door with his grandparents and his aunt. His aunt had three cats, and Bimo loved them. 'My grandmother told us the funniest stories,' he said. 'We laughed for hours!'",
      "At the end of the week, the class made a big poster called 'Our Families.' There were photos of brothers, sisters, cousins, aunts, uncles, and grandparents on it. Miss Rina wrote one sentence at the bottom: 'Families are different, but love is the same.'",
    ],
    questions: [
      {
        question: "Why did Rafa stay with Dito's family?",
        options: [
          "his parents worked in another city",
          "his house was too small",
          "he wanted to play badminton",
          "his school was closed",
        ],
        answer: "his parents worked in another city",
      },
      {
        question: "What did Ana and her mother do last Sunday?",
        options: [
          "made pancakes and watched a movie",
          "went to the beach",
          "visited grandparents",
          "played badminton",
        ],
        answer: "made pancakes and watched a movie",
      },
      {
        question: "Who does Bimo live with?",
        options: [
          "his grandparents and his aunt",
          "his parents and his sister",
          "his cousins",
          "his uncle and aunt",
        ],
        answer: "his grandparents and his aunt",
      },
      {
        question: "What did Miss Rina write on the poster?",
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
      "How is your family special? Tell the class two things your family did together last month.",
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
        { role: 0, text: "Hi Sari! What are you drawing?" },
        {
          role: 1,
          text: "I'm drawing my family for our class wall. Look — this is my aunt, and these are my cousins.",
        },
        { role: 0, text: "Nice! Did you visit them last weekend?" },
        {
          role: 1,
          text: "Yes! We went to my aunt's house on Saturday. She made fried rice — it was delicious.",
        },
        {
          role: 0,
          text: "Yum! My weekend was quieter. I stayed home and helped my father wash the car.",
        },
        { role: 1, text: "That sounds useful! Is that your grandpa in the photo on your desk?" },
        {
          role: 0,
          text: "Yes, it is. He was a teacher, and he told wonderful stories. He was the funniest person in our family.",
        },
        { role: 1, text: "He looks kind. Family time is the best, isn't it?" },
      ],
    },
    prompts: [
      "Draw and describe 3 people in your family.",
      "Tell one thing you did together: 'Last weekend we ___-ed...'",
      "Ask your teacher about THEIR weekend: 'What did you do last weekend?'",
    ],
    twists: [
      "My cousin is only 2 years old — she learned to walk last month!",
      "My uncle moved to another city — I didn't see him all year!",
    ],
    homework:
      "Interview someone at home in English! Ask: 'What did you do last weekend?' Then record your report: 'My ___ ___-ed last weekend. It was ___!' If nobody can answer in English, that's OK — ask the questions and answer them for that person yourself.",
    drawAndDescribe: true,
    drawChecklist: [
      "Draw 3 family members (stick figures are perfect!)",
      "Write one past-tense sentence for each: 'This is my aunt. She made me pancakes.'",
      "Let your teacher guess who is who!",
    ],
  },
  selfCheck: [
    "Can I tell a story about yesterday with -ed verbs?",
    "Can I use went, ate, saw, and had?",
    "Can I say where I was with was and were?",
    "Can I talk about my family in English?",
  ],
  boss: [
    { question: "Yesterday we ___ to the park.", options: ["went", "go", "goes"], answer: "went" },
    {
      question: "I ___ my grandma last weekend.",
      options: ["visited", "visit", "am visiting"],
      answer: "visited",
    },
    {
      question: "She ___ a cake for my birthday.",
      options: ["made", "makes", "maked"],
      answer: "made",
    },
    {
      question: "We ___ so tired after the trip.",
      options: ["were", "was", "are"],
      answer: "were",
    },
    {
      question: "I ___ watch TV last night.",
      options: ["didn't", "don't", "wasn't"],
      answer: "didn't",
    },
    {
      question: "___ you see the football match on Sunday?",
      options: ["Did", "Do", "Was"],
      answer: "Did",
    },
    {
      question: "He ___ his homework before dinner.",
      options: ["finished", "finish", "finishing"],
      answer: "finished",
    },
  ],
  bossFight: { name: "Question Kraken", emoji: "🐙" },
  sticker: { name: "Family Photo Frame", emoji: "🖼️" },
};

export const LESSONS: Lesson[] = [lesson1, lesson2, lesson3, lesson4];
