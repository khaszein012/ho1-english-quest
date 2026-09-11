import { useEffect, useMemo, useState } from "react";
import type { Lesson } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { SpeakerButton } from "@/lib/quest/audio";
import { randomPraise, shuffle, starBurst, bigCelebration } from "@/lib/quest/fx";

/** Words like "headphones" use "They are" — read from each word's own example sentence. */
function startsPlural(example: string) {
  return /^\s*(they\s+are|they're)\b/i.test(example);
}

/** Sentence opener for a card: near/far cue lessons use this/that/these/those. */
function sayFrame(card: { word: string; example: string; cue?: "near" | "far"; many?: boolean }) {
  if (card.cue) {
    const article = /^[aeiou]/i.test(card.word) ? "an" : "a";
    if (card.cue === "near") return card.many ? "These are" : `This is ${article}`;
    return card.many ? "Those are" : `That is ${article}`;
  }
  return startsPlural(card.example) ? "They are" : "It is";
}

/**
 * Unambiguous distance picture for near/far lessons: NEAR = zoomed-in, filling
 * the frame with a hand touching it; FAR = zoomed-out, the thing tiny at the
 * end of a long pointing arrow. The learner must read the distance at a glance.
 */
function DistanceFrame({ emoji, cue }: { emoji: string; cue: "near" | "far" }) {
  if (cue === "near") {
    return (
      <div className="mx-auto w-full max-w-sm space-y-2">
        <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-3xl border-4 border-grass bg-secondary">
          <span className="text-9xl leading-none">{emoji}</span>
          <span className="absolute bottom-2 right-3 text-5xl">🖐️</span>
        </div>
        <p className="mx-auto w-fit rounded-full bg-grass px-5 py-2 font-display text-xl font-extrabold text-gold-foreground">
          NEAR — right here! 🖐️
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-sm space-y-2">
      <div className="flex h-40 items-center justify-between gap-2 rounded-3xl border-4 border-gold bg-secondary px-6">
        <span className="text-6xl">🙋</span>
        <span aria-hidden className="flex-1 border-t-8 border-dashed border-gold" />
        <span className="text-5xl">👉</span>
        <span className="text-4xl">{emoji}</span>
      </div>
      <p className="mx-auto w-fit rounded-full bg-gold px-5 py-2 font-display text-xl font-extrabold text-gold-foreground">
        FAR — over there! 👉
      </p>
    </div>
  );
}

export function PracticeScreen({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { addStars, markWordCorrect } = useQuest();
  const [round, setRound] = useState(0);
  const cards = useMemo(() => shuffle(lesson.vocabulary), [lesson, round]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [speed, setSpeed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(lesson.speedRoundSeconds);
  const card = cards[index];

  useEffect(() => {
    setTimeLeft(lesson.speedRoundSeconds);
  }, [index, speed, lesson.speedRoundSeconds]);

  useEffect(() => {
    if (!speed || !revealed || !card) return;
    if (timeLeft <= 0) {
      setRevealed(false);
      setIndex((i) => i + 1);
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [speed, revealed, timeLeft, card]);

  function got(inTime: boolean) {
    if (!card) return;
    const bonus = speed && inTime && timeLeft > 0;
    addStars(lesson.id, bonus ? 2 : 1);
    markWordCorrect(lesson.id, card.word);
    if (bonus) bigCelebration();
    else starBurst();
    onComplete();
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-5">
      <header className="card-quest flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Practice Game 🎮</h2>
          <p className="font-display text-lg text-gold">{lesson.practice.title}</p>
        </div>
        <button
          onClick={() => setSpeed((s) => !s)}
          className={`btn-pop px-4 py-3 text-base ${
            speed ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          Speed Round ⚡ {speed ? "ON" : "OFF"}
        </button>
      </header>

      <div className="card-quest flex flex-wrap items-center gap-3 p-4">
        {lesson.sentenceFrames.map((f) => (
          <span key={f} className="rounded-full bg-secondary px-4 py-2 font-display text-lg">
            {f}
          </span>
        ))}
      </div>
      <p className="text-base text-muted-foreground">{lesson.practice.instructions}</p>

      {!card ? (
        <div className="card-quest animate-pop-in space-y-3 p-6 text-center">
          <p className="font-display text-3xl font-extrabold">Backpack checked! 🎉</p>
          <p className="text-muted-foreground">{randomPraise()}</p>
          <button
            onClick={() => {
              setIndex(0);
              setRound((r) => r + 1);
            }}
            className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground"
          >
            Shuffle and play again 🔄
          </button>
        </div>
      ) : (
        <div className="card-quest space-y-4 p-6 text-center">
          <p className="font-display text-lg text-muted-foreground">
            Card {index + 1} of {cards.length}
          </p>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="btn-pop mx-auto flex h-44 w-full max-w-sm items-center justify-center bg-primary text-5xl text-primary-foreground"
            >
              ❓ Tap to flip
            </button>
          ) : (
            <div className="space-y-4">
              {speed && (
                <p className="font-display text-2xl font-extrabold text-gold">⏱️ {timeLeft}s</p>
              )}
              {card.cue ? (
                <DistanceFrame emoji={card.emoji} cue={card.cue} />
              ) : (
                <div className="text-7xl">{card.emoji}</div>
              )}
              <p className="font-display text-3xl font-extrabold">
                {card.word}
                {card.cue && card.many ? "s" : ""}
              </p>
              {card.tag && (
                <p className="mx-auto w-fit rounded-full bg-gold px-4 py-1 font-display text-base font-extrabold text-gold-foreground">
                  {card.tag}
                </p>
              )}
              <p className="font-display text-xl">
                Say:{" "}
                <span className="font-extrabold text-gold">
                  {sayFrame(card)} {card.cue && !card.many ? "" : "my "}
                  {card.word}
                  {card.cue && card.many ? "s" : ""}.
                </span>
              </p>
              <SpeakerButton text={card.example} label="Hear an example" />
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => got(true)}
                  className="btn-pop bg-grass px-5 py-3 text-lg text-gold-foreground"
                >
                  Got it! ⭐
                </button>
                <button
                  onClick={() => setRevealed(false)}
                  className="btn-pop bg-secondary px-5 py-3 text-lg text-secondary-foreground"
                >
                  Need more practice 🔄
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
