import { useCallback, useEffect, useState } from "react";
import { useQuest, type AudioMode } from "./store";
import { duckMusic } from "./sfx";

/** Slightly brisker than the A1 course — A2 learners follow a little more speech. */
const LEARNER_RATE = 0.85;

/* ---------------------------------------------------------------------------
   Shared browser text-to-speech engine.

   Chrome quirks this handles:
   - getVoices() is empty on the first call and only fills after "voiceschanged",
     so we cache voices when they arrive and NEVER block playback waiting for
     them (no voice set => the browser uses its own default).
   - speechSynthesis silently stalls after idle time, so we cancel() before every
     utterance and nudge resume() with a watchdog if nothing starts/ends.
   - Speech needs a user gesture, so the first tap anywhere "unlocks" the engine.
--------------------------------------------------------------------------- */

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && !!window.speechSynthesis;
}

let voices: SpeechSynthesisVoice[] = [];
let engineReady = false;
const errorListeners = new Set<() => void>();

function reportSpeechError() {
  errorListeners.forEach((l) => l());
}

/** Subscribe to "the browser hiccuped" events so a button can offer a retry. */
export function onSpeechError(listener: () => void) {
  errorListeners.add(listener);
  return () => errorListeners.delete(listener);
}

function refreshVoices() {
  if (!speechSupported()) return;
  const list = window.speechSynthesis.getVoices();
  if (list && list.length) voices = list;
}

export function initSpeech() {
  if (!speechSupported() || engineReady) return;
  engineReady = true;
  refreshVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
  // First real gesture unlocks Chrome's audio pipeline with a silent utterance.
  const unlock = () => {
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore — playback still works from the button itself */
    }
    refreshVoices();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

/** The tutor's chosen voice ("" = auto). Synced from quest state by useSpeak/AudioModePanel. */
let preferredVoiceURI = "";

export function setPreferredVoice(uri: string) {
  preferredVoiceURI = uri;
}

function pickVoice() {
  if (!voices.length) return undefined; // browser default — never block on this
  if (preferredVoiceURI) {
    const chosen = voices.find((v) => v.voiceURI === preferredVoiceURI);
    // A saved voice can be missing on another device — fall through to auto.
    if (chosen) return chosen;
  }
  return (
    voices.find((v) => v.lang === "en-US" && v.localService) ??
    voices.find((v) => v.lang === "en-US") ??
    voices.find((v) => v.lang?.startsWith("en")) ??
    undefined
  );
}

/**
 * English voices for the picker, updated live — Chrome fills getVoices()
 * asynchronously after "voiceschanged", so the list starts empty and populates.
 */
export function useEnglishVoices() {
  const [list, setList] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!speechSupported()) return;
    const update = () => {
      const all = window.speechSynthesis.getVoices();
      setList(
        [...all]
          .filter((v) => v.lang?.toLowerCase().startsWith("en"))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
    };
    update();
    window.speechSynthesis.addEventListener?.("voiceschanged", update);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", update);
    };
  }, []);
  return list;
}

export function cancelSpeech() {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, opts: { rate?: number; onEnd?: () => void } = {}) {
  if (!speechSupported()) {
    opts.onEnd?.();
    return;
  }
  initSpeech();
  refreshVoices();
  const synth = window.speechSynthesis;
  // Clear any stuck queue first — Chrome otherwise ignores new utterances.
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = opts.rate ?? LEARNER_RATE;
  utterance.pitch = 1.05;

  let done = false;
  let watchdog = 0;
  let retried = false;
  // Read-aloud gets the spotlight: quiet the background music, restore after.
  duckMusic(true);
  const finish = () => {
    if (done) return;
    done = true;
    duckMusic(false);
    window.clearTimeout(watchdog);
    opts.onEnd?.();
  };
  utterance.onend = finish;
  utterance.onerror = (e) => {
    // "interrupted"/"canceled" are normal when the user stops or restarts audio.
    const reason = (e as SpeechSynthesisErrorEvent).error;
    if (reason && reason !== "interrupted" && reason !== "canceled") reportSpeechError();
    finish();
  };

  const arm = () => {
    watchdog = window.setTimeout(() => {
      if (done) return;
      // Chrome's known stall: nudge, then retry the utterance once.
      synth.resume();
      if (!retried) {
        retried = true;
        try {
          synth.speak(utterance);
        } catch {
          reportSpeechError();
          finish();
          return;
        }
        arm();
        return;
      }
      reportSpeechError();
      finish();
    }, 15000);
  };

  try {
    synth.resume();
    synth.speak(utterance);
    arm();
  } catch {
    reportSpeechError();
    finish();
  }
}

export function speakSequence(parts: string[], onDone?: () => void) {
  const [first, ...rest] = parts;
  if (!first) {
    onDone?.();
    return;
  }
  speakText(first, {
    onEnd: () => {
      window.setTimeout(() => speakSequence(rest, onDone), 550);
    },
  });
}

/** Speech that respects the selected audio mode (silent in Teacher Reads mode). */
export function useSpeak() {
  const { state } = useQuest();
  const enabled = state.audioMode === "app";
  useEffect(() => {
    initSpeech();
  }, []);
  // Keep the engine's preferred voice in sync with the saved choice.
  useEffect(() => {
    setPreferredVoice(state.voiceURI);
  }, [state.voiceURI]);
  const speak = useCallback(
    (text: string | string[]) => {
      if (!enabled) return;
      cancelSpeech();
      if (Array.isArray(text)) speakSequence(text);
      else speakText(text);
    },
    [enabled],
  );
  return { speak, enabled, mode: state.audioMode, supported: speechSupported() };
}

export function openTeacherWindow(title: string, lines: string[]) {
  const win = window.open("", "teacher-script", "width=760,height=760");
  if (!win) return false;

  win.document.write(`<!doctype html><html><head><title>Teacher script — ${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body{margin:0;padding:28px;font-family:system-ui,sans-serif;background:#fffdf5;color:#20204a;}
    .warn{background:#ffe0e0;border:2px solid #e06666;border-radius:14px;padding:12px 16px;font-weight:700;margin-bottom:20px;}
    h1{font-size:26px;margin:0 0 16px;}
    p{font-size:26px;line-height:1.7;margin:0 0 20px;}
  </style></head><body>
  <div class="warn">⚠️ Do not share this window on Zoom.</div>
  <h1>${title}</h1>
  ${lines.map((l) => `<p>${l}</p>`).join("")}
  </body></html>`);
  win.document.close();
  win.focus();
  return true;
}

const MODES: { id: AudioMode; label: string }[] = [
  { id: "app", label: "App Voice 🔊" },
  { id: "teacher", label: "Teacher Reads 🗣️" },
  { id: "device", label: "Student's Device 📱" },
];

export function AudioModePanel({
  scriptTitle,
  scriptLines,
}: {
  scriptTitle?: string;
  scriptLines?: string[];
}) {
  const { state, setAudioMode, setVoiceURI, setSoundOn, setMusicTrack } = useQuest();
  const [testAnswer, setTestAnswer] = useState<"none" | "yes" | "no">("none");
  const [popupBlocked, setPopupBlocked] = useState(false);
  const englishVoices = useEnglishVoices();
  // Test Sound speaks directly, so the engine needs the saved choice synced here too.
  useEffect(() => {
    setPreferredVoice(state.voiceURI);
  }, [state.voiceURI]);

  return (
    <div className="card-quest p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Audio mode
        </span>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setAudioMode(m.id)}
            className={`btn-pop px-3 py-2 text-sm ${
              state.audioMode === m.id
                ? "bg-gold text-gold-foreground"
                : "bg-secondary text-secondary-foreground hover:brightness-110"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        <button
          onClick={() => setSoundOn(!state.soundOn)}
          aria-pressed={state.soundOn}
          className={`btn-pop px-3 py-2 text-sm ${
            state.soundOn
              ? "bg-gold text-gold-foreground"
              : "bg-secondary text-secondary-foreground hover:brightness-110"
          }`}
        >
          {state.soundOn ? "🔊 Sounds On" : "🔇 Sounds Off"}
        </button>
        <select
          value={state.musicTrack}
          onChange={(e) => setMusicTrack(e.target.value as typeof state.musicTrack)}
          className="btn-pop bg-secondary px-3 py-2 text-sm text-secondary-foreground"
          aria-label="Background music"
        >
          <option value="off">🎵 Music: Off</option>
          <option value="sunny">🎵 Music: Sunny Morning</option>
          <option value="night">🎵 Music: Night Sky</option>
        </select>
        <span className="text-xs text-muted-foreground">Plays after your first tap (browser rule).</span>
      </div>

      {state.audioMode === "app" && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label htmlFor="app-voice" className="text-sm font-bold">
              Voice
            </label>
            <select
              id="app-voice"
              value={
                state.voiceURI && englishVoices.some((v) => v.voiceURI === state.voiceURI)
                  ? state.voiceURI
                  : ""
              }
              onChange={(e) => setVoiceURI(e.target.value)}
              className="btn-pop max-w-full bg-secondary px-3 py-2 text-sm text-secondary-foreground"
              aria-label="App voice"
            >
              <option value="">Auto (recommended)</option>
              {englishVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}){v.localService ? "" : " ☁"}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">
              Pick a voice, then tap Test Sound.
            </span>
          </div>
          <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm text-muted-foreground">
            Using a headset? Turn ON "Share sound" in Zoom, or switch to Teacher Reads mode.
          </p>
        </>
      )}
      {state.audioMode === "teacher" && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">App audio is off — the tutor reads aloud.</p>
          {scriptLines && scriptLines.length > 0 && (
            <button
              onClick={() =>
                setPopupBlocked(!openTeacherWindow(scriptTitle ?? "Script", scriptLines))
              }
              className="btn-pop bg-berry px-3 py-2 text-sm text-primary-foreground"
            >
              Open tutor pop-out 🪟
            </button>
          )}
          {popupBlocked && (
            <p className="text-sm text-berry">
              Your browser blocked the pop-up — allow pop-ups for this page, then tap again.
            </p>
          )}
        </div>
      )}

      {state.audioMode === "device" && (
        <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm text-muted-foreground">
          Send {state.studentName} this page link to play the audio on their own device, then follow
          along together.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setTestAnswer("none");
            cancelSpeech();
            speakText("Hello! Can you hear me clearly?");
          }}
          className="btn-pop bg-sky px-3 py-2 text-sm text-gold-foreground"
        >
          🔊 Test Sound
        </button>
        <button
          onClick={() => setTestAnswer("yes")}
          className="btn-pop bg-grass px-3 py-2 text-sm text-gold-foreground"
        >
          Yes ✅
        </button>
        <button
          onClick={() => setTestAnswer("no")}
          className="btn-pop bg-secondary px-3 py-2 text-sm text-secondary-foreground"
        >
          No ❌
        </button>
      </div>
      {testAnswer === "yes" && <p className="mt-2 text-sm text-grass">Great! You're all set. 🎉</p>}
      {testAnswer === "no" && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Re-share your screen with "Share sound" ticked.</li>
          <li>Switch to Teacher Reads mode and read aloud yourself.</li>
          <li>Send {state.studentName} the link to play audio on their own device.</li>
        </ul>
      )}
    </div>
  );
}

export function SpeakerButton({
  text,
  label = "Listen",
  className = "",
}: {
  text: string | string[];
  label?: string;
  className?: string;
}) {
  const { speak, enabled, supported } = useSpeak();
  const [hiccup, setHiccup] = useState(false);
  useEffect(() => {
    const off = onSpeechError(() => setHiccup(true));
    return () => {
      off();
    };
  }, []);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setHiccup(false);
          speak(text);
        }}
        aria-label={`${label}: ${Array.isArray(text) ? text.join(" ") : text}`}
        title={enabled ? label : "App audio is off in this mode"}
        className={`btn-pop bg-gold px-3 py-2 text-sm text-gold-foreground ${
          enabled ? "" : "opacity-50"
        } ${className}`}
      >
        🔊
      </button>
      {!supported && (
        <span className="text-xs text-muted-foreground">
          Audio isn't available in this browser — ask your teacher to read it aloud!
        </span>
      )}
      {supported && hiccup && (
        <span className="text-xs text-berry">Audio hiccup — tap again 🔁</span>
      )}
    </span>
  );
}
