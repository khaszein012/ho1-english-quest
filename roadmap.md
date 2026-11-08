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