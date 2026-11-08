import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentProfile } from "@/components/quest/StudentProfile";
import { ThemeToggle } from "@/components/quest/ThemeToggle";
import { TeacherModeToggle } from "@/components/quest/TeacherModeToggle";
import { LESSONS, SCREENS, type Lesson, type ScreenId } from "@/lib/quest/config";
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
      <QuestApp />
    </QuestProvider>
  ),
});

type View = { lessonId: string; screen: ScreenId | "boss" } | null;

function QuestApp() {
  const [view, setView] = useState<View>(null);
  const [album, setAlbum] = useState(false);
  const { state } = useQuest();

  // The palette is a class on <html>; every CSS token switches with it.
  // :root is the bright Play theme, html.dark the deep-indigo Night room.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  const lesson = LESSONS.find((l) => l.id === view?.lessonId);

  return (
    <main className="quest-app">
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

function Home({
  onOpenLesson,
  onOpenAlbum,
}: {
  onOpenLesson: (id: string) => void;
  onOpenAlbum: () => void;
}) {
  const { state, totalStars, level, wordsLearned, isScreenDone } = useQuest();
  const nextLevelAt = Number.isFinite(level.max) ? level.max + 1 : null;
  const mastered = LESSONS.reduce((sum, lesson) => sum + wordsLearned(lesson.id), 0);
  return (
    <div className="quest-home">
      <header className="app-topbar">
        <div className="brand-lockup">
          <span className="brand-mark">
            <BookOpen />
          </span>
          <div>
            <p className="font-display font-bold">English Quest</p>
            <p className="text-xs text-muted-foreground">LEVEL A2 · GRAMMAR & READING</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            <span className="text-sm text-muted-foreground">{LESSONS.length} adventures</span>
          </div>
          <div className="lesson-grid">
            {LESSONS.map((lesson) => {
              const done = SCREENS.filter((screen) => isScreenDone(lesson.id, screen.id)).length;
              return (
                <Button
                  key={lesson.id}
                  variant="ghost"
                  size="auto"
                  onClick={() => onOpenLesson(lesson.id)}
                  className="lesson-tile"
                >
                  <div className="flex w-full items-start justify-between">
                    <span className="lesson-illustration" aria-hidden="true">
                      {lesson.emoji}
                    </span>
                    <ArrowUpRight className="size-5 text-muted-foreground" />
                  </div>
                  <div className="w-full">
                    <p className="section-kicker">
                      LESSON {String(lesson.number).padStart(2, "0")}
                    </p>
                    <h3>{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.subtitle}</p>
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
              <strong>{state.stickers.length}</strong>
              <span>stickers earned</span>
            </div>
          </div>
          <div className="dashboard-lessons">
            {LESSONS.map((lesson) => (
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
