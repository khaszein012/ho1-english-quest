import type { Lesson } from "@/lib/quest/config";
import { SpeakerButton } from "@/lib/quest/audio";
import { FlipCard } from "./FlipCard";

export function LearnScreen({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  return (
    <div className="space-y-5">
      <header className="card-quest p-5">
        <h2 className="font-display text-2xl font-extrabold">Learn — Expressions 💬</h2>
        <p className="mt-1 text-lg text-muted-foreground">
          Tap a card to see the model answer, then say it out loud.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lesson.expressions.map((e) => (
          <FlipCard
            key={e.prompt}
            height="h-56"
            onFirstFlip={onComplete}
            front={
              <>
                <span className="text-4xl">💬</span>
                <p className="text-center font-display text-xl font-bold">{e.prompt}</p>
                <span className="text-xs text-muted-foreground">tap to flip</span>
              </>
            }
            back={
              <>
                <p className="text-center font-display text-xl font-bold">{e.answer}</p>
                <SpeakerButton text={e.answer} label="Hear the answer" />
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
