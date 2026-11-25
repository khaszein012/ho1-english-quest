import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StudentProfile } from "@/components/quest/StudentProfile";
import { PinDialog } from "@/components/quest/PinDialog";
import { ThemeToggle } from "@/components/quest/ThemeToggle";
import { TeacherModeToggle } from "@/components/quest/TeacherModeToggle";
import { LESSONS, SCREENS, type Lesson, type ScreenId } from "@/lib/quest/config";
import { COURSE_LABEL, lessonsFor, type CourseLevel } from "@/lib/quest/courses";
import { QuestProvider, useQuest } from "@/lib/quest/store";
import { VocabularyScreen } from "@/components/quest/VocabularyScreen";
import { GrammarScreen } from "@/components/quest/GrammarScreen";
import { LearnScreen } from "@/components/quest/LearnScreen";
import { PracticeScreen } from "@/components/quest/PracticeScreen";
import { ReadingScreen } from "@/components/quest/ReadingScreen";
import { RolePlayScreen } from "@/components/quest/RolePlayScreen";
import { ProgressScreen } from "@/components/quest/ProgressScreen";
import { BossChallenge } from "@/components/quest/BossChallenge";
import { StickerAlbum } from "@/components/quest/StickerAlbum";
import { cancelSpeech } from "@/lib/quest/audio";
import { playCardPop, setSfxEnabled, startMusic, stopMusic, playClick } from "@/lib/quest/sfx";
import { starBurst } from "@/lib/quest/fx";

/**
 * Bridges saved sound settings to the Web Audio engine and plays a soft click
 * on every button/link press. Renders nothing.
 */
function SoundManager() {
  const { state, ready } = useQuest();
  const soundOn = state.soundOn && state.audioMode !== "teacher";
  const track = soundOn && state.musicTrack !== "off" ? state.musicTrack : null;

  useEffect(() => {
    setSfxEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (!ready) return;
    if (track) startMusic(track);
    else stopMusic();
  }, [track, ready]);

  useEffect(() => {
    const onPress = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest("button, a, [role='button']") : null;
      if (!el || (el instanceof HTMLButtonElement && el.disabled)) return;
      // Elements can opt into their own sound with data-sfx (e.g. card flips).
      const kind = el.closest("[data-sfx]")?.getAttribute("data-sfx");
      if (kind === "card") playCardPop();
      else playClick();
    };
    document.addEventListener("pointerdown", onPress);
    return () => document.removeEventListener("pointerdown", onPress);
  }, []);

  return null;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "English Quest — A2: Grammar & Reading" },
      {
        name: "description",
        content:
          "A playful English lesson companion for a 10-year-old A2 learner: vocabulary games, grammar focus, reading, role-play, stars and boss challenges.",
      },
      { property: "og:title", content: "English Quest — A2" },
      {
        property: "og:description",
        content:
          "Interactive A2 English practice: vocabulary games, grammar focus, reading with read-aloud, role-play and boss challenges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <QuestProvider>
      <SoundManager />
      <QuestApp />
    </QuestProvider>
  ),
});

type View = { lessonId: string; screen: ScreenId | "boss" } | null;

function QuestApp() {
  const [view, setView] = useState<View>(null);
  const [album, setAlbum] = useState(false);
  const [draftName, setDraftName] = useState("");
  const { state, ready, completeNamePrompt } = useQuest();

  // The palette is a class on <html>; every CSS token switches with it.
  // :root is the bright Play theme, html.dark the deep-indigo Night room.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  const lesson = lessonsFor(state.courseLevel).find((l) => l.id === view?.lessonId);
  const showWelcome = ready && !state.namePrompted;

  return (
    <main className="quest-app">
      {/* First run on a new browser: ask for the explorer's name once. */}
      <Dialog
        open={showWelcome}
        onOpenChange={(open) => {
          if (!open) completeNamePrompt(state.studentName);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] rounded-lg bg-card">
          <DialogHeader>
            <DialogTitle>👋 Welcome to English Quest!</DialogTitle>
            <DialogDescription>What should we call you, explorer?</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              completeNamePrompt(draftName);
            }}
          >
            <Input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              maxLength={40}
              placeholder={state.studentName}
              aria-label="Student name"
              autoFocus
              className="h-11"
            />
            <Button type="submit" className="w-full">
              Let's go! ⚡
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {album && <StickerAlbum onClose={() => setAlbum(false)} />}
      {!view || !lesson ? (
        <Home
          onOpenLesson={(id) => setView({ lessonId: id, screen: "vocabulary" })}
          onOpenAlbum={() => setAlbum(true)}
        />
      ) : (
        <LessonView
          lesson={lesson}
          screen={view.screen}
          onScreen={(screen) => {
            cancelSpeech();
            setView({ lessonId: lesson.id, screen });
          }}
          onHome={() => {
            cancelSpeech();
            setView(null);
          }}
          onOpenAlbum={() => setAlbum(true)}
        />
      )}
    </main>
  );
}

function StarBar() {
  const { totalStars, level } = useQuest();
  return (
    <span className="rounded-full bg-gold px-4 py-2 font-display text-base font-extrabold text-gold-foreground">
      ⭐ {totalStars} · Lv{level.level} {level.name} {level.emoji}
    </span>
  );
}

/** A1 / A2 course switcher — each course keeps its own progress. */
function CourseLevelToggle() {
  const { state, setCourseLevel } = useQuest();
  return (
    <div
      className="flex rounded-full bg-secondary p-1"
      role="group"
      aria-label="Course level"
    >
      {(["a1", "a2"] as CourseLevel[]).map((level) => {
        const active = state.courseLevel === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => setCourseLevel(level)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 font-display text-sm font-extrabold transition-colors ${
              active ? "bg-gold text-gold-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {level.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function Home({
  onOpenLesson,
  onOpenAlbum,
}: {
  onOpenLesson: (id: string) => void;
  onOpenAlbum: () => void;
}) {
  const { state, totalStars, level, wordsLearned, isScreenDone, isLessonOpen, unlockLesson, setCourseLevel } =
    useQuest();
  const [pinLesson, setPinLesson] = useState<Lesson | null>(null);
  const lessons = lessonsFor(state.courseLevel);
  const nextLevelAt = Number.isFinite(level.max) ? level.max + 1 : null;
  const mastered = lessons.reduce((sum, lesson) => sum + wordsLearned(lesson.id), 0);
  return (
    <div className="quest-home">
      <header className="app-topbar">
        <div className="brand-lockup">
          <span className="brand-mark">
            <BookOpen />
          </span>
          <div>
            <p className="font-display font-bold">English Quest</p>
            <p className="text-xs text-muted-foreground">{COURSE_LABEL[state.courseLevel]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CourseLevelToggle />
          <StudentProfile />
          <TeacherModeToggle />
          <ThemeToggle />
        </div>
      </header>
      <section className="home-intro">
        <div>
          <p className="section-kicker">
            <Sparkles className="size-4" /> YOUR LEARNING JOURNEY
          </p>
          <h1>
            <span className="text-gold">{state.studentName}'s</span> English Quest
          </h1>
          <p className="text-muted-foreground">
            A little practice. A new discovery. Your next adventure.
          </p>
        </div>
        <StarBar />
      </section>
      <div className="home-workspace">
        <section className="lesson-collection">
          <div className="section-heading">
            <h2>Choose Your Lesson</h2>
            <span className="text-sm text-muted-foreground">{lessons.length} adventures</span>
          </div>
          <div className="lesson-grid">
            {lessons.map((lesson) => {
              const done = SCREENS.filter((screen) => isScreenDone(lesson.id, screen.id)).length;
              const open = isLessonOpen(lesson.id);
              return (
                <Button
                  key={lesson.id}
                  variant="ghost"
                  size="auto"
                  onClick={() => (open ? onOpenLesson(lesson.id) : setPinLesson(lesson))}
                  className="lesson-tile"
                >
                  <div className="flex w-full items-start justify-between">
                    <span className="lesson-illustration" aria-hidden="true">
                      {lesson.emoji}
                    </span>
                    {open ? (
                      <ArrowUpRight className="size-5 text-muted-foreground" />
                    ) : (
                      <span className="text-xl" aria-hidden="true">
                        🔒
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <p className="section-kicker">
                      LESSON {String(lesson.number).padStart(2, "0")}
                    </p>
                    <h3>{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.subtitle}</p>
                    {!open && (
                      <p className="text-xs font-bold text-muted-foreground">Enter PIN to unlock</p>
                    )}
                    {lesson.plannedMinutes !== undefined && (
                      <p className="text-xs font-semibold text-gold">
                        ⏱ {lesson.plannedMinutes}-minute session
                      </p>
                    )}
                  </div>
                  <div className="lesson-footer">
                    <span>
                      {wordsLearned(lesson.id)} / {lesson.vocabulary.length} words learned
                    </span>
                    <span className="font-bold text-gold">
                      ⭐ {state.starsByLesson[lesson.id] ?? 0}
                    </span>
                  </div>
                  <div
                    className="lesson-steps"
                    aria-label={`${done} of ${SCREENS.length} activities completed`}
                  >
                    {SCREENS.map((screen) => (
                      <span
                        key={screen.id}
                        className={isScreenDone(lesson.id, screen.id) ? "bg-gold" : "bg-secondary"}
                      />
                    ))}
                  </div>
                  {state.stickers.includes(lesson.id) && (
                    <span className="text-xs text-gold">
                      {lesson.sticker.emoji} {lesson.sticker.name}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </section>
        <aside className="home-progress">
          <div className="section-heading">
            <h2>Star Dashboard</h2>
            <span aria-hidden="true">✦</span>
          </div>
          <div className="dashboard-total">
            <span className="text-gold">{totalStars}</span>
            <span className="text-muted-foreground">total stars</span>
          </div>
          <div className="dashboard-level">
            <span className="text-3xl">{level.emoji}</span>
            <div>
              <p className="font-bold">
                Level {level.level} · {level.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {nextLevelAt ? `Next level at ${nextLevelAt} stars` : "Top level!"}
              </p>
            </div>
          </div>
          <div className="dashboard-stats">
            <div>
              <strong>{mastered}</strong>
              <span>words mastered</span>
            </div>
            <div>
              <strong>{state.stickers.filter((id) => lessons.some((l) => l.id === id)).length}</strong>
              <span>stickers earned</span>
            </div>
          </div>
          <div className="dashboard-lessons">
            {lessons.map((lesson) => (
              <div key={lesson.id}>
                <span className="min-w-0">
                  {lesson.emoji} {lesson.title}
                </span>
                <span className="shrink-0 text-gold">⭐ {state.starsByLesson[lesson.id] ?? 0}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="auto" className="w-full py-3" onClick={onOpenAlbum}>
            <Ticket /> My Stickers
          </Button>
        </aside>
      </div>
      {pinLesson && (
        <PinDialog
          lesson={pinLesson}
          onUnlocked={(lessonId) => {
            unlockLesson(lessonId);
            starBurst();
            onOpenLesson(lessonId);
          }}
          onClose={() => setPinLesson(null)}
        />
      )}
    </div>
  );
}

function LessonView({
  lesson,
  screen,
  onScreen,
  onHome,
  onOpenAlbum,
}: {
  lesson: Lesson;
  screen: ScreenId | "boss";
  onScreen: (screen: ScreenId | "boss") => void;
  onHome: () => void;
  onOpenAlbum: () => void;
}) {
  const { completeScreen, isScreenDone, bossUnlocked } = useQuest();
  const done = (id: ScreenId) => completeScreen(lesson.id, id);

  return (
    <div className="lesson-shell">
      <header className="app-topbar">
        <Button variant="ghost" size="auto" onClick={onHome} className="gap-2 px-0">
          <ArrowLeft /> Home
        </Button>
        <div className="lesson-context">
          <span className="text-gold">Lesson {lesson.number}</span>
          <span>{lesson.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <StudentProfile />
          <Button
            variant="secondary"
            size="icon"
            onClick={onOpenAlbum}
            aria-label="My Stickers"
            title="My Stickers"
          >
            <Ticket />
          </Button>
          <TeacherModeToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="lesson-workspace">
        <aside className="lesson-sidebar">
          <p className="section-kicker">YOUR QUEST</p>
          <nav className="quest-nav" aria-label="Lesson activities">
            {SCREENS.map((s) => (
              <Button
                key={s.id}
                variant="ghost"
                size="auto"
                onClick={() => onScreen(s.id)}
                aria-current={screen === s.id ? "page" : undefined}
                className={`quest-nav-item ${screen === s.id ? "is-active" : ""}`}
              >
                <span className="nav-emoji" aria-hidden="true">
                  {s.emoji}
                </span>
                <span>{s.label}</span>
                {isScreenDone(lesson.id, s.id) && <span className="nav-done text-grass">✓</span>}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="auto"
              onClick={() => onScreen("boss")}
              aria-current={screen === "boss" ? "page" : undefined}
              className={`quest-nav-item ${screen === "boss" ? "is-active" : ""}`}
            >
              <span className="nav-emoji">{bossUnlocked(lesson.id) ? "🏆" : "🔒"}</span>
              <span>Boss</span>
            </Button>
          </nav>
          <div className="sidebar-stars">
            <StarBar />
            {lesson.sessionPlan && lesson.sessionPlan.length > 0 && (
              <div className="mt-3 rounded-2xl bg-card p-3">
                <p className="section-kicker">
                  ⏱ SESSION PLAN · {lesson.plannedMinutes ?? "—"} MIN
                </p>
                <ul className="mt-2 space-y-1">
                  {lesson.sessionPlan.map((block) => (
                    <li
                      key={block.label}
                      className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
                    >
                      <span className="min-w-0">{block.label}</span>
                      <span className="shrink-0 font-bold text-gold">{block.minutes}′</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
        <section key={`${lesson.id}-${screen}`} className={`quest-content screen-${screen}`}>
          {screen === "vocabulary" && (
            <VocabularyScreen lesson={lesson} onComplete={() => done("vocabulary")} />
          )}
          {screen === "grammar" && (
            <GrammarScreen lesson={lesson} onComplete={() => done("grammar")} />
          )}
          {screen === "learn" && <LearnScreen lesson={lesson} onComplete={() => done("learn")} />}
          {screen === "practice" && (
            <PracticeScreen lesson={lesson} onComplete={() => done("practice")} />
          )}
          {screen === "reading" && (
            <ReadingScreen lesson={lesson} onComplete={() => done("reading")} />
          )}
          {screen === "roleplay" && (
            <RolePlayScreen lesson={lesson} onComplete={() => done("roleplay")} />
          )}
          {screen === "progress" && (
            <ProgressScreen lesson={lesson} onComplete={() => done("progress")} />
          )}
          {screen === "boss" && <BossChallenge lesson={lesson} />}
        </section>
      </div>
    </div>
  );
}
