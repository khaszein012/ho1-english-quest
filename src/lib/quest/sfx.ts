/* ---------------------------------------------------------------------------
   Synthesized sound effects + background music (Web Audio, no audio files).

   Browsers only allow audio after a user gesture, so everything here waits for
   the first tap: the context is created (or resumed) lazily inside play calls,
   which always run from a pointerdown/click handler.
--------------------------------------------------------------------------- */

export type MusicTrack = "sunny" | "night";

let ctx: AudioContext | undefined;
let master: GainNode | undefined;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** One synthesized tone with a fast exponential decay (the whole "instrument"). */
function tone(
  ac: AudioContext,
  dest: AudioNode,
  freq: number,
  start: number,
  duration: number,
  peak: number,
  type: OscillatorType = "triangle",
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(dest);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/* ------------------------------- effects --------------------------------- */

let sfxEnabled = true;

export function setSfxEnabled(on: boolean) {
  sfxEnabled = on;
}

/** Short soft "pop" for button presses. */
export function playClick() {
  if (!sfxEnabled) return;
  const ac = audio();
  if (!ac || !master) return;
  tone(ac, master, 620, ac.currentTime, 0.09, 0.12, "sine");
  tone(ac, master, 1240, ac.currentTime, 0.05, 0.04, "sine");
}

/**
 * Bouncy cartoon "boing" for word-card flips — a pitch slide up with a
 * bubbly plink on top. Playful, but still soft enough for a classroom.
 */
export function playCardPop() {
  if (!sfxEnabled) return;
  const ac = audio();
  if (!ac || !master) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.16);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + 0.28);
  tone(ac, master, 1560, t + 0.1, 0.12, 0.05, "triangle");
}

/** Rising two-note ding for a correct answer / earned star. */
export function playCorrect() {
  if (!sfxEnabled) return;
  const ac = audio();
  if (!ac || !master) return;
  const t = ac.currentTime;
  tone(ac, master, 784, t, 0.14, 0.1);
  tone(ac, master, 1175, t + 0.1, 0.2, 0.1);
}

/** Gentle low buzz for a miss — encouraging, never harsh. */
export function playWrong() {
  if (!sfxEnabled) return;
  const ac = audio();
  if (!ac || !master) return;
  tone(ac, master, 220, ac.currentTime, 0.22, 0.07, "sawtooth");
}

/** Little fanfare for finishing a screen or beating a boss. */
export function playFanfare() {
  if (!sfxEnabled) return;
  const ac = audio();
  if (!ac || !master) return;
  const t = ac.currentTime;
  const out = master;
  [523, 659, 784, 1047].forEach((f, i) => tone(ac, out, f, t + i * 0.11, 0.24, 0.1));
}

/* ------------------------------ music loop -------------------------------- */

type NoteEvent = { beat: number; freq: number; dur: number; peak: number; type: OscillatorType };
type TrackDef = { bpm: number; bars: NoteEvent[][]; beatsPerBar: number };

const N = (beat: number, freq: number, dur = 0.45, peak = 0.05, type: OscillatorType = "triangle"): NoteEvent => ({
  beat,
  freq,
  dur,
  peak,
  type,
});

// "Sunny Morning" — bright C-major plucked arpeggios (classroom friendly).
const SUNNY: TrackDef = {
  bpm: 108,
  beatsPerBar: 8,
  bars: [
    [N(0, 262), N(1, 330), N(2, 392), N(3, 523, 0.6, 0.055), N(4, 392), N(5, 330), N(6, 262), N(7, 196, 0.9, 0.045, "sine"),
      N(0, 131, 1.4, 0.06, "sine"), N(4, 175, 1.4, 0.05, "sine")],
    [N(0, 349), N(1, 440), N(2, 523), N(3, 587, 0.6, 0.055), N(4, 523), N(5, 440), N(6, 349), N(7, 262, 0.9, 0.045, "sine"),
      N(0, 175, 1.4, 0.06, "sine"), N(4, 220, 1.4, 0.05, "sine")],
    [N(0, 392), N(1, 494), N(2, 587), N(3, 494), N(4, 392), N(5, 494), N(6, 587), N(7, 784, 0.9, 0.05),
      N(0, 196, 1.4, 0.06, "sine"), N(4, 165, 1.4, 0.05, "sine")],
    [N(0, 330), N(1, 415), N(2, 494), N(3, 415), N(4, 330), N(5, 415), N(6, 494), N(7, 659, 0.9, 0.05),
      N(0, 165, 1.4, 0.06, "sine"), N(4, 131, 1.4, 0.05, "sine")],
  ],
};

// "Night Sky" — slow, calm sine pads with a twinkle, for evening study.
const NIGHT: TrackDef = {
  bpm: 66,
  beatsPerBar: 8,
  bars: [
    [N(0, 262, 3.2, 0.045, "sine"), N(0, 392, 3.2, 0.03, "sine"), N(0, 494, 3.2, 0.022, "sine"),
      N(4, 220, 3.2, 0.045, "sine"), N(4, 330, 3.2, 0.03, "sine"), N(4, 415, 3.2, 0.022, "sine"),
      N(6, 1047, 0.8, 0.02, "sine"), N(7, 880, 0.8, 0.018, "sine")],
    [N(0, 175, 3.2, 0.045, "sine"), N(0, 262, 3.2, 0.03, "sine"), N(0, 330, 3.2, 0.022, "sine"),
      N(4, 196, 3.2, 0.045, "sine"), N(4, 294, 3.2, 0.03, "sine"), N(4, 370, 3.2, 0.022, "sine"),
      N(2, 784, 0.8, 0.018, "sine"), N(6, 988, 0.8, 0.02, "sine")],
  ],
};

const TRACKS: Record<MusicTrack, TrackDef> = { sunny: SUNNY, night: NIGHT };

let musicGain: GainNode | undefined;
let schedulerId = 0;
let currentTrack: MusicTrack | null = null;
let nextBarTime = 0;
let nextBar = 0;

function scheduleBar(def: TrackDef, barIndex: number, when: number) {
  if (!ctx || !musicGain) return;
  const secPerBeat = 60 / def.bpm;
  const bar = def.bars[barIndex % def.bars.length];
  if (!bar) return;
  for (const note of bar) {
    tone(ctx, musicGain, note.freq, when + note.beat * secPerBeat, note.dur, note.peak, note.type);
  }
}

export function startMusic(track: MusicTrack) {
  const ac = audio();
  if (!ac || !master) return;
  if (currentTrack === track && schedulerId) return;
  stopMusic();
  if (!musicGain) {
    musicGain = ac.createGain();
    musicGain.connect(master);
  }
  musicGain.gain.value = 0.9;
  currentTrack = track;
  nextBar = 0;
  nextBarTime = ac.currentTime + 0.1;
  const def = TRACKS[track];
  schedulerId = window.setInterval(() => {
    if (!ctx) return;
    // Look ahead ~0.6s so notes are always queued before the bar starts.
    while (nextBarTime < ctx.currentTime + 0.6) {
      scheduleBar(def, nextBar, nextBarTime);
      if (currentTrack !== track) return;
      nextBar += 1;
      nextBarTime += def.beatsPerBar * (60 / def.bpm);
    }
  }, 200);
}

export function stopMusic() {
  if (schedulerId) {
    window.clearInterval(schedulerId);
    schedulerId = 0;
  }
  if (musicGain && ctx) {
    // Fade out instead of cutting, so a switch between tracks never clicks.
    musicGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
  }
  currentTrack = null;
}

/** Drop the music volume while the tutor reads aloud, then ease it back. */
export function duckMusic(on: boolean) {
  if (!musicGain || !ctx) return;
  musicGain.gain.setTargetAtTime(on ? 0.15 : 0.9, ctx.currentTime, 0.15);
}
