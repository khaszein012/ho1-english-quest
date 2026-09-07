import { useState } from "react";
import type { Spotlight } from "@/lib/quest/config";
import { SpeakerButton } from "@/lib/quest/audio";
import { bigCelebration, randomPraise, starBurst } from "@/lib/quest/fx";

/**
 * "Sound Sort" spotlight mode — for lessons whose phonics words don't appear in
 * the passage. `sortStyle: "confirm_all"` (default) is a listen-and-confirm
 * activity: every card is a correct example. `sortStyle: "two_buckets"` uses
 * each card's `isTarget` flag so mixed right/wrong sets work later.
 */
export function SoundSortSpotlight({
  spotlight,
  onStar,
}: {
  spotlight: Spotlight;
  onStar: () => void;
}) {
  const cards = spotlight.sortWords ?? spotlight.words.map((word) => ({ word, isTarget: true, emoji: undefined }));
  const twoBuckets = spotlight.sortStyle === "two_buckets";
  const [done, setDone] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);

  const total = twoBuckets ? cards.filter((c) => c.isTarget).length : cards.length;

  function confirm(word: string, isTarget: boolean | undefined) {
    if (done.includes(word)) return;
    if (twoBuckets && !isTarget) {
      setShake(word);
      window.setTimeout(() => setShake(null), 400);
      return;
    }
    const next = [...done, word];
    setDone(next);
    starBurst();
    onStar();
    if (next.length === total) bigCelebration();
  }

  return (
    <div className="card-quest space-y-4 p-5">
      <h3 className="font-display text-xl font-bold">Sound &amp; Spelling Spotlight 🔤</h3>
      <p className="rounded-2xl bg-secondary/70 px-4 py-3 font-display text-2xl font-extrabold text-gold">
        {spotlight.sound} — like in {spotlight.exampleWord.toUpperCase()}
      </p>
      <p className="text-lg">{spotlight.instruction}</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const isDone = done.includes(c.word);
          return (
            <div
              key={c.word}
              className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-4 ${
                isDone ? "bg-grass text-gold-foreground animate-glow" : "bg-secondary/70"
              } ${shake === c.word ? "animate-shake" : ""}`}
            >
              <span className="font-display text-2xl font-extrabold">
                {c.emoji ? `${c.emoji} ` : ""}
                {c.word}
              </span>
              <div className="flex items-center gap-2">
                <SpeakerButton text={c.word} label={`Hear ${c.word}`} />
                <button
                  onClick={() => confirm(c.word, c.isTarget)}
                  disabled={isDone}
                  className="btn-pop bg-gold px-3 py-2 text-base text-gold-foreground disabled:opacity-60"
                >
                  {isDone ? "✅ Got it!" : `✅ Yes, ${spotlight.sound}!`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-display text-lg text-gold">
        Found {done.length} of {total}!
      </p>

      {done.length === total && (
        <div className="animate-pop-in space-y-2">
          <p className="rounded-2xl bg-grass px-4 py-3 font-display text-xl font-bold text-gold-foreground">
            Great listening! You found all {total} {spotlight.sound} sounds! 🎉 {randomPraise()}
          </p>
          {spotlight.note && (
            <p className="rounded-2xl bg-gold px-4 py-3 text-base font-bold text-gold-foreground">{spotlight.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
