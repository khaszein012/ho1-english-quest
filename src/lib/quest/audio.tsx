import { useCallback, useState } from "react";
import { useQuest, type AudioMode } from "./store";

const A1_RATE = 0.8;

export function cancelSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, opts: { rate?: number; onEnd?: () => void } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts.onEnd?.();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = opts.rate ?? A1_RATE;
  utterance.pitch = 1.05;
  if (opts.onEnd) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      opts.onEnd?.();
    };
    utterance.onend = finish;
    // Chrome fires onerror (not onend) when speech is cancelled/interrupted.
    utterance.onerror = finish;
  }
  window.speechSynthesis.speak(utterance);
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
  const speak = useCallback(
    (text: string | string[]) => {
      if (!enabled) return;
      cancelSpeech();
      if (Array.isArray(text)) speakSequence(text);
      else speakText(text);
    },
    [enabled],
  );
  return { speak, enabled, mode: state.audioMode };
}

export function openTeacherWindow(title: string, lines: string[]) {
  const win = window.open("", "teacher-script", "width=760,height=760");
  if (!win) return;
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
  const { state, setAudioMode } = useQuest();
  const [testAnswer, setTestAnswer] = useState<"none" | "yes" | "no">("none");

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

      {state.audioMode === "app" && (
        <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm text-muted-foreground">
          Using a headset? Turn ON "Share sound" in Zoom, or switch to Teacher Reads mode.
        </p>
      )}
      {state.audioMode === "teacher" && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">App audio is off — the tutor reads aloud.</p>
          {scriptLines && scriptLines.length > 0 && (
            <button
              onClick={() => openTeacherWindow(scriptTitle ?? "Script", scriptLines)}
              className="btn-pop bg-berry px-3 py-2 text-sm text-primary-foreground"
            >
              Open tutor pop-out 🪟
            </button>
          )}
        </div>
      )}
      {state.audioMode === "device" && (
        <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm text-muted-foreground">
          Send Arsyad this page link so he plays the audio on his own device, then follow along together.
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
          <li>Send Arsyad the link so he plays audio on his own device.</li>
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
  const { speak, enabled } = useSpeak();
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
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
  );
}
