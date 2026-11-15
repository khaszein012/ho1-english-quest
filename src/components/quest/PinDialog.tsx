import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { starBurst } from "@/lib/quest/fx";
import type { Lesson } from "@/lib/quest/config";

/** The PIN gate for a locked unit. Correct code → unlock + celebrate. */
export function PinDialog({
  lesson,
  onUnlocked,
  onClose,
}: {
  lesson: Lesson;
  onUnlocked: (lessonId: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const guess = value.trim().toLowerCase();
    if (lesson.pin && guess === lesson.pin.trim().toLowerCase()) {
      starBurst();
      onUnlocked(lesson.id);
      onClose();
      return;
    }
    // Friendly only — wrong guesses never lock the kid out of trying again.
    setWrong(true);
    window.setTimeout(() => setWrong(false), 900);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] rounded-lg bg-card">
        <DialogHeader>
          <DialogTitle>🔒 {lesson.title} is locked</DialogTitle>
          <DialogDescription>
            Beat the previous boss to earn the PIN — or ask your teacher for it!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <label htmlFor="unit-pin" className="block text-sm font-semibold">
            Secret PIN
          </label>
          <Input
            id="unit-pin"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            placeholder="••••"
            className={`h-11 text-center font-display text-2xl tracking-[0.4em] ${
              wrong ? "animate-shake" : ""
            }`}
          />
          {wrong && (
            <p className="text-sm text-berry">Not quite! Check the PIN with your teacher. 💛</p>
          )}
          <Button type="submit" className="w-full" disabled={!value.trim()}>
            Unlock this adventure ⚡
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
