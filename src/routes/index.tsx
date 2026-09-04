import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
      { title: "Arsyad's English Quest — Course 2: Grammar & Reading" },
      {
        name: "description",
        content:
          "A playful English lesson companion for a 12-year-old A1 learner: vocabulary games, grammar focus, reading, role-play, stars and boss challenges.",
      },
      { property: "og:title", content: "Arsyad's English Quest — Course 2" },
      {
        property: "og:description",
        content:
          "Interactive A1-to-A2 English practice: vocabulary games, grammar focus, reading with read-aloud, role-play and boss challenges.",
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

  const lesson = LESSONS.find((l) => l.id === view?.lessonId);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      {album && <StickerAlbum onClose={() => setAlbum(false)} />}
      {!view || !lesson ? (
        <Home onOpenLesson={(id) => setView({ lessonId: id, screen: "vocabulary" })} onOpenAlbum={() => setAlbum(true)} />
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

function Home({ onOpenLesson, onOpenAlbum }: { onOpenLesson: (id: string) => void; onOpenAlbum: () => void }) {
  const { state, totalStars, level, wordsLearned } = useQuest();
  const nextLevelAt = Number.isFinite(level.max) ? level.max + 1 : null;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="font-display text-4xl font-extrabold sm:text-6xl">
          Arsyad's English <span className="text-gold">Quest</span>
        </h1>
        <p className="mt-2 font-display text-xl text-muted-foreground">Course 2 — Grammar &amp; Reading</p>
      </header>

      <section className="card-quest space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold">Star Dashboard</h2>
          <StarBar />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-secondary/70 p-4 text-center">
            <p className="font-display text-4xl font-extrabold text-gold">{totalStars}</p>
            <p className="text-sm text-muted-foreground">total stars</p>
          </div>
          <div className="rounded-2xl bg-secondary/70 p-4 text-center">
            <p className="font-display text-4xl font-extrabold">{level.emoji}</p>
            <p className="text-sm text-muted-foreground">
              Level {level.level} {level.name}
              {nextLevelAt ? ` · next at ${nextLevelAt} ⭐` : " · top level!"}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/70 p-4 text-center">
            <p className="font-display text-4xl font-extrabold">{state.stickers.length}</p>
            <p className="text-sm text-muted-foreground">stickers earned</p>
          </div>
        </div>
        <div className="space-y-2">
          {LESSONS.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/50 px-4 py-2">
              <span>
                {l.emoji} Lesson {l.number}: {l.title}
              </span>
              <span className="font-display font-bold text-gold">⭐ {state.starsByLesson[l.id] ?? 0}</span>
            </div>
          ))}
        </div>
        <button onClick={onOpenAlbum} className="btn-pop w-full bg-berry px-4 py-3 text-lg text-primary-foreground">
          My Stickers 🎟️
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold">Choose Your Lesson</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {LESSONS.map((l) => (
            <button
              key={l.id}
              onClick={() => onOpenLesson(l.id)}
              className="card-quest group p-6 text-left transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">{l.emoji}</span>
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
                    Lesson {l.number}
                  </p>
                  <p className="font-display text-2xl font-extrabold">{l.title}</p>
                  <p className="text-muted-foreground">{l.subtitle}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-secondary px-3 py-1">
                  Words learned: {wordsLearned(l.id)} / {l.vocabulary.length}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1">⭐ {state.starsByLesson[l.id] ?? 0}</span>
                {state.stickers.includes(l.id) && (
                  <span className="rounded-full bg-gold px-3 py-1 text-gold-foreground">
                    {l.sticker.emoji} {l.sticker.name}
                  </span>
                )}
              </div>
            </button>
          ))}
          <div className="card-quest flex items-center justify-center p-6 text-center opacity-50">
            <p className="font-display text-lg">More lessons coming soon 🔜</p>
          </div>
        </div>
      </section>
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onHome} className="btn-pop bg-secondary px-4 py-2 text-base text-secondary-foreground">
          ← Home
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <StarBar />
          <button onClick={onOpenAlbum} className="btn-pop bg-berry px-3 py-2 text-base text-primary-foreground">
            🎟️
          </button>
        </div>
      </div>

      <nav className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {SCREENS.map((s) => (
          <button
            key={s.id}
            onClick={() => onScreen(s.id)}
            className={`btn-pop flex flex-col items-center gap-1 px-2 py-3 text-xs ${
              screen === s.id ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <span className="text-2xl">{s.emoji}</span>
            {s.label}
            {isScreenDone(lesson.id, s.id) && <span className="text-[10px] text-grass">done ✓</span>}
          </button>
        ))}
        <button
          onClick={() => onScreen("boss")}
          className={`btn-pop flex flex-col items-center gap-1 px-2 py-3 text-xs ${
            screen === "boss" ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          <span className="text-2xl">{bossUnlocked(lesson.id) ? "🏆" : "🔒"}</span>
          Boss
        </button>
      </nav>

      {screen === "vocabulary" && <VocabularyScreen lesson={lesson} onComplete={() => done("vocabulary")} />}
      {screen === "grammar" && <GrammarScreen lesson={lesson} onComplete={() => done("grammar")} />}
      {screen === "learn" && <LearnScreen lesson={lesson} onComplete={() => done("learn")} />}
      {screen === "practice" && <PracticeScreen lesson={lesson} onComplete={() => done("practice")} />}
      {screen === "reading" && <ReadingScreen lesson={lesson} onComplete={() => done("reading")} />}
      {screen === "roleplay" && <RolePlayScreen lesson={lesson} onComplete={() => done("roleplay")} />}
      {screen === "progress" && <ProgressScreen lesson={lesson} onComplete={() => done("progress")} />}
      {screen === "boss" && <BossChallenge lesson={lesson} />}
    </div>
  );
}
