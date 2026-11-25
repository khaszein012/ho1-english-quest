import { useState } from "react";
import type { Lesson } from "@/lib/quest/config";
import { lessonsFor } from "@/lib/quest/courses";
import { useQuest } from "@/lib/quest/store";
import { starBurst } from "@/lib/quest/fx";

const FACES = ["🙁", "🙂", "😄"];

export function ProgressScreen({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { state, totalStars, level, wordsLearned, saveSelfCheck } = useQuest();
  const [answers, setAnswers] = useState<number[]>(() => lesson.selfCheck.map(() => -1));
  const [saved, setSaved] = useState(false);

  const history = state.selfChecks.filter((e) => e.lessonId === lesson.id).slice().reverse();

  return (
    <div className="space-y-5">
      <header className="card-quest flex flex-wrap items-center justify-between gap-3 p-5">
        <h2 className="font-display text-2xl font-extrabold">My Progress ✅</h2>
        <span className="rounded-full bg-gold px-4 py-2 font-display font-bold text-gold-foreground">
          ⭐ {totalStars} · Level {level.level} {level.name} {level.emoji}
        </span>
      </header>

      <div className="card-quest space-y-4 p-5">
        <h3 className="font-display text-xl font-bold">How do you feel?</h3>
        {lesson.selfCheck.map((q, i) => (
          <div key={q} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/70 px-4 py-3">
            <span className="text-lg">{q}</span>
            <div className="flex gap-2">
              {FACES.map((f, fi) => (
                <button
                  key={f}
                  onClick={() =>
                    setAnswers((a) => {
                      const next = [...a];
                      next[i] = fi;
                      return next;
                    })
                  }
                  className={`btn-pop px-3 py-2 text-2xl ${
                    answers[i] === fi ? "bg-gold" : "bg-surface-2"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            saveSelfCheck(lesson.id, answers);
            setSaved(true);
            starBurst();
            onComplete();
          }}
          disabled={answers.some((a) => a < 0)}
          className="btn-pop bg-grass px-5 py-3 text-lg text-gold-foreground disabled:opacity-50"
        >
          Save today's check ✅
        </button>
        {saved && <p className="text-grass">Saved! Come back another day to see how you grow. 🌱</p>}
      </div>

      {history.length > 0 && (
        <div className="card-quest space-y-2 p-5">
          <h3 className="font-display text-xl font-bold">My check-in history</h3>
          {history.map((e) => (
            <div key={e.date} className="flex items-center gap-3 rounded-2xl bg-secondary/70 px-4 py-2">
              <span className="font-display text-base">{e.date}</span>
              <span className="text-2xl">{e.answers.map((a) => FACES[a] ?? "❔").join(" ")}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card-quest space-y-3 p-5">
        <h3 className="font-display text-xl font-bold">Stars &amp; words by lesson</h3>
        {lessonsFor(state.courseLevel).map((l) => {
          const stars = state.starsByLesson[l.id] ?? 0;
          const learned = wordsLearned(l.id);
          return (
            <div key={l.id} className="space-y-1">
              <div className="flex justify-between text-base">
                <span>
                  {l.emoji} Lesson {l.number}: {l.title}
                </span>
                <span className="font-display font-bold text-gold">
                  ⭐ {stars} · {learned}/{l.vocabulary.length} words
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gold transition-all"
                  style={{ width: `${Math.min(100, (learned / l.vocabulary.length) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
