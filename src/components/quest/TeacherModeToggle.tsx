import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuest } from "@/lib/quest/store";

/**
 * Tutor-only switch: while on, every lesson's boss is unlocked so any part of
 * the course can be tested without playing through all six screens first.
 * The button lights up gold while teacher mode is active.
 */
export function TeacherModeToggle() {
  const { state, setTeacherMode } = useQuest();
  const on = state.teacherMode;
  const label = on
    ? "Turn teacher mode off (bosses lock again)"
    : "Turn teacher mode on (unlocks every boss)";
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setTeacherMode(!on)}
      aria-label={label}
      title={label}
      aria-pressed={on}
      className={on ? "bg-gold text-gold-foreground hover:bg-gold/90" : undefined}
    >
      <GraduationCap />
    </Button>
  );
}
