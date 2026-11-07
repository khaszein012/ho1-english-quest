import { useState } from "react";
import { Pencil, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuest } from "@/lib/quest/store";

export function StudentProfile() {
  const { state, setStudentName } = useQuest();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(state.studentName);

  return (
    <>
      <Button
        variant="ghost"
        size="auto"
        className="student-profile"
        aria-label="Edit student name"
        title="Edit student name"
        onClick={() => { setDraft(state.studentName); setOpen(true); }}
      >
        <span className="profile-avatar"><UserRound aria-hidden="true" /></span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-xs font-semibold text-muted-foreground">Student</span>
          <span className="block truncate font-bold">{state.studentName}</span>
        </span>
        <Pencil className="shrink-0 text-muted-foreground" aria-hidden="true" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] rounded-lg bg-card">
          <DialogHeader>
            <DialogTitle>Student name</DialogTitle>
            <DialogDescription>Same quest, same stars. Make it yours.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(event) => {
            event.preventDefault();
            if (!draft.trim()) return;
            setStudentName(draft);
            setOpen(false);
          }}>
            <label htmlFor="student-name" className="block text-sm font-semibold">Name</label>
            <Input id="student-name" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={40} autoComplete="given-name" autoFocus required className="h-11" />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!draft.trim()}>Save name</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}