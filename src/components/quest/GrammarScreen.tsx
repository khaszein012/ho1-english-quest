import { useState } from "react";
import type { Lesson } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { SpeakerButton } from "@/lib/quest/audio";
import { randomPraise, starBurst } from "@/lib/quest/fx";

const NUDGES = [
  "Almost! Try another one 🙂",
  "Good try! Tap a different word 💛",
  "Nice thinking — one more go! ✨",
];

export function GrammarScreen({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { addStars } = useQuest();
  const [solved, setSolved] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [nudge, setNudge] = useState<Record<number, string>>({});
  const g = lesson.grammar;

  function pick(itemIndex: number, option: string, answer: string) {
    if (option === answer) {
      setNudge((n) => ({ ...n, [itemIndex]: "" }));
      if (!solved.includes(itemIndex)) {
        setSolved((s) => [...s, itemIndex]);
        addStars(lesson.id, 1);
        starBurst();
        onComplete();
      }
    } else {
      // Friendly nudge only — wrong taps never remove stars or lock the item.
      setWrong(`${itemIndex}-${option}`);
      setNudge((n) => ({
        ...n,
        [itemIndex]: NUDGES[Math.floor(Math.random() * NUDGES.length)]!,
      }));
      window.setTimeout(() => setWrong(null), 450);
    }
  }

  return (
    <div className="space-y-5">
      <header className="card-quest p-5">
        <h2 className="font-display text-2xl font-extrabold">Grammar Focus 🧩</h2>
        <p className="mt-1 font-display text-xl text-gold">{g.title}</p>
        <p className="mt-2 text-lg text-muted-foreground">{g.explanation}</p>
      </header>

      <div className="card-quest space-y-4 p-5">
        <h3 className="font-display text-xl font-bold">The sentence pattern 🎨</h3>
        <div className="flex flex-wrap gap-2 text-sm font-semibold">
          <span className="rounded-full bg-sky/20 px-3 py-1 text-sky">💙 WHO — the person</span>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-gold">💛 DOING WORD — have / don't have</span>
          <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
            🤍 THE THING — what it is
          </span>
        </div>
        {g.patterns.map((p, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/50 px-4 py-3 font-display text-2xl font-extrabold sm:text-3xl"
          >
            {p.subject && (
              <span className="rounded-xl bg-sky/20 px-3 py-1 text-sky">{p.subject}</span>
            )}
            {p.verb && <span className="rounded-xl bg-gold/20 px-3 py-1 text-gold">{p.verb}</span>}
            {p.rest && <span className="px-1">{p.rest}</span>}
            {p.note && (
              <span className="rounded-full bg-card px-3 py-1 font-sans text-sm font-semibold text-muted-foreground">
                {p.note}
              </span>
            )}
          </div>
        ))}
      </div>


      <div className="card-quest space-y-3 p-5">
        <h3 className="font-display text-xl font-bold">Listen to the examples</h3>
        {g.examples.map((ex) => (
          <div key={ex} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/70 px-4 py-3">
            <span className="text-lg">{ex}</span>
            <SpeakerButton text={ex} />
          </div>
        ))}
      </div>

      <div className="card-quest space-y-4 p-5">
        <h3 className="font-display text-xl font-bold">Your Turn ✍️</h3>
        {g.yourTurn.map((item, i) => (
          <div key={item.question} className="space-y-2">
            <p className="font-display text-2xl">{item.question}</p>
            <div className="flex flex-wrap gap-3">
              {item.options.map((o) => (
                <button
                  key={o}
                  onClick={() => pick(i, o, item.answer)}
                  className={`btn-pop px-4 py-3 text-lg ${
                    solved.includes(i) && o === item.answer
                      ? "bg-grass text-gold-foreground animate-glow"
                      : "bg-secondary text-secondary-foreground"
                  } ${wrong === `${i}-${o}` ? "animate-shake" : ""}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
        {solved.length === g.yourTurn.length && (
          <p className="animate-pop-in rounded-2xl bg-grass px-4 py-3 font-display text-xl font-bold text-gold-foreground">
            All correct! {randomPraise()} 🎉
          </p>
        )}
      </div>
    </div>
  );
}
