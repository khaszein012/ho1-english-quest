import { PLANNED_LESSON_COUNT } from "@/lib/quest/config";
import { lessonsFor } from "@/lib/quest/courses";
import { useQuest } from "@/lib/quest/store";

export function StickerAlbum({ onClose }: { onClose: () => void }) {
  const { state } = useQuest();
  const lessons = lessonsFor(state.courseLevel);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur">
      <div className="card-quest max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold">My Stickers 🎟️</h2>
          <button onClick={onClose} className="btn-pop bg-secondary px-4 py-2 text-lg text-secondary-foreground">
            Close ✕
          </button>
        </div>
        <p className="mt-2 text-muted-foreground">
          Beat a Boss Challenge or learn every word in a lesson to earn its sticker.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {lessons.map((l) => {
            const unlocked = state.stickers.includes(l.id);
            return (
              <div
                key={l.id}
                className={`card-quest flex flex-col items-center gap-2 p-5 text-center ${
                  unlocked ? "animate-pop-in" : "opacity-50 grayscale"
                }`}
              >
                <span className="text-5xl">{unlocked ? l.sticker.emoji : "❓"}</span>
                <span className="font-display font-bold">{unlocked ? l.sticker.name : "Locked"}</span>
                <span className="text-xs text-muted-foreground">Lesson {l.number}</span>
              </div>
            );
          })}
          {Array.from({ length: Math.max(0, PLANNED_LESSON_COUNT - lessons.length) }).map((_, i) => (
            <div key={i} className="card-quest flex flex-col items-center gap-2 p-5 text-center opacity-30">
              <span className="text-5xl">❓</span>
              <span className="font-display font-bold">Coming soon</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
