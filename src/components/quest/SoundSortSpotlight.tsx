import { useState } from "react";
import type { Spotlight } from "@/lib/quest/config";
import { SpeakerButton } from "@/lib/quest/audio";
import { bigCelebration, randomPraise, starBurst } from "@/lib/quest/fx";

/**
 * "Sound Sort" spotlight mode — for lessons whose phonics words don't appear in
 * the passage. Two styles, both chosen in the lesson config:
 *  - `sortStyle: "confirm_all"` (default): every card is a correct example, so
 *    the child listens and confirms each one.
 *  - `sortStyle: "two_buckets"`: one card at a time is sorted into one of the
 *    two configured buckets, using each card's `bucket` id.
 */
export function SoundSortSpotlight({
  spotlight,
  onStar,
}: {
  spotlight: Spotlight;
  onStar: () => void;
}) {
  const cards: Card[] = spotlight.sortWords ?? spotlight.words.map((word) => ({ word, isTarget: true }));
  const twoBuckets = spotlight.sortStyle === "two_buckets" && (spotlight.buckets?.length ?? 0) === 2;

  if (twoBuckets) return <TwoBucketSort spotlight={spotlight} cards={cards} onStar={onStar} />;

  return <ConfirmAllSort spotlight={spotlight} cards={cards} onStar={onStar} />;
}

type Card = { word: string; isTarget?: boolean; emoji?: string; bucket?: string };

function SpotlightHeader({ spotlight }: { spotlight: Spotlight }) {
  return (
    <>
      <h3 className="font-display text-xl font-bold">Sound &amp; Spelling Spotlight 🔤</h3>
      <p className="rounded-2xl bg-secondary/70 px-4 py-3 font-display text-2xl font-extrabold text-gold">
        {spotlight.sound} — like in {spotlight.exampleWord.toUpperCase()}
      </p>
      <p className="text-lg">{spotlight.instruction}</p>
    </>
  );
}

/** Listen-and-confirm: every card is a correct example of the sound. */
function ConfirmAllSort({
  spotlight,
  cards,
  onStar,
}: {
  spotlight: Spotlight;
  cards: Card[];
  onStar: () => void;
}) {
  const [done, setDone] = useState<string[]>([]);
  const total = cards.length;

  function confirm(word: string) {
    if (done.includes(word)) return;
    const next = [...done, word];
    setDone(next);
    starBurst();
    onStar();
    if (next.length === total) bigCelebration();
  }

  return (
    <div className="card-quest space-y-4 p-5">
      <SpotlightHeader spotlight={spotlight} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const isDone = done.includes(c.word);
          return (
            <div
              key={c.word}
              className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-4 ${
                isDone ? "bg-grass text-gold-foreground animate-glow" : "bg-secondary/70"
              }`}
            >
              <span className="font-display text-2xl font-extrabold">
                {c.emoji ? `${c.emoji} ` : ""}
                {c.word}
              </span>
              <div className="flex items-center gap-2">
                <SpeakerButton text={c.word} label={`Hear ${c.word}`} />
                <button
                  onClick={() => confirm(c.word)}
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

/** Two-bucket sort: hear one word at a time, drop it in the right basket. */
function TwoBucketSort({
  spotlight,
  cards,
  onStar,
}: {
  spotlight: Spotlight;
  cards: Card[];
  onStar: () => void;
}) {
  const buckets = spotlight.buckets!;
  const [index, setIndex] = useState(0);
  const [sorted, setSorted] = useState<Record<string, string[]>>({});
  const [wrongBucket, setWrongBucket] = useState<string | null>(null);
  const current = cards[index];
  const total = cards.length;
  const doneCount = Object.values(sorted).reduce((n, list) => n + list.length, 0);

  function assign(bucketId: string) {
    if (!current) return;
    if (current.bucket !== bucketId) {
      setWrongBucket(bucketId);
      window.setTimeout(() => setWrongBucket(null), 450);
      return;
    }
    setSorted((prev) => ({ ...prev, [bucketId]: [...(prev[bucketId] ?? []), current.word] }));
    starBurst();
    onStar();
    const next = index + 1;
    setIndex(next);
    if (next === total) bigCelebration();
  }

  return (
    <div className="card-quest space-y-4 p-5">
      <SpotlightHeader spotlight={spotlight} />

      {current ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary/70 px-4 py-6">
          <p className="font-display text-base text-muted-foreground">
            Word {index + 1} of {total}
          </p>
          <span className="font-display text-4xl font-extrabold">
            {current.emoji ? `${current.emoji} ` : ""}
            {current.word}
          </span>
          <SpeakerButton text={current.word} label={`Hear ${current.word}`} />
          <p className="text-base text-muted-foreground">Listen first, then choose a basket 👇</p>
        </div>
      ) : (
        <div className="animate-pop-in space-y-2">
          <p className="rounded-2xl bg-grass px-4 py-3 font-display text-xl font-bold text-gold-foreground">
            All sorted! 🎉 {randomPraise()}
          </p>
          {spotlight.note && (
            <p className="rounded-2xl bg-gold px-4 py-3 text-base font-bold text-gold-foreground">{spotlight.note}</p>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {buckets.map((b) => (
          <div
            key={b.id}
            className={`space-y-3 rounded-2xl bg-surface-2 p-4 ${wrongBucket === b.id ? "animate-shake" : ""}`}
          >
            <button
              onClick={() => assign(b.id)}
              disabled={!current}
              className="btn-pop w-full bg-gold px-4 py-4 font-display text-lg text-gold-foreground disabled:opacity-60"
            >
              🧺 {b.label}
            </button>
            <div className="flex flex-wrap gap-2">
              {(sorted[b.id] ?? []).map((w) => (
                <span
                  key={w}
                  className="animate-pop-in rounded-full bg-grass px-3 py-1 font-display text-base font-bold text-gold-foreground"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="font-display text-lg text-gold">
        Sorted {doneCount} of {total}!
      </p>
    </div>
  );
}
