import { useMemo, useState } from "react";
import { LESSONS, type Lesson, type QuizItem } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { SpeakerButton } from "@/lib/quest/audio";
import { bigCelebration, randomPraise, shuffle, starBurst } from "@/lib/quest/fx";

/** 3 current-lesson questions + 2 review questions from earlier lessons (spaced repetition). */
function buildBossSet(lesson: Lesson): { item: QuizItem; review: boolean }[] {
  const earlier = LESSONS.filter((l) => l.number < lesson.number);
  const reviewPool = shuffle(earlier.flatMap((l) => l.boss));
  const reviewCount = Math.min(2, reviewPool.length);
  const currentCount = 5 - reviewCount;
  const current = shuffle(lesson.boss).slice(0, currentCount);
  return shuffle([
    ...current.map((item) => ({ item, review: false })),
    ...reviewPool.slice(0, reviewCount).map((item) => ({ item, review: true })),
  ]);
}

export function BossChallenge({ lesson }: { lesson: Lesson }) {
  const { addStars, defeatBoss, bossUnlocked, state } = useQuest();
  const [attempt, setAttempt] = useState(0);
  const set = useMemo(() => buildBossSet(lesson), [lesson, attempt]);
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const unlocked = bossUnlocked(lesson.id);
  const defeated = state.bossDefeated.includes(lesson.id);
  const current = set[index];

  if (!unlocked) {
    return (
      <div className="card-quest space-y-2 p-6 text-center">
        <h2 className="font-display text-2xl font-extrabold">Boss Challenge 🏆</h2>
        <p className="text-6xl">🔒</p>
        <p className="text-lg text-muted-foreground">
          Finish Vocabulary, Grammar, Learn, Practice, Reading and Role-Play to unlock the boss!
        </p>
      </div>
    );
  }

  function answer(option: string) {
    if (!current) return;
    if (option === current.item.answer) {
      addStars(lesson.id, 1);
      starBurst();
      const next = index + 1;
      setIndex(next);
      if (next === set.length) {
        defeatBoss(lesson.id);
        bigCelebration();
      }
    } else {
      setWrong(option);
      window.setTimeout(() => setWrong(null), 450);
    }
  }

  const health = Math.round((index / set.length) * 100);

  return (
    <div className="space-y-5">
      <header className="card-quest space-y-3 p-5">
        <h2 className="font-display text-2xl font-extrabold">Boss Challenge 🏆</h2>
        <p className="text-lg text-muted-foreground">
          A friendly boss made of tricky questions. Wrong answers cost nothing — try as many times as you like!
        </p>
        <div className="h-6 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${health}%` }}
          />
        </div>
        <p className="font-display text-base text-gold">Power bar: {health}%</p>
      </header>

      {!current ? (
        <div className="card-quest animate-pop-in space-y-3 p-8 text-center">
          <p className="text-7xl">🎉</p>
          <p className="font-display text-3xl font-extrabold">Boss Defeated!</p>
          <p className="text-lg text-muted-foreground">
            {randomPraise()} You unlocked the {lesson.sticker.name} sticker {lesson.sticker.emoji}
          </p>
          <button
            onClick={() => {
              setIndex(0);
              setAttempt((a) => a + 1);
            }}
            className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground"
          >
            Battle again 🔄
          </button>
        </div>
      ) : (
        <div className="card-quest space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-lg text-muted-foreground">
              Question {index + 1} of {set.length}
            </p>
            {current.review && (
              <span className="rounded-full bg-berry px-3 py-1 text-sm font-bold text-primary-foreground">
                Surprise review! 🔁
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="font-display text-2xl font-bold">{current.item.question}</p>
            <SpeakerButton text={current.item.question} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {current.item.options.map((o) => (
              <button
                key={o}
                onClick={() => answer(o)}
                className={`btn-pop bg-secondary px-4 py-4 text-lg text-secondary-foreground ${
                  wrong === o ? "animate-shake" : ""
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {defeated && current && (
        <p className="text-center text-base text-grass">You've already defeated this boss once. 💪</p>
      )}
    </div>
  );
}
