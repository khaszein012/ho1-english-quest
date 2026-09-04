import { useMemo, useRef, useState } from "react";
import type { Lesson } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { AudioModePanel, SpeakerButton, cancelSpeech, speakText, useSpeak } from "@/lib/quest/audio";
import { bigCelebration, randomPraise, starBurst } from "@/lib/quest/fx";

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

  // Part C
  const [found, setFound] = useState<string[]>([]);
  const [missTap, setMissTap] = useState<string | null>(null);
  const targets = r.spotlight.words.map((w) => w.toLowerCase());

  function readAloud(from = 0) {
    if (!enabled) return;
    cancelSpeech();
    const step = (i: number) => {
      const s = sentences[i];
      if (!s) {
        setSpeaking(null);
        return;
      }
      setSpeaking(i);
      sentenceRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
      speakText(s.text, { rate: 0.72, onEnd: () => step(i + 1) });
    };
    step(from);
  }

  function tapWord(token: Token) {
    const clean = token.clean.toLowerCase();
    if (targets.includes(clean) && !found.includes(clean)) {
      const next = [...found, clean];
      setFound(next);
      addStars(lesson.id, 1);
      starBurst();
      onComplete();
      if (next.length === targets.length) bigCelebration();
    } else if (!targets.includes(clean)) {
      setMissTap(`${token.sentenceIndex}-${token.text}`);
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

      <div className="card-quest space-y-4 p-5 sm:p-7">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => readAloud(0)}
            className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground"
          >
            ▶️ Read to me
          </button>
          <button
            onClick={() => {
              cancelSpeech();
              setSpeaking(null);
            }}
            className="btn-pop bg-secondary px-4 py-3 text-lg text-secondary-foreground"
          >
            ⏹️ Stop
          </button>
        </div>

        <div className="space-y-5 text-2xl leading-relaxed sm:text-[1.7rem]">
          {r.paragraphs.map((_, pi) => (
            <p key={pi}>
              {sentences.map((s, si) =>
                s.paragraph !== pi ? null : (
                  <span
                    key={si}
                    ref={(el) => {
                      sentenceRefs.current[si] = el;
                    }}
                    className={`rounded-lg px-1 transition-colors ${
                      speaking === si ? "bg-gold text-gold-foreground" : ""
                    }`}
                  >
                    {s.text.split(/(\s+)/).map((piece) => {
                      if (!piece.trim()) return piece;
                      const clean = piece.replace(/[^A-Za-z']/g, "");
                      const token: Token = { text: piece, clean, sentenceIndex: si };
                      const id = `${si}-${piece}`;
                      const isFound = found.includes(clean.toLowerCase());
                      tokenId += 1;
                      return (
                        <span
                          key={`${id}-${tokenId}`}
                          onClick={() => tapWord(token)}
                          className={`cursor-pointer rounded px-0.5 ${
                            isFound ? "bg-gold font-bold text-gold-foreground" : "hover:bg-secondary"
                          } ${missTap === id ? "animate-shake" : ""}`}
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

      <div className="card-quest space-y-4 p-5">
        <h3 className="font-display text-xl font-bold">Comprehension Questions</h3>
        {!question ? (
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

      <div className="card-quest space-y-2 border-dashed p-5">
        <h3 className="font-display text-xl font-bold">Stretch question 🌱 (tutor asks aloud)</h3>
        <p className="text-xl">{r.stretchQuestion}</p>
        <p className="text-sm text-muted-foreground">No score here — just talk about it together.</p>
      </div>
    </div>
  );
}
