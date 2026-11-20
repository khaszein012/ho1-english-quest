# UI refresh
- [x] Refine shared design and all lesson layouts for desktop, tablet and phone.
- [x] Add a locally saved editable student name without changing progress.
- [x] Verify every screen across five device sizes and the name-edit flow; 165 layout checks passed, with active-game and drawing checks on desktop and phones.
- [x] Apply required package security update; preview build passed.

# Conversation warm-ups
- [x] Add a conversation before role-play in each of the four units.
- [x] Add four cohesive illustrations suitable for 10-year-olds and A2 learners.
- [x] Verify images, audio controls, role switching, hidden-line practice, tutor pop-out scripts and role-play transition across five screen sizes. Actual audible speech remains unavailable in sandbox Chromium.

# Reading illustrations
- [x] Add a story-matched illustration to all four Reading sections without changing passages or exercises; Lesson 4 keeps its pending passage.
- [x] Verify all four images across five screen sizes, plus word-hunt, comprehension and sound-sort interactions; no runtime errors.

# A2 content upgrade
- [x] Raise all four lessons from A1 to A2 for a 10-year-old learner: lesson 1 present continuous, lesson 2 comparatives & superlatives, lesson 3 there is/there are + prepositions, lesson 4 past simple.
- [x] Rewrite vocabulary examples, grammar blocks, expressions, role-play conversations and self-checks for the new grammar; add a config-driven `grammar.tip` chip to the Grammar screen.
- [x] Write the missing Lesson 4 reading passage ("Different Kinds of Families") plus its comprehension questions; rewrite the other three passages at A2.
- [x] Harden boss fights for A2: 15 questions, 3 spaced-repetition review items, surrender after 30 attempts.
- [x] Fresh-start save under `quest_arsyad_english_v2` (the A1 `v1` save stays in the browser untouched); rebrand title/meta from "Course 2 / A1" to "A2" and bump TTS rate to 0.85.
- [x] Verify with tsc, eslint and a full browser walkthrough of every screen and boss fight.

# Boss Challenge 2.0
- [x] Add combo streaks (every 3rd consecutive correct = +5 damage), a chargeable ⚡ Super Move (tap to arm, next hit deals 20) and a finish-line moment with a berry ring on the last hit.
- [x] Give each boss a personality: per-boss hurt lines, taunts and two phase-change shouts; the HP bar turns berry in the boss's critical final third, where misses heal it 15 instead of 10 (still impossible to lose).
- [x] Add "Story check 📖" questions so the boss now draws from the reading section too — fights cover every part of a lesson; add `comboBurst()` confetti for combo/super hits.
- [x] Make boss tuning and personalities fully config-driven (`BossFightConfig` combo/super/critical fields, `Lesson.bossPersona`); disable option buttons during hit/regen animations to prevent double taps.
- [x] Verify the whole loop in the browser: combo, charge → arm → super hit, phase lines, critical regen, story questions, win flow and best records; tsc + eslint clean.

# Teacher mode
- [x] Add a 🎓 tutor switch in both headers that unlocks every lesson's boss while active (gold-lit button, persisted in the quest save), so any lesson and boss can be tested without a play-through; bosses lock again when it is turned off.

# Scope alignment with the course book
- [x] Re-align all four lessons to the book's Units 1-4 after reviewing the official scope: grammar targets reverted to the book structures (have / It is-They are + my-you / this-that-these-those + colour adjectives / Is she-Is he-Are they + ages); the out-of-scope A1→A2 grammar experiment (present continuous, comparatives, there is/there are, past simple) was removed.
- [x] Vocabulary lists now follow the book's unit word lists (16/16/16/9 words, e.g. crayon, glue stick, lunchbox, paintbrush, pencil sharpener, tape; kite, doll, hula hoop, rollerblades, soccer ball; easel, mat, wastebasket, drawing; family, friend, teacher, children).
- [x] Lesson titles match the book ("School Things", "My Toys", "My Classroom", "Family and Friends"); reading titles match ("Students of the Future", "Old Toys", "One-room School", "Different Kinds of Families"); phonics sets extended to the book's lists (long u adds boots + glue stick, long o adds jump rope, long e adds easel).
- [x] The A2 depth stays: richer meanings and examples, fuller reading passages, harder boss tuning, per-boss personalities, story-check questions — all within the book's grammar.

# Content quality guards
- [x] Add a lesson-config validator (`config-validator.ts`) that runs against the real `LESSONS` at module load and fails fast in dev/build: answers must be inside their options, comprehension answers and word-hunt targets must appear in the passage, grammar patterns must be complete (with the book's Is she/Is he/Are they exception), conversations must alternate exactly two roles, vocabulary must be unique and non-empty, and boss/listening minimums. First run caught two real answer/passage mismatches (lesson 1 "yellow boots", lesson 4 "Rafa's parents"), now fixed.
- [x] Add `npm test` (Node's built-in runner, zero new dependencies) with suites for the validator (fixture lessons, one broken rule per test) and the profile helper; fix the orphaned `profile.test.ts` import.
- [x] Fix the reading read-aloud sentence splitter (now `reading.ts`): punctuation inside quoted dialogue no longer breaks sentences, attribution stays with its quote ("'It is fun!' says Dito." is one unit), apostrophes and curly quotes are handled, and repeated punctuation stays together — verified in the browser on the "Old Toys" and "Different Kinds of Families" passages.

# App voice picker
- [x] Add a voice choice to the App Voice audio panel: a select listing the device's English voices live (handles Chrome's async voice loading), with "Auto (recommended)" as the default and a ☁ marker for online voices that may lag.
- [x] The choice is saved in the quest state (`voiceURI`, empty = auto), survives reloads, falls back to auto on devices where the saved voice is missing, and applies to every spoken thing — SpeakerButtons, Test Sound and the reading read-aloud.

# Unit PIN gates + first-run name popup
- [x] Lock every unit after the first behind its own PIN (config `pin` field, tutor-editable: 2468 / 1357 / 9876); lesson 1 stays open. Locked tiles show a lock with "Enter PIN to unlock"; a friendly dialog shakes on wrong codes and celebrates + opens the unit on the right one.
- [x] Persist PIN unlocks in the quest save (`unlockedLessons`) and keep teacher mode as the full bypass; winning a boss reveals the next unit's PIN on the victory screen.
- [x] Show a first-run popup on a new browser asking for the student's name ("What should we call you, explorer?") — shown once (`namePrompted`), keeps the previous name when left empty.
- [x] Extend the config validator with the PIN rules (every unit after 1 needs a PIN; two units cannot share one) with tests; verified end-to-end in the browser: welcome popup, wrong/right PIN flow, persistence across reloads and the boss-victory PIN reveal.

# Lesson 5 — The Big Review (Units 1-4)
- [x] Add lesson 5 as a 75-minute review session (`plannedMinutes` + a per-screen session plan card in the sidebar, minutes summing to exactly 75, ending with self-assessment on My Progress).
- [x] Evaluation content drawn from all four units: 16 mixed vocabulary words (4 per unit) plus 8 review words for the game pools, 8 grammar patterns covering every structure, 8 mixed expressions, an 8-item mixed yourTurn quiz, and a 10-item hand-written evaluation boss.
- [x] New reading "The School Fair" weaving all four structures, with 6 comprehension questions covering every unit and a two-basket long U / long O phonics review built from the Unit 1-2 sound sets.
- [x] Role-play conversation mixing all units at the school fair; expanded 6-item self-assessment; final boss "The Grand Mixer 🌀" (18 questions, 120 HP, 5 spaced-repetition items from Units 1-4).
- [x] Lesson 5 is PIN-gated like the others (4321) — the Unit 4 boss victory reveals it; validator extended with plannedMinutes/session-plan rules and tests.