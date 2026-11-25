import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BOSS_REQUIRED,
  BOSS_WIN_BONUS,
  LEGACY_STORAGE_KEYS,
  type CourseLevel,
  STORAGE_KEY,
  WORD_MASTERY_TARGET,
  levelFor,
  type ScreenId,
} from "./config";
import { ALL_LESSONS, COURSES } from "./courses";
import { DEFAULT_STUDENT_NAME, normalizeStudentName } from "./profile";
import type { MusicTrack } from "./sfx";

export type AudioMode = "app" | "teacher" | "device";

/**
 * Which palette the app shows: "light" is the bright Play theme (the default
 * kids land in), "dark" is the deep-indigo Night room for evening tutoring.
 */
export type ThemeMode = "light" | "dark";

/** Best boss fight per lesson: fewest misses, then fewest hits needed. */
export type BossRecord = { hits: number; misses: number };

export type SelfCheckEntry = { date: string; lessonId: string; answers: number[] };

export type QuestState = {
  studentName: string;
  /** Which course the home screen shows: "a1" (first words) or "a2". */
  courseLevel: CourseLevel;
  starsByLesson: Record<string, number>;
  wordCounts: Record<string, number>;
  screensDone: Record<string, ScreenId[]>;
  bossDefeated: string[];
  stickers: string[];
  selfChecks: SelfCheckEntry[];
  audioMode: AudioMode;
  /** Chosen App Voice (""), or the voiceURI of a specific browser voice. Empty = auto. */
  voiceURI: string;
  /** Button tap sounds and little win chimes. */
  soundOn: boolean;
  /** Which background music loop plays ("off" = silence). */
  musicTrack: MusicTrack | "off";
  theme: ThemeMode;
  /** Tutor switch: when on, every boss is unlocked so any lesson can be tested instantly. */
  teacherMode: boolean;
  /** Lesson ids the student has PIN-unlocked. Lesson 1 is always open. */
  unlockedLessons: string[];
  /** Whether the first-run "what's your name?" popup has been shown. */
  namePrompted: boolean;
  bossBest: Record<string, BossRecord>;
  bossBonusAwarded: string[];
};

const emptyState: QuestState = {
  studentName: DEFAULT_STUDENT_NAME,
  courseLevel: "a2",
  starsByLesson: {},
  wordCounts: {},
  screensDone: {},
  bossDefeated: [],
  stickers: [],
  selfChecks: [],
  audioMode: "app",
  voiceURI: "",
  soundOn: true,
  musicTrack: "sunny",
  theme: "light",
  teacherMode: false,
  unlockedLessons: [],
  namePrompted: false,
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
    const courseLevel: CourseLevel = saved.courseLevel === "a1" ? "a1" : "a2";
    return {
      ...emptyState,
      ...saved,
      courseLevel,
      studentName: normalizeStudentName(saved.studentName),
    };
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
  /** True for lesson 1, teacher mode, or lessons the student has PIN-unlocked. */
  isLessonOpen: (lessonId: string) => boolean;
  unlockLesson: (lessonId: string) => void;
  /** Records the first-run name popup as done (optionally saving a new name). */
  completeNamePrompt: (name: string) => void;
  defeatBoss: (lessonId: string) => void;
  /** Records a won fight: best-record update + one-time star bonus. */
  finishBossFight: (lessonId: string, hits: number, misses: number) => void;
  unlockSticker: (lessonId: string) => void;
  saveSelfCheck: (lessonId: string, answers: number[]) => void;
  setAudioMode: (mode: AudioMode) => void;
  setVoiceURI: (uri: string) => void;
  setSoundOn: (on: boolean) => void;
  setMusicTrack: (track: MusicTrack | "off") => void;
  setTheme: (theme: ThemeMode) => void;
  setTeacherMode: (on: boolean) => void;
  /** Switches the home screen between the A1 and A2 courses. */
  setCourseLevel: (level: CourseLevel) => void;
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

  // Stars count only the selected course, so each course has its own level.
  const totalStars = useMemo(
    () =>
      COURSES[state.courseLevel].reduce((sum, l) => sum + (state.starsByLesson[l.id] ?? 0), 0),
    [state.courseLevel, state.starsByLesson],
  );

  const wordsLearned = useCallback(
    (lessonId: string) => {
      const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
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
        starsByLesson: {
          ...prev.starsByLesson,
          [lessonId]: (prev.starsByLesson[lessonId] ?? 0) + amount,
        },
      })),
    markWordCorrect: (lessonId, word) =>
      setState((prev) => {
        const key = `${lessonId}:${word}`;
        const next = {
          ...prev,
          wordCounts: { ...prev.wordCounts, [key]: (prev.wordCounts[key] ?? 0) + 1 },
        };
        const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
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
      // Teacher mode lifts the gate for every lesson — testing needs no play-through.
      if (state.teacherMode) return true;
      const done = state.screensDone[lessonId] ?? [];
      return BOSS_REQUIRED.every((s) => done.includes(s));
    },
    isLessonOpen: (lessonId) => {
      // Teacher mode opens everything; unit 1 is always free.
      if (state.teacherMode) return true;
      const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
      if (lesson && lesson.number === 1) return true;
      return state.unlockedLessons.includes(lessonId);
    },
    unlockLesson: (lessonId) =>
      setState((prev) =>
        prev.unlockedLessons.includes(lessonId)
          ? prev
          : { ...prev, unlockedLessons: [...prev.unlockedLessons, lessonId] },
      ),
    completeNamePrompt: (name) =>
      setState((prev) => ({
        ...prev,
        studentName: name.trim() ? normalizeStudentName(name) : prev.studentName,
        namePrompted: true,
      })),
    defeatBoss: (lessonId) =>
      setState((prev) => ({
        ...prev,
        bossDefeated: prev.bossDefeated.includes(lessonId)
          ? prev.bossDefeated
          : [...prev.bossDefeated, lessonId],
        stickers: prev.stickers.includes(lessonId) ? prev.stickers : [...prev.stickers, lessonId],
      })),
    finishBossFight: (lessonId, hits, misses) =>
      setState((prev) => {
        const best = prev.bossBest[lessonId];
        const better =
          !best || misses < best.misses || (misses === best.misses && hits < best.hits);
        const bonus = prev.bossBonusAwarded.includes(lessonId) ? 0 : BOSS_WIN_BONUS;
        return {
          ...prev,
          bossBest: better ? { ...prev.bossBest, [lessonId]: { hits, misses } } : prev.bossBest,
          bossBonusAwarded: bonus ? [...prev.bossBonusAwarded, lessonId] : prev.bossBonusAwarded,
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
          ...prev.selfChecks.filter(
            (e) => !(e.lessonId === lessonId && e.date === new Date().toISOString().slice(0, 10)),
          ),
          { lessonId, answers, date: new Date().toISOString().slice(0, 10) },
        ],
      })),
    setAudioMode: (mode) => setState((prev) => ({ ...prev, audioMode: mode })),
    setVoiceURI: (uri) => setState((prev) => ({ ...prev, voiceURI: uri })),
    setSoundOn: (on) => setState((prev) => ({ ...prev, soundOn: on })),
    setMusicTrack: (track) => setState((prev) => ({ ...prev, musicTrack: track })),
    setTheme: (theme) => setState((prev) => ({ ...prev, theme })),
    setTeacherMode: (on) => setState((prev) => ({ ...prev, teacherMode: on })),
    setCourseLevel: (level) => setState((prev) => ({ ...prev, courseLevel: level })),
    setStudentName: (name) =>
      setState((prev) => ({ ...prev, studentName: normalizeStudentName(name) })),
  };

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
}

export function useQuest() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used inside QuestProvider");
  return ctx;
}
