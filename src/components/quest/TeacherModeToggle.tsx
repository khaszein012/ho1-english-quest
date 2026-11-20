import { useState, type FormEvent } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuest } from "@/lib/quest/store";
import { TEACHER_PIN } from "@/lib/quest/config";

/**
 * Tutor-only switch: while on, every lesson's boss is unlocked so any part of
 * the course can be tested without playing through all six screens first.
 * The button lights up gold while teacher mode is active. Switching ON asks
 * for the tutor PIN so students can't open it from their own browser; turning
 * it off is free (that only re-locks things).
 */
export function TeacherModeToggle() {
  const { state, setTeacherMode } = useQuest();
  const on = state.teacherMode;
  const [askPin, setAskPin] = useState(false);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const label = on
    ? "Turn teacher mode off (bosses lock again)"
    : "Turn teacher mode on (unlocks every boss)";

  function submit(event: FormEvent) {
    event.preventDefault();
    if (value.trim() === TEACHER_PIN) {
      setTeacherMode(true);
      setAskPin(false);
      setValue("");
      setWrong(false);
      return;
    }
    setWrong(true);
    window.setTimeout(() => setWrong(false), 900);
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => (on ? setTeacherMode(false) : setAskPin(true))}
        aria-label={label}
        title={label}
        aria-pressed={on}
        className={on ? "bg-gold text-gold-foreground hover:bg-gold/90" : undefined}
      >
        <GraduationCap />
      </Button>
      <Dialog
        open={askPin}
        onOpenChange={(open) => {
          if (!open) {
            setAskPin(false);
            setValue("");
            setWrong(false);
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] rounded-lg bg-card">
          <DialogHeader>
            <DialogTitle>🧑‍🏫 Teacher access</DialogTitle>
            <DialogDescription>
              Enter your tutor PIN to unlock every lesson and boss for testing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              placeholder="••••"
              aria-label="Teacher PIN"
              className={`h-11 text-center font-display text-2xl tracking-[0.4em] ${
                wrong ? "animate-shake" : ""
              }`}
            />
            {wrong && <p className="text-sm text-berry">That PIN isn't right. 💛</p>}
            <Button type="submit" className="w-full" disabled={!value.trim()}>
              Open teacher mode 🔓
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
