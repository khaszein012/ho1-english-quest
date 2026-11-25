/* =============================================================================
 * A1 COURSE — LEVEL A1 · FIRST WORDS
 * -----------------------------------------------------------------------------
 * Same unit topics as the A2 course, but every piece of content is written for
 * true beginners: shorter sentences, one grammar target per unit, and brand-new
 * questions. Lesson ids are prefixed with "a1-" so progress, stars and stickers
 * stay separate from the A2 course.
 * ============================================================================= */

import { assertValidLessons, type Lesson } from "./config";
import schoolConversationImage from "@/assets/conversation-school.jpg";
import thingsConversationImage from "@/assets/conversation-things.jpg";

/* =============================================================================
 * A1 LESSON 1 — SCHOOL THINGS · It is a … (book Unit 1, A1 edition)
 * ============================================================================= */

const a1Lesson1: Lesson = {
  id: "a1-lesson-1",
  number: 1,
  title: "School Things",
  subtitle: "It Is a … · What Is This?",
  badgeCode: "SUN-PEN",
  emoji: "🎒",
  sentenceFrames: ["It is a ___.", "It is my ___.", "What is this?"],
  speedRoundSeconds: 12,
  plannedMinutes: 45,
  sessionPlan: [
    { label: "Hello + words", minutes: 10 },
    { label: "It is a …", minutes: 8 },
    { label: "Talk & play", minutes: 10 },
    { label: "Story + hunt", minutes: 10 },
    { label: "Boss", minutes: 7 },
  ],
  vocabulary: [
    {
      word: "bag",
      meaning: "you carry your school things in it",
      example: "It is my bag. It is red.",
      emoji: "🎒",
    },
    {
      word: "book",
      meaning: "you read it",
      example: "It is a blue book.",
      emoji: "📕",
    },
    {
      word: "crayon",
      meaning: "you color with it",
      example: "It is a red crayon.",
      emoji: "🖍️",
    },
    {
      word: "eraser",
      meaning: "it takes away pencil marks",
      example: "It is my eraser. It is small.",
      emoji: "🧽",
    },
    {
      word: "pen",
      meaning: "you write with it, in ink",
      example: "It is a black pen.",
      emoji: "🖊️",
    },
    {
      word: "pencil",
      meaning: "you write with it, in grey",
      example: "It is a yellow pencil.",
      emoji: "✏️",
    },
    {
      word: "pencil case",
      meaning: "a small bag for your pencils",
      example: "It is my pencil case.",
      emoji: "🧰",
    },
    {
      word: "ruler",
      meaning: "it is straight — you draw lines with it",
      example: "It is a long ruler.",
      emoji: "📏",
    },
  ],
  grammar: {
    title: "It Is a …",
    explanation:
      "Point at a thing and say It is a ___. Say the color too: It is a yellow pencil. Two or more things add -s: They are crayons.",
    tip: "💛 POINT & SAY — it is a …",
    patterns: [
      { subject: "It", verb: "is", rest: "a pencil.", note: "one thing" },
      { subject: "This", verb: "is", rest: "my bag.", note: "point to it!" },
      { subject: "It", verb: "is not", rest: "a pen.", note: "not = no" },
      { subject: "They", verb: "are", rest: "crayons.", note: "two or more → -s" },
    ],
    examples: [
      "It is a pencil. It is yellow.",
      "This is my bag. It is red.",
      "It is not a pen — it is a pencil!",
      "They are crayons. They are new.",
    ],
    yourTurn: [
      { question: "It ___ a pencil.", options: ["is", "are", "be"], answer: "is" },
      { question: "It is ___ eraser.", options: ["an", "a", "two"], answer: "an" },
      { question: "They ___ crayons. (two!)", options: ["are", "is", "am"], answer: "are" },
      { question: "This is ___ bag.", options: ["my", "me", "I"], answer: "my" },
      { question: "It is one ___. (one!)", options: ["book", "books", "bookses"], answer: "book" },
      { question: "___ is this? — It is a ruler!", options: ["What", "Who", "How"], answer: "What" },
    ],
  },
  expressions: [
    { prompt: "What is this?", answer: "It is a pencil." },
    { prompt: "What color is it?", answer: "It is yellow." },
    { prompt: "Is this your bag?", answer: "Yes, it is!" },
    { prompt: "What is in your bag?", answer: "A book and a pencil!" },
    { prompt: "Do you have a crayon?", answer: "Yes! It is red." },
  ],
  practice: {
    title: "What Is It?",
    instructions:
      "Flip a card and say: It is a ___. Then say the color: It is ___. Your tutor asks: What is this? Answer: It is a ___!",
  },
  reading: {
    title: "My School Bag",
    paragraphs: [
      "This is my bag. It is blue. In my bag I have a pencil and a pen. The pencil is yellow. The pen is black. I love my bag!",
      "My friend Sara has a new crayon. It is red. She has an eraser too. We read a book at school. School is fun!",
    ],
    questions: [
      {
        question: "What color is the bag?",
        options: ["blue", "red", "green", "black"],
        answer: "blue",
      },
      {
        question: "What is in the bag?",
        options: ["a pencil and a pen", "a book and a toy", "a ruler and a chair", "two cats"],
        answer: "a pencil and a pen",
      },
      {
        question: "What color is Sara's crayon?",
        options: ["red", "blue", "yellow", "green"],
        answer: "red",
      },
      {
        question: "What do we do at school?",
        options: ["we read a book", "we sleep", "we run home", "we fly"],
        answer: "we read a book",
      },
    ],
    stretchQuestion: "What is in YOUR bag? Tell me two things and their colors.",
    spotlight: {
      sound: "school words",
      exampleWord: "pencil",
      instruction: "Tap the school words you find in the story!",
      words: ["pencil", "pen", "book", "bag", "crayon", "eraser"],
    },
  },
  rolePlay: {
    title: "My School Bag",
    conversation: {
      title: "Look in the bag",
      scene: "Dito and Sara look at the school things in the bag.",
      image: schoolConversationImage,
      imageAlt: "Two schoolchildren showing a yellow pencil and a blue book from a red backpack.",
      roles: ["Dito", "Sara"],
      lines: [
        { role: 0, text: "Look! What is this?" },
        { role: 1, text: "It is a pencil. It is yellow!" },
        { role: 0, text: "Yes! And what is that?" },
        { role: 1, text: "It is my new book. It is blue." },
        { role: 0, text: "What color is your bag?" },
        { role: 1, text: "It is red. I love my red bag!" },
        { role: 0, text: "School is fun!" },
      ],
    },
    prompts: [
      "Point at a thing and ask: What is this?",
      "Answer: It is a ___.",
      "Say the color: It is ___.",
      "Show your bag: This is my bag.",
    ],
    twists: [
      "It is not a pencil — it is a magic pencil! ✨",
      "Everything in my bag is blue today!",
    ],
    homework:
      "Record yourself pointing at 3 school things at home. Say: It is a ___. It is ___. (color)",
  },
  selfCheck: [
    "Can I say 'It is a pencil.'?",
    "Can I say the color: 'It is yellow.'?",
    "Can I ask 'What is this?'",
    "Can I say 'This is my bag.'?",
  ],
  boss: [
    {
      question: "Which word means 'you write with it, and it is grey'?",
      options: ["pencil", "bag", "book", "crayon"],
      answer: "pencil",
    },
    { question: "It ___ a pen.", options: ["is", "are", "be"], answer: "is" },
    { question: "It is one ___. (one!)", options: ["book", "books", "bookses"], answer: "book" },
    {
      question: "Which word means 'you read it at school'?",
      options: ["book", "bag", "eraser", "pen"],
      answer: "book",
    },
    {
      question: "___ is this? — It is a ruler!",
      options: ["What", "Who", "How"],
      answer: "What",
    },
    { question: "They ___ crayons. (two!)", options: ["are", "is", "am"], answer: "are" },
    { question: "It is ___ eraser.", options: ["an", "a", "two"], answer: "an" },
    {
      question: "Which word means 'you carry your school things in it'?",
      options: ["bag", "book", "ruler", "crayon"],
      answer: "bag",
    },
  ],
  bossFight: { name: "Messy Desk Monster", emoji: "🖍️" },
  bossPersona: {
    hurt: ["Oh no, my papers! 🖍️", "My crayons are rolling away!", "Not the yellow pencil! NOOO!"],
    taunt: [
      "Everything on my desk is mixed up! 🖍️",
      "What is THIS? Even I don't know!",
      "So messy! So sneaky! Hehe!",
    ],
    phases: ["Messy Desk Monster is throwing crayons! 🖍️", "Messy Desk Monster is out of paper! 😤"],
  },
  sticker: { name: "Happy Pencil", emoji: "✏️" },
};

/* =============================================================================
 * A1 LESSON 2 — MY TOYS · It Is / They Are (book Unit 2, A1 edition)
 * ============================================================================= */

const a1Lesson2: Lesson = {
  id: "a1-lesson-2",
  number: 2,
  title: "My Toys",
  subtitle: "It Is / They Are + my / your",
  pin: "2468",
  badgeCode: "SUN-BALL",
  emoji: "🛹",
  sentenceFrames: ["It is a ___.", "They are ___.", "Is it your ___?"],
  speedRoundSeconds: 15,
  plannedMinutes: 45,
  sessionPlan: [
    { label: "Words + warm-up", minutes: 10 },
    { label: "It is / They are", minutes: 8 },
    { label: "Talk & play", minutes: 10 },
    { label: "Story + hunt", minutes: 10 },
    { label: "Boss", minutes: 7 },
  ],
  vocabulary: [
    {
      word: "ball",
      meaning: "a round toy you throw and kick",
      example: "It is my red ball.",
      emoji: "⚽",
    },
    {
      word: "bike",
      meaning: "a two-wheel ride you pedal",
      example: "It is my bike. It is new.",
      emoji: "🚲",
    },
    {
      word: "blocks",
      meaning: "small pieces you build with (always many!)",
      example: "They are my blocks.",
      emoji: "🧱",
      tag: "Always many!",
    },
    {
      word: "doll",
      meaning: "a small toy baby or person you can hold",
      example: "It is my doll. It is soft.",
      emoji: "🪆",
    },
    {
      word: "kite",
      meaning: "a light toy that flies on a string",
      example: "It is my kite. It is blue.",
      emoji: "🪁",
    },
    {
      word: "puzzle",
      meaning: "many small pieces make a picture",
      example: "It is a big puzzle.",
      emoji: "🧩",
    },
    {
      word: "teddy bear",
      meaning: "a soft toy bear you can hug",
      example: "It is my teddy bear!",
      emoji: "🧸",
    },
    {
      word: "toy car",
      meaning: "a small car you play with",
      example: "It is a fast toy car.",
      emoji: "🚗",
    },
  ],
  grammar: {
    title: "It Is / They Are + my / your",
    explanation:
      "Use It is for ONE toy and They are for MANY toys. Say my for your toys and your for the other person's toys. Careful: blocks are always many!",
    tip: "💛 ONE OR MANY — it is / they are + my / your",
    patterns: [
      { subject: "It", verb: "is", rest: "a ball.", note: "one toy" },
      { subject: "They", verb: "are", rest: "blocks.", note: "many toys → -s" },
      { subject: "It is", verb: "my", rest: "kite.", note: "my = mine" },
      { subject: "They are", verb: "your", rest: "blocks.", note: "your = yours" },
      { subject: "Is it", verb: "your", rest: "ball?", note: "ask a question" },
    ],
    examples: [
      "It is my teddy bear. It is soft.",
      "They are my blocks. They are new.",
      "Is it your toy car? — Yes, it is!",
      "No, it is not your ball. It is my ball!",
    ],
    yourTurn: [
      { question: "It ___ a ball.", options: ["is", "are", "be"], answer: "is" },
      { question: "They ___ my blocks. (many!)", options: ["are", "is", "am"], answer: "are" },
      { question: "It is ___ kite. (it is mine)", options: ["my", "your", "his"], answer: "my" },
      { question: "They are ___ blocks. (they are yours)", options: ["your", "my", "our"], answer: "your" },
      { question: "___ it your doll?", options: ["Is", "Are", "What"], answer: "Is" },
      { question: "It is one ___. (one!)", options: ["toy car", "toy cars", "toys car"], answer: "toy car" },
    ],
  },
  expressions: [
    { prompt: "What is it?", answer: "It is my teddy bear." },
    { prompt: "What are they?", answer: "They are my blocks." },
    { prompt: "Is it your kite?", answer: "Yes, it is!" },
    { prompt: "What is your favorite toy?", answer: "My toy car!" },
    { prompt: "Show me your toys.", answer: "Look! They are my blocks and my ball." },
  ],
  practice: {
    title: "What Is It?",
    instructions:
      "Flip a toy card face-down, then reveal it. Ask: What is it? Answer: It is a ___. For many toys ask: What are they? Answer: They are ___. Then ask: Is it your ___?",
  },
  reading: {
    title: "My Toy Box",
    paragraphs: [
      "This is my toy box. It is big and red. In my toy box I have a ball, a doll and a teddy bear. My teddy bear is brown. It is soft. I love it!",
      "My friend Ben has a kite. It is green and yellow. Ben has toy cars too. They are fast. Ben has blocks too — we build towers with them! We play every day. Toys are fun!",
    ],
    questions: [
      {
        question: "What is the toy box like?",
        options: ["big and red", "small and blue", "green", "yellow"],
        answer: "big and red",
      },
      {
        question: "What is in the toy box?",
        options: ["a ball, a doll and a teddy bear", "two bikes", "a kite", "a pencil case"],
        answer: "a ball, a doll and a teddy bear",
      },
      {
        question: "What color is Ben's kite?",
        options: ["green and yellow", "red", "brown", "blue"],
        answer: "green and yellow",
      },
      {
        question: "What are Ben's toy cars like?",
        options: ["fast", "slow", "big", "soft"],
        answer: "fast",
      },
    ],
    stretchQuestion: "What is in YOUR toy box? Tell me two toys and their colors.",
    spotlight: {
      sound: "toy words",
      exampleWord: "teddy bear",
      instruction: "Tap the toy words you find in the story!",
      words: ["ball", "doll", "teddy bear", "kite", "toy car", "blocks"],
    },
  },
  rolePlay: {
    title: "Show and Tell: My Toys",
    conversation: {
      title: "Whose toy is this?",
      scene: "Dito and Sari show their favorite toys in the park.",
      image: thingsConversationImage,
      imageAlt:
        "Two children showing a ball, a kite and a toy car at a park table.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 0, text: "Look! What is this?" },
        { role: 1, text: "It is a kite. It is green!" },
        { role: 0, text: "Is it your kite?" },
        { role: 1, text: "Yes, it is! It is my new kite." },
        { role: 0, text: "What are those? Are they blocks?" },
        { role: 1, text: "Yes! They are my blocks. I build towers!" },
        { role: 0, text: "Toys are fun! Let's play!" },
      ],
    },
    prompts: [
      "Show a toy: It is my ___.",
      "Show many toys: They are my ___.",
      "Ask me: Is it your ___?",
      "Ask me: What is it? / What are they?",
    ],
    twists: [
      "It is not my kite — it is my sister's kite!",
      "They aren't my blocks. Where are my blocks?",
    ],
    homework:
      "Record a tour of 3 of your toys. Say: It is my ___. They are my ___. (one toy must be many, like blocks)",
  },
  selfCheck: [
    "Can I say 'It is' for one toy?",
    "Can I say 'They are' for many toys?",
    "Can I use 'my' and 'your'?",
    "Can I say 'Is it your ___?'",
  ],
  boss: [
    {
      question: "Which word means 'a soft toy bear you hug'?",
      options: ["teddy bear", "kite", "ball", "puzzle"],
      answer: "teddy bear",
    },
    { question: "It ___ a doll.", options: ["is", "are", "be"], answer: "is" },
    { question: "They ___ my blocks. (many!)", options: ["are", "is", "am"], answer: "are" },
    {
      question: "Which word means 'a round toy you throw and kick'?",
      options: ["ball", "doll", "kite", "bike"],
      answer: "ball",
    },
    { question: "___ it your toy car?", options: ["Is", "Are", "What"], answer: "Is" },
    { question: "It is ___ kite. (it is mine)", options: ["my", "your", "our"], answer: "my" },
    { question: "It is one ___. (one!)", options: ["toy car", "toy cars", "toys car"], answer: "toy car" },
    {
      question: "Is it your ball? (say NO)",
      options: ["No, it is not.", "No, they are not.", "No, I not.", "No, it am not."],
      answer: "No, it is not.",
    },
  ],
  bossFight: { name: "Toy Box Monster", emoji: "🧸" },
  bossPersona: {
    hurt: ["My toys! They all fell out! 🧸", "Beep! Wrong mix-up!", "Not my teddy bear! NOO!"],
    taunt: [
      "Your toys are ALL mixed up now! 🧸",
      "One toy? Many toys? Who can tell!",
      "I mix up my AND your!",
    ],
    phases: ["Toy Box Monster is dumping the toy box! 🧸", "Toy Box Monster is out of toys! 😤"],
  },
  sticker: { name: "Teddy Bear", emoji: "🧸" },
};

/* =============================================================================
 * A1 LESSON 3 — MY CLASSROOM · This Is / That Is (book Unit 3, A1 edition)
 * ============================================================================= */

const a1Lesson3: Lesson = {
  id: "a1-lesson-3",
  number: 3,
  title: "My Classroom",
  subtitle: "This Is / That Is",
  pin: "3456",
  badgeCode: "SUN-DESK",
  emoji: "🏫",
  sentenceFrames: ["This is a ___.", "That is a ___.", "Is that a ___?"],
  speedRoundSeconds: 15,
  plannedMinutes: 45,
  sessionPlan: [
    { label: "Words + warm-up", minutes: 10 },
    { label: "This is / That is", minutes: 8 },
    { label: "Talk & play", minutes: 10 },
    { label: "Story + hunt", minutes: 10 },
    { label: "Boss", minutes: 7 },
  ],
  vocabulary: [
    {
      word: "board",
      meaning: "the teacher writes on it",
      example: "This is the board. It is big.",
      emoji: "🧑‍🏫",
    },
    {
      word: "chair",
      meaning: "you sit on it",
      example: "That is my chair. It is blue.",
      emoji: "🪑",
    },
    {
      word: "clock",
      meaning: "it shows the time",
      example: "The clock is on the wall.",
      emoji: "🕐",
    },
    {
      word: "computer",
      meaning: "you type and play on it",
      example: "That is a new computer.",
      emoji: "💻",
    },
    {
      word: "desk",
      meaning: "a table for one student",
      example: "This is my desk. It is small.",
      emoji: "📝",
    },
    {
      word: "door",
      meaning: "you open it to go out",
      example: "That is the door. It is green.",
      emoji: "🚪",
    },
    {
      word: "table",
      meaning: "a big desk for many students",
      example: "We sit at the table.",
      emoji: "🍽️",
    },
    {
      word: "window",
      meaning: "you look out of it",
      example: "The window is big.",
      emoji: "🌤️",
    },
  ],
  grammar: {
    title: "This Is / That Is",
    explanation:
      "Near you? Say This is a ___. Far from you? Say That is a ___. Ask: Is that a ___? Answer: Yes, it is. / No, it is not.",
    tip: "💛 POINT & SAY — this is near, that is far",
    patterns: [
      { subject: "This", verb: "is", rest: "my desk.", note: "near me" },
      { subject: "That", verb: "is", rest: "the door.", note: "far from me" },
      { subject: "That", verb: "is not", rest: "a window.", note: "not = no" },
      { subject: "That", verb: "is", rest: "a clock.", note: "far away" },
    ],
    examples: [
      "This is my desk. It is small.",
      "That is the board. It is big.",
      "Is that your chair? — Yes, it is!",
      "That is not a window. It is a door!",
    ],
    yourTurn: [
      { question: "___ is my desk. (near me)", options: ["This", "That", "Those"], answer: "This" },
      { question: "___ is the door. (far away)", options: ["That", "This", "These"], answer: "That" },
      { question: "Is ___ a clock?", options: ["that", "those", "the"], answer: "that" },
      { question: "This ___ a chair.", options: ["is", "are", "am"], answer: "is" },
      { question: "Is that your desk? (say YES)", options: ["Yes, it is.", "Yes, it is not.", "Yes, that are.", "Yes, I am."], answer: "Yes, it is." },
      { question: "This is ___ chair. (it is mine)", options: ["my", "your", "me"], answer: "my" },
    ],
  },
  expressions: [
    { prompt: "What is this?", answer: "This is my desk." },
    { prompt: "What is that?", answer: "That is the door." },
    { prompt: "Is that a clock?", answer: "Yes, it is!" },
    { prompt: "Is that your chair?", answer: "No, it is not." },
  ],
  practice: {
    title: "Near or Far?",
    instructions:
      "Touch a thing near you and say: This is a ___. Point at a thing far away and say: That is a ___. Then ask your tutor: Is that a ___?",
  },
  reading: {
    title: "Our Classroom",
    paragraphs: [
      "This is our classroom. It is big. This is my desk. It is small and blue. That is Mia's desk. It is near the window. The window is big.",
      "That is the board. It is green. Our teacher writes on the board. That is the clock. It is white. It is on the wall, near the door. The door is green too. I love our classroom!",
    ],
    questions: [
      {
        question: "What is the classroom like?",
        options: ["big", "small", "green", "new"],
        answer: "big",
      },
      {
        question: "What color is my desk?",
        options: ["small and blue", "big and green", "white", "yellow"],
        answer: "small and blue",
      },
      {
        question: "Where is Mia's desk?",
        options: ["near the window", "near the door", "on the clock", "on the board"],
        answer: "near the window",
      },
      {
        question: "What is on the wall?",
        options: ["the clock", "the desk", "a computer", "a chair"],
        answer: "the clock",
      },
    ],
    stretchQuestion: "What is in YOUR classroom? Tell me two things: This is a ___. That is a ___.",
    spotlight: {
      sound: "classroom words",
      exampleWord: "board",
      instruction: "Tap the classroom words you find in the story!",
      words: ["desk", "board", "clock", "door", "window", "classroom"],
    },
  },
  rolePlay: {
    title: "The New Student",
    conversation: {
      title: "Welcome to our class!",
      scene: "Dito shows Sari the classroom on her first day.",
      image: schoolConversationImage,
      imageAlt: "Two children talking together in a classroom near the desks.",
      roles: ["Dito", "Sari"],
      lines: [
        { role: 0, text: "Hello! Welcome to our class!" },
        { role: 1, text: "Thank you! Wow, this is a nice room." },
        { role: 0, text: "This is my desk. It is blue." },
        { role: 1, text: "I like it! What is that?" },
        { role: 0, text: "That is the board. It is green." },
        { role: 1, text: "Is that a clock?" },
        { role: 0, text: "Yes, it is! Look — it is 9 o'clock. Class starts!" },
      ],
    },
    prompts: [
      "Show your desk: This is my ___.",
      "Point far away: That is the ___.",
      "Ask me: Is that a ___?",
      "Answer me: Yes, it is. / No, it is not.",
    ],
    twists: [
      "That is not a clock — that is a picture!",
      "This is not your desk — it is my desk!",
    ],
    homework:
      "Record a tour of your classroom or your room at home. Say: This is a ___. That is a ___. (one thing must be near, one thing must be far)",
  },
  selfCheck: [
    "Can I say 'This is' for a thing near me?",
    "Can I say 'That is' for a thing far away?",
    "Can I ask 'Is that a ___?'",
    "Can I answer 'Yes, it is' and 'No, it is not'?",
  ],
  boss: [
    {
      question: "Which word means 'the teacher writes on it'?",
      options: ["board", "desk", "clock", "door"],
      answer: "board",
    },
    { question: "___ is my desk. (near me)", options: ["This", "That", "Those"], answer: "This" },
    { question: "___ is the door. (far away)", options: ["That", "This", "These"], answer: "That" },
    {
      question: "Which word means 'you sit on it'?",
      options: ["chair", "window", "table", "computer"],
      answer: "chair",
    },
    { question: "This ___ a chair.", options: ["is", "are", "am"], answer: "is" },
    { question: "That is ___ clock. (on the wall)", options: ["a", "an", "two"], answer: "a" },
    { question: "Is that a window? (say NO)", options: ["No, it is not.", "No, it is.", "No, they are not.", "No, I am not."], answer: "No, it is not." },
    {
      question: "Which word means 'it shows the time'?",
      options: ["clock", "door", "desk", "board"],
      answer: "clock",
    },
  ],
  bossFight: { name: "Classroom Ghost", emoji: "👻" },
  bossPersona: {
    hurt: ["My desks are flying! 👻", "Boo! You got it right!", "Not the clock! Time is mixed up!"],
    taunt: [
      "I moved all the classroom things! 👻",
      "This or that? Near or far? Ha!",
      "You don't know my classroom!",
    ],
    phases: ["Classroom Ghost is hiding the desks! 👻", "Classroom Ghost is out of tricks! 😤"],
  },
  sticker: { name: "Golden Clock", emoji: "🕐" },
};

/* =============================================================================
 * A1 LESSON 4 — FAMILY AND FRIENDS · He Is / She Is (book Unit 4, A1 edition)
 * ============================================================================= */

const a1Lesson4: Lesson = {
  id: "a1-lesson-4",
  number: 4,
  title: "Family and Friends",
  subtitle: "He Is / She Is",
  pin: "4567",
  badgeCode: "SUN-FAM",
  emoji: "👨‍👩‍👧‍👦",
  sentenceFrames: ["He is my ___.", "She is my ___.", "Is she your ___?", "___ is ___ years old."],
  speedRoundSeconds: 15,
  plannedMinutes: 45,
  sessionPlan: [
    { label: "Words + warm-up", minutes: 10 },
    { label: "He is / She is", minutes: 8 },
    { label: "Talk & play", minutes: 10 },
    { label: "Story + hunt", minutes: 10 },
    { label: "Boss", minutes: 7 },
  ],
  vocabulary: [
    {
      word: "brother",
      meaning: "a boy with the same mom and dad",
      example: "My brother is 7 years old.",
      emoji: "👦",
    },
    {
      word: "dad",
      meaning: "your father",
      example: "My dad is tall.",
      emoji: "👨",
    },
    {
      word: "family",
      meaning: "mom, dad, children and more",
      example: "My family is big.",
      emoji: "👨‍👩‍👧‍👦",
    },
    {
      word: "friend",
      meaning: "a person you like to play with",
      example: "Mia is my friend.",
      emoji: "🧑‍🤝‍🧑",
    },
    {
      word: "grandma",
      meaning: "your mom's mom or your dad's mom",
      example: "My grandma is 70 years old.",
      emoji: "👵",
    },
    {
      word: "grandpa",
      meaning: "your mom's dad or your dad's dad",
      example: "My grandpa is funny.",
      emoji: "👴",
    },
    {
      word: "mom",
      meaning: "your mother",
      example: "My mom is a teacher.",
      emoji: "👩",
    },
    {
      word: "sister",
      meaning: "a girl with the same mom and dad",
      example: "My sister is 5 years old.",
      emoji: "👧",
    },
  ],
  grammar: {
    title: "He Is / She Is",
    explanation:
      "A boy or a man? Say He is my ___. A girl or a woman? Say She is my ___. Ask: Is she your ___? Answer: Yes, she is. / No, she is not.",
    tip: "💛 HE for boys and men, SHE for girls and women",
    patterns: [
      { subject: "He", verb: "is", rest: "my dad.", note: "boy / man" },
      { subject: "She", verb: "is", rest: "my mom.", note: "girl / woman" },
      { subject: "He", verb: "is not", rest: "my brother.", note: "not = no" },
      { subject: "Is she", verb: "", rest: "your grandma?", note: "Is she / Is he question" },
    ],
    examples: [
      "He is my grandpa. He is funny.",
      "She is my sister. She is 5 years old.",
      "Is he your friend? — Yes, he is!",
      "She is not my sister. She is my cousin!",
    ],
    yourTurn: [
      { question: "My mom's mom is my ___.", options: ["grandma", "sister", "friend"], answer: "grandma" },
      { question: "___ is my dad. (a man)", options: ["He", "She", "It"], answer: "He" },
      { question: "___ is my sister. (a girl)", options: ["She", "He", "They"], answer: "She" },
      { question: "My dad's dad is my ___.", options: ["grandpa", "mom", "brother"], answer: "grandpa" },
      { question: "Is she your mom? (say YES)", options: ["Yes, she is.", "Yes, he is.", "Yes, she is not.", "Yes, I am."], answer: "Yes, she is." },
      { question: "A boy with the same mom and dad is my ___.", options: ["brother", "sister", "grandma"], answer: "brother" },
    ],
  },
  expressions: [
    { prompt: "Who is he?", answer: "He is my dad." },
    { prompt: "Who is she?", answer: "She is my sister." },
    { prompt: "Is she your grandma?", answer: "Yes, she is!" },
    { prompt: "How old is your brother?", answer: "He is 7 years old." },
  ],
  practice: {
    title: "Who Is It?",
    instructions:
      "Show a photo and say: He is my ___. / She is my ___. Then ask your tutor: Is she your ___? Your tutor answers: Yes, she is. / No, she is not.",
  },
  reading: {
    title: "Ben's Family Photo",
    paragraphs: [
      "This is a photo of my family. He is my dad. He is tall. She is my mom. She is a teacher. She is nice.",
      "She is my sister. Her name is Mia. She is 5 years old. He is my brother. His name is Sam. He is 7 years old. He is funny. That is my grandma. She is 70 years old. I love my family!",
    ],
    questions: [
      {
        question: "What is this a photo of?",
        options: ["my family", "my classroom", "my friends", "my toys"],
        answer: "my family",
      },
      {
        question: "What is his mom?",
        options: ["a teacher", "a student", "funny", "5 years old"],
        answer: "a teacher",
      },
      {
        question: "How old is Mia?",
        options: ["5 years old", "7 years old", "70 years old", "tall"],
        answer: "5 years old",
      },
      {
        question: "Who is funny?",
        options: ["Sam", "Mia", "Grandma", "Dad"],
        answer: "Sam",
      },
    ],
    stretchQuestion: "Who is in YOUR family? Say two things: She is my ___. He is my ___.",
    spotlight: {
      sound: "family words",
      exampleWord: "grandma",
      instruction: "Tap the family words you find in the story!",
      words: ["family", "grandma", "sister", "brother", "photo"],
    },
  },
  rolePlay: {
    title: "Show Me Your Family",
    conversation: {
      title: "Look at my photo!",
      scene: "Ben shows his family photo to his friend Lina at break time.",
      image: schoolConversationImage,
      imageAlt: "Two children smiling and looking at a family photo together.",
      roles: ["Ben", "Lina"],
      lines: [
        { role: 0, text: "Look! This is my family." },
        { role: 1, text: "Wow! Who is she?" },
        { role: 0, text: "She is my mom. She is a teacher." },
        { role: 1, text: "Is he your brother?" },
        { role: 0, text: "Yes, he is! He is 7 years old." },
        { role: 1, text: "Is she your grandma?" },
        { role: 0, text: "Yes, she is. She is funny. I love her!" },
      ],
    },
    prompts: [
      "Show a photo: He is my ___. / She is my ___.",
      "Ask me: Is she your ___?",
      "Tell me the age: He is ___ years old.",
      "Answer me: Yes, she is. / No, she is not.",
    ],
    twists: [
      "She is not my sister — she is my cousin!",
      "He is not my grandpa. Guess again!",
    ],
    homework:
      "Draw your family or bring a photo. Record: She is my ___. He is my ___. Say one age: ___ is ___ years old.",
  },
  selfCheck: [
    "Can I say 'He is' for a boy or a man?",
    "Can I say 'She is' for a girl or a woman?",
    "Can I ask 'Is she your ___?'",
    "Can I say how old someone is?",
  ],
  boss: [
    {
      question: "Which word means 'your mom's mom'?",
      options: ["grandma", "sister", "aunt", "friend"],
      answer: "grandma",
    },
    { question: "___ is my dad. (a man)", options: ["He", "She", "It"], answer: "He" },
    { question: "___ is my sister. (a girl)", options: ["She", "He", "They"], answer: "She" },
    {
      question: "Which word means 'a person you like to play with'?",
      options: ["friend", "brother", "family", "grandpa"],
      answer: "friend",
    },
    { question: "My dad's dad is my ___.", options: ["grandpa", "mom", "sister"], answer: "grandpa" },
    { question: "She ___ my mom.", options: ["is", "are", "am"], answer: "is" },
    { question: "Is he your brother? (say YES)", options: ["Yes, he is.", "Yes, she is.", "Yes, he is not.", "Yes, I am."], answer: "Yes, he is." },
    {
      question: "Which word means 'a girl with the same mom and dad'?",
      options: ["sister", "grandma", "mom", "friend"],
      answer: "sister",
    },
  ],
  bossFight: { name: "Family Photo Ghost", emoji: "📸" },
  bossPersona: {
    hurt: ["My photos are all mixed up! 📸", "Aargh! Right again!", "Not grandma's photo!"],
    taunt: [
      "I swapped all the family photos! 📸",
      "He or she? Do you even know?",
      "You can't name my family!",
    ],
    phases: ["Family Photo Ghost is hiding the faces! 📸", "Family Photo Ghost is out of photos! 😤"],
  },
  sticker: { name: "Family Frame", emoji: "🖼️" },
};

/* =============================================================================
 * A1 LESSON 5 — THE BIG REVIEW · Units 1–4 (A1 edition)
 * A mixed review of everything from A1 Units 1–4, written for true beginners:
 * same unit topics as A2's review lesson, but with short sentences and one
 * easy question at a time.
 * ============================================================================= */

const a1Lesson5: Lesson = {
  id: "a1-lesson-5",
  number: 5,
  title: "The Big Review",
  subtitle: "Units 1–4 Review",
  pin: "5678",
  badgeCode: "SUN-STAR",
  emoji: "🌟",
  sentenceFrames: ["It is a ___.", "They are my ___.", "This is a ___.", "She is my ___."],
  speedRoundSeconds: 15,
  plannedMinutes: 52,
  sessionPlan: [
    { label: "Words + warm-up", minutes: 12 },
    { label: "Big Review grammar", minutes: 10 },
    { label: "Talk & play", minutes: 10 },
    { label: "Story + hunt", minutes: 12 },
    { label: "Boss", minutes: 8 },
  ],
  vocabulary: [
    // Unit 1 — School Things
    {
      word: "book",
      meaning: "you read it",
      example: "It is a blue book.",
      emoji: "📕",
    },
    {
      word: "crayon",
      meaning: "you color with it",
      example: "It is a red crayon.",
      emoji: "🖍️",
    },
    {
      word: "pen",
      meaning: "you write with it, in ink",
      example: "It is a black pen.",
      emoji: "🖊️",
    },
    {
      word: "ruler",
      meaning: "it is straight — you draw lines with it",
      example: "It is a long ruler.",
      emoji: "📏",
    },
    // Unit 2 — My Toys
    {
      word: "ball",
      meaning: "you can throw it and kick it",
      example: "It is my ball. It is new.",
      emoji: "⚽",
    },
    {
      word: "doll",
      meaning: "a small toy baby or person you can hold",
      example: "It is my doll. Her name is Mia!",
      emoji: "🪆",
    },
    {
      word: "kite",
      meaning: "it flies in the sky on a string",
      example: "It is my kite. It is big!",
      emoji: "🪁",
    },
    {
      word: "blocks",
      meaning: "small pieces you build towers with (always many!)",
      example: "They are my blocks.",
      emoji: "🧱",
      tag: "Always many!",
    },
    // Unit 3 — My Classroom
    {
      word: "chair",
      meaning: "you sit on it",
      example: "This is my chair.",
      emoji: "🪑",
    },
    {
      word: "clock",
      meaning: "it shows the time",
      example: "The clock is red.",
      emoji: "🕐",
    },
    {
      word: "desk",
      meaning: "a table for one student",
      example: "This is my desk. It is small.",
      emoji: "🛏️",
    },
    {
      word: "door",
      meaning: "you open it and go in",
      example: "That is the door. It is green.",
      emoji: "🚪",
    },
    // Unit 4 — Family and Friends
    {
      word: "brother",
      meaning: "a boy with the same mom and dad",
      example: "My brother is 7 years old.",
      emoji: "👦",
    },
    {
      word: "friend",
      meaning: "a person you like to play with",
      example: "Mia is my friend.",
      emoji: "🧑‍🤝‍🧑",
    },
    {
      word: "grandma",
      meaning: "your mom's mom or your dad's mom",
      example: "My grandma is 70 years old.",
      emoji: "👵",
    },
    {
      word: "sister",
      meaning: "a girl with the same mom and dad",
      example: "My sister is 5 years old.",
      emoji: "👧",
    },
  ],
  // Extra review words for the Match It / Listen & Pick pools — not counted
  // toward the words-learned bar or sticker.
  reviewVocabulary: [
    {
      word: "bag",
      meaning: "you carry your school things in it",
      example: "It is my bag. It is red.",
      emoji: "🎒",
    },
    {
      word: "pencil",
      meaning: "you write with it, in grey",
      example: "It is a yellow pencil.",
      emoji: "✏️",
    },
    {
      word: "bike",
      meaning: "you ride it with two wheels",
      example: "It is my new bike!",
      emoji: "🚲",
    },
    {
      word: "teddy bear",
      meaning: "a soft toy bear you can hug",
      example: "It is my teddy bear. It is soft.",
      emoji: "🧸",
    },
    {
      word: "board",
      meaning: "the teacher writes on it",
      example: "The board is big.",
      emoji: "🧑‍🏫",
    },
    {
      word: "window",
      meaning: "you look out of it",
      example: "The window is big.",
      emoji: "🪟",
    },
    {
      word: "mom",
      meaning: "your mother",
      example: "My mom is a teacher.",
      emoji: "👩",
    },
    {
      word: "grandpa",
      meaning: "your mom's dad or your dad's dad",
      example: "My grandpa is funny.",
      emoji: "👴",
    },
  ],
  grammar: {
    title: "The Big Review — Units 1–4",
    explanation:
      "All four units together! Unit 1: It is a ___. Unit 2: It is my ___ / They are my ___. Unit 3: This is a ___ / That is a ___. Unit 4: He is my ___ / She is my ___. Read each line and say which unit it comes from!",
    tip: "🌟 ALL FOUR UNITS — it is · they are · this/that · he is/she is",
    patterns: [
      { subject: "It", verb: "is", rest: "a pencil.", note: "Unit 1 — school things" },
      { subject: "It is", verb: "my", rest: "kite.", note: "Unit 2 — ONE toy" },
      { subject: "They are", verb: "my", rest: "blocks.", note: "Unit 2 — MANY toys" },
      { subject: "This", verb: "is", rest: "my chair.", note: "Unit 3 — near me" },
      { subject: "That", verb: "is", rest: "the door.", note: "Unit 3 — far away" },
      { subject: "She", verb: "is", rest: "my sister.", note: "Unit 4 — girl / woman" },
      { subject: "He", verb: "is", rest: "my brother.", note: "Unit 4 — boy / man" },
    ],
    examples: [
      "It is a blue book.",
      "It is my ball. It is new.",
      "They are my blocks.",
      "This is my desk. That is the door.",
      "He is my grandpa. He is funny.",
      "She is my friend. She is nice!",
    ],
    yourTurn: [
      { question: "It ___ a book.", options: ["is", "are", "am"], answer: "is" },
      { question: "They ___ my blocks. (many!)", options: ["are", "is", "am"], answer: "are" },
      { question: "___ is my kite. (it is mine)", options: ["It is", "They are", "I is"], answer: "It is" },
      { question: "___ is my chair. (near me)", options: ["This", "That", "Those"], answer: "This" },
      { question: "___ is the door. (far away)", options: ["That", "This", "These"], answer: "That" },
      { question: "___ is my sister. (a girl)", options: ["She", "He", "It"], answer: "She" },
      { question: "___ is my brother. (a boy)", options: ["He", "She", "They"], answer: "He" },
      { question: "It is one ___. (one!)", options: ["book", "books", "bookses"], answer: "book" },
    ],
  },
  expressions: [
    { prompt: "What is this?", answer: "It is a pencil." },
    { prompt: "What is that?", answer: "That is the door." },
    { prompt: "Is it your ball?", answer: "Yes, it is! It is my ball." },
    { prompt: "Who is she?", answer: "She is my sister." },
    { prompt: "Who is he?", answer: "He is my grandpa." },
    { prompt: "What are they?", answer: "They are my blocks." },
  ],
  practice: {
    title: "The Big Show-and-Tell",
    instructions:
      "Flip a card and use the RIGHT words for it: a school thing → It is a ___; your toy → It is my ___ / They are my ___; the classroom → This is a ___ / That is the ___; people → He is my ___ / She is my ___. Then the speed round — all four units together!",
  },
  reading: {
    title: "The Big Day at School",
    paragraphs: [
      "Today is a big day! Ben shows his friend Sara all his favorite things. 'What is this?' asks Sara. 'It is my new book. It is blue,' says Ben. 'And it is my yellow pencil.'",
      "They go to the classroom. 'This is my desk. It is small. That is the door. It is green. And that is the clock — it is red!' says Ben.",
      "At break time Ben opens his toy bag. 'It is my ball, and it is my kite. They are my blocks — I have ten blocks!' They play together. Sara is happy.",
      "Then Ben's family comes to school. 'She is my sister. She is 5 years old. He is my grandpa. He is 70 years old. And she is my grandma. She is nice!'",
      "What a big day! School is fun with books, toys, and family!",
    ],
    questions: [
      {
        question: "What color is Ben's book?",
        options: ["blue", "red", "green", "yellow"],
        answer: "blue",
      },
      {
        question: "What color is the door?",
        options: ["green", "blue", "red", "yellow"],
        answer: "green",
      },
      {
        question: "How many blocks does Ben have?",
        options: ["ten", "five", "three", "twenty"],
        answer: "ten",
      },
      {
        question: "How old is Ben's sister?",
        options: ["5 years old", "7 years old", "70 years old", "10 years old"],
        answer: "5 years old",
      },
      {
        question: "Who is 70 years old?",
        options: ["grandpa", "sister", "Sara", "mom"],
        answer: "grandpa",
      },
      {
        question: "What do Ben and Sara do at break time?",
        options: ["they play", "they sleep", "they go home", "they eat the book"],
        answer: "they play",
      },
    ],
    stretchQuestion:
      "You are Ben! Show YOUR things: It is my ___. They are my ___. Then show your family: She is my ___. He is my ___.",
    spotlight: {
      sound: "all my words — the big review",
      exampleWord: "book",
      instruction: "Tap the words you know from Units 1–4 in the story!",
      words: ["book", "pencil", "desk", "clock", "ball", "kite", "blocks", "sister", "grandma", "family"],
    },
  },
  rolePlay: {
    title: "Show Me Everything!",
    conversation: {
      title: "A new student visits",
      scene: "Ben shows the new student Sara his classroom, his toys and his family photo.",
      image: thingsConversationImage,
      imageAlt: "Two children showing toys and school things together at a table.",
      roles: ["Ben", "Sara"],
      lines: [
        { role: 0, text: "Welcome! This is my desk." },
        { role: 1, text: "Wow! And what is that?" },
        { role: 0, text: "That is the clock. It is red!" },
        { role: 1, text: "What is in your bag, Ben?" },
        { role: 0, text: "It is my ball, and they are my blocks. I love my toys!" },
        { role: 1, text: "Look! Who is she in the photo?" },
        { role: 0, text: "She is my sister. She is 5. And he is my grandpa. He is 70!" },
        { role: 1, text: "Your school day is BIG! Books, toys and family!" },
      ],
    },
    prompts: [
      "Point at a school thing: It is a ___.",
      "Show your toys: It is my ___ / They are my ___.",
      "Point near and far: This is a ___ / That is the ___.",
      "Show your family: He is my ___ / She is my ___.",
      "Say one sentence for EVERY unit — it is, they are, this/that, he is/she is!",
    ],
    twists: [
      "It is not a ball — it is a magic ball! ⚽✨",
      "That is not my grandpa — guess again!",
    ],
    homework:
      "Give a big tour at home! Record: 1 school thing (It is a ___), 1 toy (It is my ___), 1 thing far away (That is the ___) and 2 family members (He is my ___ / She is my ___).",
  },
  selfCheck: [
    "Can I say 'It is a pencil.' for school things?",
    "Can I use It is my ___ / They are my ___ for toys?",
    "Can I use This is a ___ / That is the ___ for the classroom?",
    "Can I say He is my ___ / She is my ___ for people?",
    "Can I use my words from all four units?",
  ],
  boss: [
    {
      question: "Which word means 'you read it'?",
      options: ["book", "ball", "chair", "friend"],
      answer: "book",
    },
    { question: "It ___ a red crayon.", options: ["is", "are", "am"], answer: "is" },
    { question: "They ___ my blocks. (many!)", options: ["are", "is", "am"], answer: "are" },
    {
      question: "It is ___ kite. (it is mine)",
      options: ["my", "your", "me"],
      answer: "my",
    },
    { question: "___ is my desk. (near me)", options: ["This", "That", "Those"], answer: "This" },
    { question: "___ is the door. (far away)", options: ["That", "This", "These"], answer: "That" },
    { question: "___ is my sister. (a girl)", options: ["She", "He", "It"], answer: "She" },
    { question: "___ is my grandpa. (a man)", options: ["He", "She", "They"], answer: "He" },
    {
      question: "Which word means 'a person you like to play with'?",
      options: ["friend", "brother", "doll", "clock"],
      answer: "friend",
    },
    {
      question: "Which word is ALWAYS many?",
      options: ["blocks", "ball", "kite", "book"],
      answer: "blocks",
    },
  ],
  bossFight: { name: "The Grand Mixer", emoji: "🌀" },
  bossPersona: {
    hurt: ["Whoa, all four units at once! 🌀", "My big mix is falling apart!", "No fair — you know EVERYTHING!"],
    taunt: ["Unit 1? Unit 4? I mix them ALL! 🌀", "It is? They are? Let me stir it up!", "You need ALL your words to beat me!"],
    phases: ["The Grand Mixer is spinning faster! 🌪️", "The Grand Mixer is almost unmixed! 😵"],
  },
  sticker: { name: "Review Trophy", emoji: "🏆" },
};

export const A1_LESSONS: Lesson[] = [a1Lesson1, a1Lesson2, a1Lesson3, a1Lesson4, a1Lesson5];

// Same fail-fast guarantees as the A2 course — an A1 content edit cannot
// silently break a screen.
assertValidLessons(A1_LESSONS);
