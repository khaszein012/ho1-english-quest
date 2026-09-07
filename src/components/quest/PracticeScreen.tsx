import { useEffect, useMemo, useState } from "react";
import type { Lesson } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { SpeakerButton } from "@/lib/quest/audio";
import { randomPraise, shuffle, starBurst, bigCelebration } from "@/lib/quest/fx";

/** Words like "headphones" use "They are" — read from each word's own example sentence. */
function startsPlural(example: string) {
  return /^\s*(they\s+are|they're)\b/i.test(example);
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
              <div className="text-7xl">{card.emoji}</div>
              <p className="font-display text-3xl font-extrabold">{card.word}</p>
              {card.tag && (
                <p className="mx-auto w-fit rounded-full bg-gold px-4 py-1 font-display text-base font-extrabold text-gold-foreground">
                  {card.tag}
                </p>
              )}
              <p className="font-display text-xl">
                Say:{" "}
                <span className="font-extrabold text-gold">
                  {startsPlural(card.example) ? "They are" : "It is"} my {card.word}.
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
