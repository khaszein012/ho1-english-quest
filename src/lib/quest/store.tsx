import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { BOSS_REQUIRED, BOSS_WIN_BONUS, LEGACY_STORAGE_KEYS, LESSONS, STORAGE_KEY, WORD_MASTERY_TARGET, levelFor, type ScreenId } from "./config";
import { DEFAULT_STUDENT_NAME, normalizeStudentName } from "./profile";

export type AudioMode = "app" | "teacher" | "device";

/** Best boss fight per lesson: fewest misses, then fewest hits needed. */
export type BossRecord = { hits: number; misses: number };

export type SelfCheckEntry = { date: string; lessonId: string; answers: number[] };

export type QuestState = {
  studentName: string;
  starsByLesson: Record<string, number>;
  wordCounts: Record<string, number>;
  screensDone: Record<string, ScreenId[]>;
  bossDefeated: string[];
  stickers: string[];
  selfChecks: SelfCheckEntry[];
  audioMode: AudioMode;
  bossBest: Record<string, BossRecord>;
  bossBonusAwarded: string[];
};

const emptyState: QuestState = {
  studentName: DEFAULT_STUDENT_NAME,
  starsByLesson: {},
  wordCounts: {},
  screensDone: {},
  bossDefeated: [],
  stickers: [],
  selfChecks: [],
  audioMode: "app",
  bossBest: {},
  bossBonusAwarded: [],
};

function load(): QuestState {
  if (typeof window === "undefined") return emptyState;
  try {
    let raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // One-time migration from the old un-prefixed key, then clean it up.
      for (const legacy of LEGACY_STORAGE_KEYS) {
        const old = window.localStorage.getItem(legacy);
        if (old) {
          raw = old;
          window.localStorage.setItem(STORAGE_KEY, old);
          window.localStorage.removeItem(legacy);
          break;
        }
      }
    }
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as unknown;
    // Only accept our own shape — never trust a stray key from another app.
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return emptyState;
    const saved = parsed as Partial<QuestState>;
    return { ...emptyState, ...saved, studentName: normalizeStudentName(saved.studentName) };
  } catch {
    return emptyState;
  }
}

type QuestContextValue = {
  state: QuestState;
  ready: boolean;
  totalStars: number;
  level: ReturnType<typeof levelFor>;
  addStars: (lessonId: string, amount?: number) => void;
  markWordCorrect: (lessonId: string, word: string) => void;
  wordsLearned: (lessonId: string) => number;
  completeScreen: (lessonId: string, screen: ScreenId) => void;
  isScreenDone: (lessonId: string, screen: ScreenId) => boolean;
  bossUnlocked: (lessonId: string) => boolean;
  defeatBoss: (lessonId: string) => void;
  /** Records a won fight: best-record update + one-time star bonus. */
  finishBossFight: (lessonId: string, hits: number, misses: number) => void;
  unlockSticker: (lessonId: string) => void;
  saveSelfCheck: (lessonId: string, answers: number[]) => void;
  setAudioMode: (mode: AudioMode) => void;
  setStudentName: (name: string) => void;
};

const QuestContext = createContext<QuestContextValue | null>(null);

export function QuestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuestState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — progress just won't persist */
    }
  }, [state, ready]);

  const totalStars = useMemo(
    () => Object.values(state.starsByLesson).reduce((sum, n) => sum + n, 0),
    [state.starsByLesson],
  );

  const wordsLearned = useCallback(
    (lessonId: string) => {
      const lesson = LESSONS.find((l) => l.id === lessonId);
      if (!lesson) return 0;
      return lesson.vocabulary.filter(
        (w) => (state.wordCounts[`${lessonId}:${w.word}`] ?? 0) >= WORD_MASTERY_TARGET,
      ).length;
    },
    [state.wordCounts],
  );

  const unlockSticker = useCallback((lessonId: string) => {
    setState((prev) =>
      prev.stickers.includes(lessonId) ? prev : { ...prev, stickers: [...prev.stickers, lessonId] },
    );
  }, []);

  const value: QuestContextValue = {
    state,
    ready,
    totalStars,
    level: levelFor(totalStars),
    addStars: (lessonId, amount = 1) =>
      setState((prev) => ({
        ...prev,
        starsByLesson: { ...prev.starsByLesson, [lessonId]: (prev.starsByLesson[lessonId] ?? 0) + amount },
      })),
    markWordCorrect: (lessonId, word) =>
      setState((prev) => {
        const key = `${lessonId}:${word}`;
        const next = { ...prev, wordCounts: { ...prev.wordCounts, [key]: (prev.wordCounts[key] ?? 0) + 1 } };
        const lesson = LESSONS.find((l) => l.id === lessonId);
        if (lesson) {
          const learned = lesson.vocabulary.filter(
            (w) => (next.wordCounts[`${lessonId}:${w.word}`] ?? 0) >= WORD_MASTERY_TARGET,
          ).length;
          if (learned === lesson.vocabulary.length && !next.stickers.includes(lessonId)) {
            next.stickers = [...next.stickers, lessonId];
          }
        }
        return next;
      }),
    wordsLearned,
    completeScreen: (lessonId, screen) =>
      setState((prev) => {
        const done = prev.screensDone[lessonId] ?? [];
        if (done.includes(screen)) return prev;
        return { ...prev, screensDone: { ...prev.screensDone, [lessonId]: [...done, screen] } };
      }),
    isScreenDone: (lessonId, screen) => (state.screensDone[lessonId] ?? []).includes(screen),
    bossUnlocked: (lessonId) => {
      const done = state.screensDone[lessonId] ?? [];
      return BOSS_REQUIRED.every((s) => done.includes(s));
    },
    defeatBoss: (lessonId) =>
      setState((prev) => ({
        ...prev,
        bossDefeated: prev.bossDefeated.includes(lessonId) ? prev.bossDefeated : [...prev.bossDefeated, lessonId],
        stickers: prev.stickers.includes(lessonId) ? prev.stickers : [...prev.stickers, lessonId],
      })),
    finishBossFight: (lessonId, hits, misses) =>
      setState((prev) => {
        const best = prev.bossBest[lessonId];
        const better = !best || misses < best.misses || (misses === best.misses && hits < best.hits);
        const bonus = prev.bossBonusAwarded.includes(lessonId) ? 0 : BOSS_WIN_BONUS;
        return {
          ...prev,
          bossBest: better ? { ...prev.bossBest, [lessonId]: { hits, misses } } : prev.bossBest,
          bossBonusAwarded: bonus
            ? [...prev.bossBonusAwarded, lessonId]
            : prev.bossBonusAwarded,
          starsByLesson: bonus
            ? { ...prev.starsByLesson, [lessonId]: (prev.starsByLesson[lessonId] ?? 0) + bonus }
            : prev.starsByLesson,
        };
      }),
    unlockSticker,
    saveSelfCheck: (lessonId, answers) =>
      setState((prev) => ({
        ...prev,
        selfChecks: [
          ...prev.selfChecks.filter((e) => !(e.lessonId === lessonId && e.date === new Date().toISOString().slice(0, 10))),
          { lessonId, answers, date: new Date().toISOString().slice(0, 10) },
        ],
      })),
    setAudioMode: (mode) => setState((prev) => ({ ...prev, audioMode: mode })),
    setStudentName: (name) => setState((prev) => ({ ...prev, studentName: normalizeStudentName(name) })),
  };

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
}

export function useQuest() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used inside QuestProvider");
  return ctx;
}
