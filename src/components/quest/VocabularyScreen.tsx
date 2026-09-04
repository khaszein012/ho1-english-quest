import { useEffect, useMemo, useState } from "react";
import type { Lesson, VocabWord } from "@/lib/quest/config";
import { WORD_MASTERY_TARGET } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { SpeakerButton, useSpeak } from "@/lib/quest/audio";
import { randomPraise, shuffle, starBurst } from "@/lib/quest/fx";
import { FlipCard } from "./FlipCard";

type Mode = "cards" | "match" | "listen" | "say";

const MODES: { id: Mode; label: string }[] = [
  { id: "cards", label: "Word Cards 📖" },
  { id: "match", label: "Match It 🔗" },
  { id: "listen", label: "Listen & Pick 🔊" },
  { id: "say", label: "Say It 🗣️" },
];

export function VocabularyScreen({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [mode, setMode] = useState<Mode>("cards");
  const { wordsLearned } = useQuest();

  return (
    <div className="space-y-5">
      <header className="card-quest flex flex-wrap items-center justify-between gap-3 p-4">
        <h2 className="font-display text-2xl font-extrabold">Vocabulary 📚</h2>
        <span className="rounded-full bg-gold px-4 py-1 font-display font-bold text-gold-foreground">
          Words learned: {wordsLearned(lesson.id)} / {lesson.vocabulary.length}
        </span>
      </header>

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`btn-pop px-4 py-3 text-base ${
              mode === m.id ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "cards" && <WordCards lesson={lesson} onComplete={onComplete} />}
      {mode === "match" && <MatchIt lesson={lesson} onComplete={onComplete} />}
      {mode === "listen" && <ListenAndPick lesson={lesson} onComplete={onComplete} />}
      {mode === "say" && <SayIt lesson={lesson} onComplete={onComplete} />}
    </div>
  );
}

function WordCards({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lesson.vocabulary.map((w) => (
        <FlipCard
          key={w.word}
          onFirstFlip={onComplete}
          front={
            <>
              <span className="text-6xl">{w.emoji}</span>
              <span className="font-display text-2xl font-extrabold">{w.word}</span>
              <span className="text-xs text-muted-foreground">tap to flip</span>
            </>
          }
          back={
            <>
              {w.imagePath && <img src={w.imagePath} alt={w.word} className="h-16 rounded-xl object-cover" />}
              <p className="text-center text-base font-semibold">{w.meaning}</p>
              <p className="text-center text-sm italic text-primary-foreground/85">"{w.example}"</p>
              <SpeakerButton text={[w.word, w.example]} label="Hear word and example" />
            </>
          }
        />
      ))}
    </div>
  );
}

function MatchIt({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { addStars, markWordCorrect } = useQuest();
  const [round, setRound] = useState(0);
  const picks = useMemo(() => shuffle(lesson.vocabulary).slice(0, 5), [lesson, round]);
  const meanings = useMemo(() => shuffle(picks), [picks]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);

  const done = matched.length === picks.length;

  function pickMeaning(w: VocabWord) {
    if (!selected) return;
    if (selected === w.word) {
      setMatched((m) => [...m, w.word]);
      setSelected(null);
      addStars(lesson.id, 1);
      markWordCorrect(lesson.id, w.word);
      starBurst();
      onComplete();
    } else {
      setWrong(w.word);
      window.setTimeout(() => setWrong(null), 450);
    }
  }

  return (
    <div className="card-quest space-y-4 p-4 sm:p-6">
      <p className="text-base text-muted-foreground">Tap a word, then tap its meaning. Wrong taps never lose stars.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          {picks.map((w) => (
            <button
              key={w.word}
              disabled={matched.includes(w.word)}
              onClick={() => setSelected(w.word)}
              className={`btn-pop flex w-full items-center gap-3 px-4 py-3 text-left text-lg ${
                matched.includes(w.word)
                  ? "bg-grass text-gold-foreground"
                  : selected === w.word
                    ? "bg-gold text-gold-foreground"
                    : "bg-secondary text-secondary-foreground"
              }`}
            >
              <span className="text-2xl">{w.emoji}</span> {w.word}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {meanings.map((w) => (
            <button
              key={w.word}
              disabled={matched.includes(w.word)}
              onClick={() => pickMeaning(w)}
              className={`btn-pop w-full px-4 py-3 text-left text-base ${
                matched.includes(w.word) ? "bg-grass text-gold-foreground animate-glow" : "bg-secondary text-secondary-foreground"
              } ${wrong === w.word ? "animate-shake" : ""}`}
            >
              {w.meaning}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <div className="animate-pop-in rounded-2xl bg-grass px-4 py-3 font-display text-xl font-bold text-gold-foreground">
          All matched! {randomPraise()} 🎉
          <button
            onClick={() => {
              setMatched([]);
              setRound((r) => r + 1);
            }}
            className="btn-pop ml-3 bg-gold px-3 py-2 text-base"
          >
            New round 🔄
          </button>
        </div>
      )}
    </div>
  );
}

function ListenAndPick({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { addStars, markWordCorrect } = useQuest();
  const { speak } = useSpeak();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const total = 6;

  const rounds = useMemo(
    () =>
      Array.from({ length: total }, () => {
        const options = shuffle(lesson.vocabulary).slice(0, 4);
        const target = options[Math.floor(Math.random() * options.length)]!;
        return { options, target };
      }),
    [lesson],
  );

  const current = rounds[round];

  useEffect(() => {
    if (current) speak(current.target.word);
  }, [current, speak]);

  if (!current) {
    return (
      <div className="card-quest animate-pop-in space-y-3 p-6 text-center">
        <p className="font-display text-3xl font-extrabold">You scored {score} / {total}! 🎉</p>
        <p className="text-muted-foreground">{randomPraise()}</p>
        <button
          onClick={() => {
            setRound(0);
            setScore(0);
          }}
          className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground"
        >
          Play again 🔄
        </button>
      </div>
    );
  }

  function pick(word: string) {
    if (word === current!.target.word) {
      setScore((s) => s + 1);
      addStars(lesson.id, 1);
      markWordCorrect(lesson.id, word);
      starBurst();
      onComplete();
      setReveal(false);
      setRound((r) => r + 1);
    } else {
      setWrong(word);
      setReveal(true);
      window.setTimeout(() => setWrong(null), 450);
    }
  }

  return (
    <div className="card-quest space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-bold">Round {round + 1} of {total}</p>
        <SpeakerButton text={current.target.word} label="Hear it again" />
      </div>
      <p className="text-muted-foreground">Which word did you hear?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {current.options.map((o) => (
          <button
            key={o.word}
            onClick={() => pick(o.word)}
            className={`btn-pop px-4 py-4 text-xl ${
              reveal && o.word === current.target.word
                ? "bg-grass text-gold-foreground animate-glow"
                : "bg-secondary text-secondary-foreground"
            } ${wrong === o.word ? "animate-shake" : ""}`}
          >
            {o.emoji} {o.word}
          </button>
        ))}
      </div>
      {reveal && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-secondary/70 px-4 py-3">
          <span>Almost! The answer is highlighted — listen again:</span>
          <SpeakerButton text={[current.target.word, current.target.example]} label="Hear it again" />
          <button
            onClick={() => {
              setReveal(false);
              setRound((r) => r + 1);
            }}
            className="btn-pop bg-gold px-3 py-2 text-base text-gold-foreground"
          >
            Next ▶️
          </button>
        </div>
      )}
    </div>
  );
}

function SayIt({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { addStars, markWordCorrect, state } = useQuest();
  const { speak } = useSpeak();
  const [index, setIndex] = useState(0);
  const word = lesson.vocabulary[index];

  if (!word) {
    return (
      <div className="card-quest animate-pop-in space-y-3 p-6 text-center">
        <p className="font-display text-3xl font-extrabold">You said them all! 🌟</p>
        <button onClick={() => setIndex(0)} className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground">
          Go again 🔄
        </button>
      </div>
    );
  }

  const count = state.wordCounts[`${lesson.id}:${word.word}`] ?? 0;

  return (
    <div className="card-quest space-y-4 p-6 text-center">
      <p className="font-display text-lg font-bold text-muted-foreground">
        Word {index + 1} of {lesson.vocabulary.length}
      </p>
      <div className="animate-float text-7xl">{word.emoji}</div>
      <p className="font-display text-3xl font-extrabold">{word.word}</p>
      <p className="text-lg text-muted-foreground">{word.meaning}</p>
      <p className="text-sm text-gold">
        {Math.min(count, WORD_MASTERY_TARGET)} / {WORD_MASTERY_TARGET} to master this word
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <SpeakerButton text={[word.word, word.example]} label="Hear it" />
        <button
          onClick={() => {
            addStars(lesson.id, 1);
            markWordCorrect(lesson.id, word.word);
            starBurst();
            onComplete();
            setIndex((i) => i + 1);
          }}
          className="btn-pop bg-grass px-5 py-3 text-lg text-gold-foreground"
        >
          I said it! ⭐
        </button>
        <button
          onClick={() => speak([word.word, word.example])}
          className="btn-pop bg-secondary px-5 py-3 text-lg text-secondary-foreground"
        >
          Let me hear it again 🔄
        </button>
      </div>
    </div>
  );
}
