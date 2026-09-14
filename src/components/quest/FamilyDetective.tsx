import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DetectiveFace, Lesson } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { SpeakerButton, useSpeak } from "@/lib/quest/audio";
import { bigCelebration, randomPraise, starBurst } from "@/lib/quest/fx";

/* =============================================================================
 * FAMILY DETECTIVE 🕵️ — a Guess-Who style deduction game.
 * The faces come from the lesson config (`lesson.detective.faces`); every answer
 * the app gives is derived truthfully from the secretly chosen face's own
 * attributes — answers are NEVER randomised.
 * ========================================================================== */

export type Ask = {
  id: string;
  group: string;
  option: string;
  /** Full question read aloud, e.g. "Is she your mother?" */
  text: (f?: DetectiveFace) => string;
  /** The attribute being asked about — gender-free, so it can never contradict. */
  attr: (f: DetectiveFace) => boolean;
  /** Set when the question itself names a gender ("Is she…?" / "Is he…?"). */
  gender?: "female" | "male";
  /** How the app answers: "they" questions use "Yes, they are!" */
  form: "she" | "he" | "they";
};

const isChild = (f: DetectiveFace) => f.age < 13;
const isYoung = (f: DetectiveFace) => f.age < 30;
const isOld = (f: DetectiveFace) => f.age >= 60;

export const ASKS: Ask[] = [
  { id: "she-woman", group: "Is she...?", option: "a woman?", text: () => "Is she a woman?", attr: (f) => f.gender === "female", form: "she" },
  { id: "she-mother", group: "Is she...?", option: "your mother?", text: () => "Is she your mother?", attr: (f) => f.relation === "mother", gender: "female", form: "she" },
  { id: "she-young", group: "Is she...?", option: "young?", text: () => "Is she young?", attr: isYoung, gender: "female", form: "she" },
  { id: "she-old", group: "Is she...?", option: "old?", text: () => "Is she old?", attr: isOld, gender: "female", form: "she" },
  { id: "he-man", group: "Is he...?", option: "a man?", text: () => "Is he a man?", attr: (f) => f.gender === "male", form: "he" },
  { id: "he-father", group: "Is he...?", option: "your father?", text: () => "Is he your father?", attr: (f) => f.relation === "father", gender: "male", form: "he" },
  { id: "he-young", group: "Is he...?", option: "young?", text: () => "Is he young?", attr: isYoung, gender: "male", form: "he" },
  { id: "he-old", group: "Is he...?", option: "old?", text: () => "Is he old?", attr: isOld, gender: "male", form: "he" },
  {
    id: "they-grandparents",
    group: "Are they...?",
    option: "your grandparents?",
    text: () => "Are they your grandparents?",
    attr: (f) => f.relation === "grandparent",
    form: "they",
  },
  { id: "they-children", group: "Are they...?", option: "children?", text: () => "Are they children?", attr: isChild, form: "they" },
  {
    id: "age-30",
    group: "Age",
    option: "over 30 years old?",
    text: (f) => (f && f.gender === "male" ? "Is he over 30 years old?" : "Is she over 30 years old?"),
    attr: (f) => f.age > 30,
    form: "she",
  },
];

/** True only when BOTH the named gender (if any) and the attribute fit the face. */
export const applies = (ask: Ask, f: DetectiveFace) => (!ask.gender || f.gender === ask.gender) && ask.attr(f);

/**
 * Truthful spoken answer. A gendered question about the wrong gender is never
 * answered with a plain "No" about the attribute — that would mislead (a 70-year-old
 * man is old even though "Is SHE old?" is No). Instead the app corrects the pronoun.
 */
export function answerFor(ask: Ask, face: DetectiveFace) {
  if (ask.gender && face.gender !== ask.gender) {
    return face.gender === "female"
      ? "No — the mystery person is a girl or a woman! 👧"
      : "No — the mystery person is a boy or a man! 👦";
  }
  const yes = ask.attr(face);
  if (ask.form === "they") return yes ? "Yes, they are!" : "No, they aren't!";
  const pronoun = face.gender === "female" ? "she" : "he";
  return yes ? `Yes, ${pronoun} is!` : `No, ${pronoun} isn't!`;
}

function starsFor(questions: number) {
  if (questions <= 4) return 3;
  if (questions <= 7) return 2;
  return 1;
}

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]!;

export function FamilyDetective({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const cfg = lesson.detective;
  const { addStars } = useQuest();
  const { speak } = useSpeak();

  const [phase, setPhase] = useState<"guess" | "won" | "reverse">("guess");
  const [speed, setSpeed] = useState(false);
  const [round, setRound] = useState(0);
  const faces = cfg?.faces ?? [];
  const secret = useMemo(() => (faces.length ? pick(faces) : null), [faces, round]);
  const [asked, setAsked] = useState<{ q: string; a: string }[]>([]);
  const [out, setOut] = useState<string[]>([]);
  const [reply, setReply] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // Speed Round ⚡ — 30 seconds to choose your next question (optional, off by default).
  useEffect(() => {
    if (!speed || phase !== "guess") return;
    if (timeLeft <= 0) return;
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [speed, phase, timeLeft]);

  const ask = useCallback(
    (a: Ask) => {
      if (!secret) return;
      const question = a.text(secret);
      const answer = answerFor(a, secret);
      speak([question, answer]);
      setAsked((list) => [...list, { q: question, a: answer }]);
      setReply(answer);
      setTimeLeft(30);
    },
    [secret, speak],
  );

  function guessFace(f: DetectiveFace) {
    if (!secret) return;
    if (f.id === secret.id) {
      const stars = starsFor(asked.length);
      addStars(lesson.id, stars);
      bigCelebration();
      onComplete();
      setPicking(false);
      setPhase("won");
      return;
    }
    setWrongId(f.id);
    window.setTimeout(() => setWrongId(null), 500);
    const clues = [
      `Psst… the mystery person is ${isOld(secret) ? "old" : isChild(secret) ? "a child" : "not old"}.`,
      `Psst… the mystery person is ${secret.gender === "female" ? "a woman or a girl" : "a man or a boy"}.`,
      `Psst… the mystery person is ${secret.age} years old.`,
    ];
    setHint(pick(clues));
  }

  function newGame() {
    setAsked([]);
    setOut([]);
    setReply(null);
    setHint(null);
    setPicking(false);
    setTimeLeft(30);
    setPhase("guess");
    setRound((r) => r + 1);
  }

  if (!cfg || !secret) {
    return <div className="card-quest p-6 text-lg">This lesson has no detective family set up yet.</div>;
  }

  const grouped = Array.from(new Set(ASKS.map((a) => a.group)));

  return (
    <div className="space-y-5">
      <header className="card-quest flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Family Detective 🕵️</h2>
          <p className="font-display text-lg text-gold">{cfg.title}</p>
        </div>
        <button
          onClick={() => {
            setSpeed((s) => !s);
            setTimeLeft(30);
          }}
          className={`btn-pop px-4 py-3 text-base ${speed ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          Speed Round ⚡ {speed ? "ON" : "OFF"}
        </button>
      </header>

      <p className="text-base text-muted-foreground">{lesson.practice.instructions}</p>

      {phase === "reverse" ? (
        <ReverseRound faces={faces} onDone={newGame} />
      ) : phase === "won" ? (
        <div className="card-quest animate-pop-in space-y-3 p-6 text-center">
          <p className="text-6xl">{secret.emoji}</p>
          <p className="font-display text-3xl font-extrabold">It was {secret.name}! 🎉</p>
          <p className="text-lg text-muted-foreground">
            {randomPraise()} You used {asked.length} {asked.length === 1 ? "question" : "questions"} and won{" "}
            {starsFor(asked.length)} ⭐
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={newGame} className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground">
              New mystery person 🔄
            </button>
            <button
              onClick={() => setPhase("reverse")}
              className="btn-pop bg-berry px-4 py-3 text-lg text-primary-foreground"
            >
              Your turn to hide! 🔄
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card-quest space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-lg font-bold">
                Questions used: {asked.length} · Stars if you're right now: {starsFor(asked.length)} ⭐
              </p>
              {speed && (
                <p className={`font-display text-xl font-extrabold ${timeLeft <= 5 ? "text-destructive" : "text-gold"}`}>
                  ⏱️ {timeLeft}s
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {faces.map((f) => {
                const eliminated = out.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => (picking ? guessFace(f) : setOut((o) => (eliminated ? o.filter((x) => x !== f.id) : [...o, f.id])))}
                    className={`btn-pop flex flex-col items-center gap-1 px-2 py-3 text-sm ${
                      picking ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
                    } ${eliminated ? "translate-y-2 opacity-40 grayscale" : ""} ${wrongId === f.id ? "animate-shake" : ""}`}
                  >
                    <span className="text-4xl">{f.emoji}</span>
                    <span className="font-display font-bold">{f.name}</span>
                    <span className="text-xs">{f.age} years old</span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              {picking
                ? "Tap the face you think is the mystery person!"
                : "Tap a face to cross it out — tap again to bring it back."}
            </p>
          </div>

          {reply && (
            <p className="animate-pop-in rounded-2xl bg-grass px-4 py-3 font-display text-2xl font-extrabold text-gold-foreground">
              {reply}
            </p>
          )}
          {hint && (
            <p className="animate-pop-in rounded-2xl bg-gold px-4 py-3 font-display text-xl font-bold text-gold-foreground">
              {hint}
            </p>
          )}

          <div className="card-quest space-y-4 p-5">
            <h3 className="font-display text-xl font-bold">Ask a question 💬</h3>
            {grouped.map((g) => (
              <div key={g} className="space-y-2">
                <p className="font-display text-lg text-gold">{g}</p>
                <div className="flex flex-wrap gap-2">
                  {ASKS.filter((a) => a.group === g).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => ask(a)}
                      className="btn-pop bg-secondary px-4 py-3 text-base text-secondary-foreground"
                    >
                      {a.option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => setPicking(true)}
              className="btn-pop w-full bg-gold px-4 py-4 text-xl text-gold-foreground"
            >
              I know who! 🕵️
            </button>
          </div>

          {asked.length > 0 && (
            <div className="card-quest space-y-2 p-5">
              <h3 className="font-display text-xl font-bold">My clues 📝</h3>
              {asked.map((a, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/70 px-4 py-2 text-base">
                  <span className="font-bold">{a.q}</span>
                  <span className="text-gold">{a.a}</span>
                  <SpeakerButton text={[a.q, a.a]} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * "Your turn to hide!" — the learner secretly picks a face and answers the app's
 * Yes/No questions, so they practise both asking and answering the target forms.
 */
function ReverseRound({ faces, onDone }: { faces: DetectiveFace[]; onDone: () => void }) {
  const { speak } = useSpeak();
  const [step, setStep] = useState(0);
  const [candidates, setCandidates] = useState<DetectiveFace[]>(faces);
  const [guess, setGuess] = useState<DetectiveFace | null>(null);
  const spoken = useRef<number>(-1);

  const question = ASKS[step];

  useEffect(() => {
    if (guess) return;
    if (question && spoken.current !== step) {
      spoken.current = step;
      speak(question.text(candidates[0]));
    }
  }, [step, question, guess, speak, candidates]);

  useEffect(() => {
    if (!guess && (candidates.length === 1 || !ASKS[step])) setGuess(candidates[0] ?? null);
  }, [candidates, step, guess]);

  if (guess) {
    return (
      <div className="card-quest space-y-3 p-6 text-center">
        <p className="text-6xl">{guess.emoji}</p>
        <p className="font-display text-2xl font-extrabold">Is it {guess.name}? 🤔</p>
        <p className="text-lg text-muted-foreground">Tell your teacher if I got it right!</p>
        <button onClick={onDone} className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground">
          Play again 🔄
        </button>
      </div>
    );
  }

  function reply(yes: boolean) {
    if (!question) return;
    setCandidates((list) => {
      const next = list.filter((f) => question.test(f) === yes);
      return next.length ? next : list;
    });
    setStep((s) => s + 1);
  }

  return (
    <div className="card-quest space-y-4 p-6 text-center">
      <p className="font-display text-lg text-muted-foreground">Your turn to hide! Pick a person in your head 🤫</p>
      <div className="flex items-center justify-center gap-3">
        <p className="font-display text-2xl font-extrabold">{question?.text(candidates[0])}</p>
        <SpeakerButton text={question?.text(candidates[0]) ?? ""} />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => reply(true)} className="btn-pop bg-grass px-6 py-3 text-lg text-gold-foreground">
          Yes ✅
        </button>
        <button onClick={() => reply(false)} className="btn-pop bg-secondary px-6 py-3 text-lg text-secondary-foreground">
          No ❌
        </button>
      </div>
      <button onClick={onDone} className="btn-pop bg-berry px-4 py-2 text-base text-primary-foreground">
        Back to detective 🕵️
      </button>
    </div>
  );
}
