export const STORAGE_KEY = "arsyad-english-quest-v1";

export type VocabWord = {
  word: string;
  meaning: string;
  example: string;
  emoji: string;
  imagePath?: string;
};

export type QuizItem = {
  question: string;
  options: string[];
  answer: string;
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
  grammar: {
    title: string;
    explanation: string;
    patterns: { subject?: string; verb?: string; rest?: string; note?: string }[];
    examples: string[];
    yourTurn: QuizItem[];
  };
  expressions: { prompt: string; answer: string }[];
  practice: { title: string; instructions: string };
  reading: {
    title: string;
    paragraphs: string[];
    questions: QuizItem[];
    stretchQuestion: string;
    spotlight: { sound: string; exampleWord: string; instruction: string; words: string[] };
  };
  rolePlay: {
    title: string;
    prompts: string[];
    twists: string[];
    homework: string;
  };
  selfCheck: string[];
  boss: QuizItem[];
  sticker: { name: string; emoji: string };
};

export const LEVELS = [
  { name: "Explorer", min: 0, max: 15, emoji: "🧭" },
  { name: "Adventurer", min: 16, max: 35, emoji: "🗺️" },
  { name: "Champion", min: 36, max: 60, emoji: "🛡️" },
  { name: "Legend", min: 61, max: Infinity, emoji: "👑" },
] as const;

export const WORD_MASTERY_TARGET = 3;

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
  sticker: { name: "Golden Backpack", emoji: "🎒" },
};

export const LESSONS: Lesson[] = [lesson1];
