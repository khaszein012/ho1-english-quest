import { useMemo, useRef, useState } from "react";
import type { Lesson } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { AudioModePanel, SpeakerButton, cancelSpeech, speakText, useSpeak } from "@/lib/quest/audio";
import { bigCelebration, randomPraise, starBurst } from "@/lib/quest/fx";
import { SoundSortSpotlight } from "./SoundSortSpotlight";


type Token = { text: string; clean: string; sentenceIndex: number };

function splitSentences(paragraphs: string[]) {
  const sentences: { text: string; paragraph: number }[] = [];
  paragraphs.forEach((p, pi) => {
    (p.match(/[^.!?]+[.!?]*/g) ?? [p]).forEach((s) => {
      const text = s.trim();
      if (text) sentences.push({ text, paragraph: pi });
    });
  });
  return sentences;
}

export function ReadingScreen({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { addStars } = useQuest();
  const { enabled } = useSpeak();
  const r = lesson.reading;
  const sentences = useMemo(() => splitSentences(r.paragraphs), [r.paragraphs]);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Part B
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [hint, setHint] = useState(false);

  // Part C — spotlight. Word Hunt taps words in the passage; Sound Sort uses cards.
  const soundSort = r.spotlight.mode === "sound_sort";
  const [found, setFound] = useState<string[]>([]);
  const [missTap, setMissTap] = useState<string | null>(null);
  const targets = soundSort ? [] : r.spotlight.words.map((w) => w.toLowerCase());


  /**
   * Matches a tapped word to a spotlight target, allowing simple inflections
   * that appear in the passage (e.g. "Tuesdays" -> "Tuesday", "friend's").
   */
  function targetFor(clean: string) {
    const w = clean.toLowerCase().replace(/'s$/, "");
    const forms = [w, w.replace(/es$/, ""), w.replace(/s$/, "")];
    return targets.find((t) => forms.includes(t)) ?? null;
  }

  const runIdRef = useRef(0);

  function stopReading() {
    runIdRef.current += 1;
    cancelSpeech();
    setSpeaking(null);
  }

  function readAloud(from = 0) {
    if (!enabled) return;
    // Invalidate any chain already running so a stopped/restarted read never
    // resumes from the old sentence when its utterance fires onend/onerror.
    runIdRef.current += 1;
    const runId = runIdRef.current;
    cancelSpeech();
    const step = (i: number) => {
      if (runId !== runIdRef.current) return;
      const s = sentences[i];
      if (!s) {
        setSpeaking(null);
        return;
      }
      setSpeaking(i);
      sentenceRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
      speakText(s.text, {
        rate: 0.7,
        onEnd: () => {
          if (runId !== runIdRef.current) return;
          // Small breath between sentences keeps the pace A1-friendly.
          window.setTimeout(() => step(i + 1), 400);
        },
      });
    };
    // Let the cancel above settle before queueing the first utterance.
    window.setTimeout(() => step(from), 80);
  }


  function tapWord(token: Token, tokenKey: string) {
    if (soundSort) return;
    const match = targetFor(token.clean);

    if (match && !found.includes(match)) {
      const next = [...found, match];
      setFound(next);
      addStars(lesson.id, 1);
      starBurst();
      onComplete();
      if (next.length === targets.length) bigCelebration();
    } else if (!match) {
      setMissTap(tokenKey);
      window.setTimeout(() => setMissTap(null), 400);
    }
  }

  const question = r.questions[qIndex];

  function answer(option: string) {
    if (!question) return;
    if (option === question.answer) {
      setAnswered((a) => [...a, qIndex]);
      addStars(lesson.id, 1);
      starBurst();
      onComplete();
      setHint(false);
      setQIndex((i) => i + 1);
    } else {
      setWrong(option);
      setHint(true);
      window.setTimeout(() => setWrong(null), 450);
    }
  }

  let tokenId = 0;

  return (
    <div className="space-y-5">
      <header className="card-quest p-5">
        <h2 className="font-display text-2xl font-extrabold">Reading 📖</h2>
        <p className="mt-1 font-display text-xl text-gold">{r.title}</p>
      </header>

      <AudioModePanel scriptTitle={r.title} scriptLines={r.paragraphs} />

      {/* A lesson may ship without its passage yet: config-only placeholder, no component change. */}
      {r.paragraphs.length === 0 ? (
        <div className="card-quest space-y-2 border-dashed p-6 text-center">
          <p className="text-5xl">📖</p>
          <p className="font-display text-xl font-bold">
            {r.placeholder ?? "Reading passage coming soon — the tutor will add the text."}
          </p>
        </div>
      ) : (
      <div className="card-quest space-y-4 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => readAloud(0)}
            disabled={!enabled}
            className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            ▶️ Read to me
          </button>
          <button
            onClick={stopReading}
            disabled={!enabled}
            className="btn-pop bg-secondary px-4 py-3 text-lg text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⏹️ Stop
          </button>
          {!enabled && (
            <p className="text-sm text-muted-foreground">
              App voice is off in this audio mode — switch to App Voice 🔊 above to let the app read.
            </p>
          )}
        </div>


        <div className="reading-passage space-y-7">
          {r.paragraphs.map((_, pi) => (
            <p key={pi}>
              {sentences.map((s, si) =>
                s.paragraph !== pi ? null : (
                  <span
                    key={si}
                    ref={(el) => {
                      sentenceRefs.current[si] = el;
                    }}
                    className={`rounded-lg px-1 py-0.5 transition-colors ${
                      speaking === si ? "bg-gold text-gold-foreground" : ""
                    }`}
                  >
                    {s.text.split(/(\s+)/).map((piece) => {
                      if (!piece.trim()) return piece;
                      const clean = piece.replace(/[^A-Za-z']/g, "");
                      const token: Token = { text: piece, clean, sentenceIndex: si };
                      const id = `${si}-${piece}`;
                      tokenId += 1;
                      const tokenKey = `${id}-${tokenId}`;
                      const match = targetFor(clean);
                      const isFound = !!match && found.includes(match);
                      return (
                        <span
                          key={tokenKey}
                          onClick={() => tapWord(token, tokenKey)}
                          className={`rounded px-0.5 ${soundSort ? "" : "cursor-pointer"} ${
                            isFound ? "bg-gold font-bold text-gold-foreground" : soundSort ? "" : "hover:bg-secondary"
                          } ${missTap === tokenKey ? "animate-shake" : ""}`}

                        >
                          {piece}
                        </span>
                      );
                    })}{" "}
                  </span>
                ),
              )}
            </p>
          ))}
        </div>
      </div>
      )}

      {soundSort ? (
        <SoundSortSpotlight
          spotlight={r.spotlight}
          onStar={() => {
            addStars(lesson.id, 1);
            onComplete();
          }}
        />
      ) : (
        <div className="card-quest space-y-4 p-5">
          <h3 className="font-display text-xl font-bold">Sound &amp; Spelling Spotlight 🔤</h3>
          <p className="text-lg">{r.spotlight.instruction}</p>
          <p className="font-display text-lg text-gold">
            Found {found.length} of {targets.length}!
          </p>
          {found.length === targets.length && (
            <p className="animate-pop-in rounded-2xl bg-grass px-4 py-3 font-display text-xl font-bold text-gold-foreground">
              You found them all! {randomPraise()} 🎉
            </p>
          )}
        </div>
      )}


      <div className="card-quest space-y-4 p-5">
        <h3 className="font-display text-xl font-bold">Comprehension Questions</h3>
        {r.questions.length === 0 ? (
          <p className="rounded-2xl bg-secondary/70 px-4 py-3 text-lg text-muted-foreground">
            Questions coming soon — they arrive with the passage.
          </p>
        ) : !question ? (
          <p className="animate-pop-in rounded-2xl bg-grass px-4 py-3 font-display text-xl font-bold text-gold-foreground">
            All {r.questions.length} questions done! ⭐ {randomPraise()}
          </p>
        ) : (
          <>
            <p className="font-display text-lg text-muted-foreground">
              Question {qIndex + 1} of {r.questions.length}
            </p>
            <div className="flex items-center gap-3">
              <p className="font-display text-2xl font-bold">{question.question}</p>
              <SpeakerButton text={question.question} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map((o) => (
                <button
                  key={o}
                  onClick={() => answer(o)}
                  className={`btn-pop px-4 py-4 text-lg bg-secondary text-secondary-foreground ${
                    wrong === o ? "animate-shake" : ""
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
            {hint && (
              <button
                onClick={() => {
                  const idx = sentences.findIndex((s) =>
                    s.text.toLowerCase().includes(question.answer.replace(/^a /, "").toLowerCase()),
                  );
                  if (idx >= 0) {
                    setSpeaking(idx);
                    sentenceRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className="btn-pop bg-gold px-4 py-3 text-base text-gold-foreground"
              >
                Read that part again! 👆
              </button>
            )}
          </>
        )}
        {answered.length > 0 && (
          <p className="text-sm text-muted-foreground">Correct answers so far: {answered.length}</p>
        )}
      </div>

      {r.stretchQuestion && (
        <div className="card-quest space-y-2 border-dashed p-5">
          <h3 className="font-display text-xl font-bold">Stretch question 🌱 (tutor asks aloud)</h3>
          <p className="text-xl">{r.stretchQuestion}</p>
          <p className="text-sm text-muted-foreground">No score here — just talk about it together.</p>
        </div>
      )}
    </div>
  );
}
