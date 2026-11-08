import { useCallback, useMemo, useRef, useState } from "react";
import { LESSONS, type Lesson } from "@/lib/quest/config";
import { useQuest } from "@/lib/quest/store";
import { AudioModePanel, SpeakerButton, useSpeak } from "@/lib/quest/audio";
import { bigCelebration, comboBurst, randomPraise, shuffle, starBurst } from "@/lib/quest/fx";
import { bossConfig, buildFight, type BossQuestion } from "@/lib/quest/boss";

type Phase = "intro" | "fight" | "won";

/** Random line from a persona list, with a safe fallback. */
function pickLine(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)] ?? randomPraise();
}

export function BossChallenge({ lesson }: { lesson: Lesson }) {
  const { addStars, defeatBoss, finishBossFight, bossUnlocked, state } = useQuest();
  const cfg = bossConfig(lesson);
  const { enabled: appVoice, mode: audioMode } = useSpeak();
  const best = state.bossBest[lesson.id];
  const defeated = state.bossDefeated.includes(lesson.id);
  const unlocked = bossUnlocked(lesson.id);
  const persona = lesson.bossPersona;

  const [phase, setPhase] = useState<Phase>("intro");
  const [queue, setQueue] = useState<BossQuestion[]>([]);
  const [seen, setSeen] = useState<BossQuestion[]>([]);
  const [hp, setHp] = useState(cfg.maxHp);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [reaction, setReaction] = useState<"none" | "hit" | "regen">("none");
  const [message, setMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [surrendered, setSurrendered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [superCharge, setSuperCharge] = useState(0);
  const [superArmed, setSuperArmed] = useState(false);
  const [locked, setLocked] = useState(false);
  const missCounts = useRef<Record<string, number>>({});
  const plannedQuestions = useMemo(() => buildFight(lesson, LESSONS).length, [lesson]);

  const current = queue[0];
  const hpPercent = Math.round((hp / cfg.maxHp) * 100);
  const superReady = superCharge >= cfg.superEvery;
  // HP bands: 0 = top half of the fight, 1 = weakened, 2 = critical final third.
  const bandOf = (h: number) => (h <= cfg.maxHp / 3 ? 2 : h <= (cfg.maxHp * 2) / 3 ? 1 : 0);
  const band = bandOf(hp);
  const finishLine = phase === "fight" && hp > 0 && hp <= cfg.hpPerHit;

  const start = useCallback(() => {
    missCounts.current = {};
    setQueue(buildFight(lesson, LESSONS));
    setSeen([]);
    setHp(cfg.maxHp);
    setHits(0);
    setMisses(0);
    setMessage(null);
    setShowHint(false);
    setSurrendered(false);
    setReaction("none");
    setStreak(0);
    setSuperCharge(0);
    setSuperArmed(false);
    setLocked(false);
    setPhase("fight");
  }, [lesson, cfg.maxHp]);

  if (!unlocked) {
    return (
      <div className="card-quest space-y-2 p-6 text-center">
        <h2 className="font-display text-2xl font-extrabold">Boss Challenge 🏆</h2>
        <p className="text-6xl">🔒</p>
        <p className="text-lg text-muted-foreground">
          Finish Vocabulary, Grammar, Learn, Practice, Reading and Role-Play to unlock the boss!
        </p>
      </div>
    );
  }

  /** Win the fight (HP at 0, or the surrender safety net). */
  function finish(totalHits: number, totalMisses: number, gaveUp: boolean) {
    finishBossFight(lesson.id, totalHits, totalMisses);
    defeatBoss(lesson.id);
    bigCelebration();
    setSurrendered(gaveUp);
    setPhase("won");
  }

  function answer(option: string) {
    if (!current || locked) return;
    if (option === current.answer) {
      const nextStreak = streak + 1;
      const combo = !superArmed && nextStreak % cfg.comboEvery === 0;
      const damage = superArmed ? cfg.superDamage : cfg.hpPerHit + (combo ? cfg.comboBonus : 0);
      const nextHp = Math.max(0, hp - damage);
      const bandBefore = bandOf(hp);
      const bandAfter = bandOf(nextHp);
      // The boss announces a new phase the first time its HP drops into a lower band.
      const phaseLine =
        nextHp > 0 && bandAfter > bandBefore ? persona?.phases[bandAfter - 1] : undefined;

      setHp(nextHp);
      setHits((h) => h + 1);
      setStreak(nextStreak);
      if (superArmed) {
        // The Super Move is spent by the hit it powered.
        setSuperArmed(false);
        setSuperCharge(0);
      } else if (!superReady) {
        setSuperCharge(Math.min(superCharge + 1, cfg.superEvery));
      }

      setSeen((s) => [...s, current]);
      setQueue((q) => q.slice(1));
      setShowHint(false);
      setReaction("hit");
      if (superArmed && phaseLine) setMessage(`SUPER HIT! ⚡ ${phaseLine}`);
      else if (superArmed) setMessage(`SUPER HIT! ⚡ ${damage} damage!`);
      else if (combo && phaseLine) setMessage(`COMBO! 🔥 ${phaseLine}`);
      else if (combo) setMessage(`COMBO! 🔥 x${nextStreak} — ${damage} damage!`);
      else if (phaseLine) setMessage(phaseLine);
      else if (nextHp > 0 && nextHp <= cfg.hpPerHit) setMessage("One more hit! 🎯");
      else setMessage(persona ? pickLine(persona.hurt) : randomPraise());
      addStars(lesson.id, 1);
      if (superArmed || combo) comboBurst();
      else starBurst();
      setLocked(true);
      window.setTimeout(() => {
        setReaction("none");
        setLocked(false);
      }, 450);
      if (nextHp === 0) finish(hits + 1, misses, false);
      else if (hits + 1 + misses >= cfg.surrenderAfter) finish(hits + 1, misses, true);
      return;
    }

    // Miss: the boss recovers (faster in its critical final third!) and the
    // question comes back later, along with one or two already-answered ones.
    // The streak breaks, but an armed ⚡ Super Move stays armed — it is only
    // ever spent by a correct answer.
    const count = (missCounts.current[current.key] ?? 0) + 1;
    missCounts.current[current.key] = count;
    setMisses((m) => m + 1);
    setStreak(0);
    setHp((h) => Math.min(cfg.maxHp, h + (bandOf(h) === 2 ? cfg.criticalRegen : cfg.bossRegen)));
    setWrongKey(option);
    setReaction("regen");
    setMessage(
      persona ? `${pickLine(persona.taunt)} Try again! 💪` : "The boss is tough! Try again! 💪",
    );
    setLocked(true);
    window.setTimeout(() => setWrongKey(null), 450);
    window.setTimeout(() => {
      setReaction("none");
      setLocked(false);
    }, 700);
    // Safety net: the boss can heal as fast as it takes damage, so a long unlucky
    // run could in theory never reach 0 HP. After `surrenderAfter` attempts the
    // boss gives up — the learner always finishes the fight a winner.
    if (hits + misses + 1 >= cfg.surrenderAfter) {
      finish(hits, misses + 1, true);
      return;
    }
    setQueue((q) => {
      const [missed, ...rest] = q;
      if (!missed) return q;
      const comeback = shuffle(seen).slice(0, seen.length > 2 ? 2 : 1);
      const pool = [...rest, ...comeback];
      // The missed question comes back later in the fight, never immediately.
      const at = Math.min(2, pool.length);
      return [...pool.slice(0, at), missed, ...pool.slice(at)];
    });
  }

  const bossFace = (
    <div className="text-center">
      <p
        className={`text-7xl ${reaction === "hit" ? "animate-ouch" : reaction === "regen" ? "animate-regen" : "animate-float"}`}
      >
        {cfg.emoji}
      </p>
      <p className="font-display text-lg font-bold">{cfg.name}</p>
    </div>
  );

  if (phase === "intro") {
    return (
      <div className="space-y-5">
        <div className="card-quest space-y-4 p-6 text-center">
          <h2 className="font-display text-3xl font-extrabold">Boss Challenge 🏆</h2>
          {bossFace}
          <p className="text-lg text-muted-foreground">
            A friendly boss with {cfg.maxHp} health. Every correct answer hits for {cfg.hpPerHit} —
            chain {cfg.comboEvery} in a row for a 🔥 COMBO! Charge your ⚡ Super Move every{" "}
            {cfg.superEvery} hits to smash for {cfg.superDamage}. A miss lets the boss heal{" "}
            {cfg.bossRegen} — {cfg.criticalRegen} when it's almost down — and brings questions back.
            The fight gets longer, but you can never lose!
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-secondary/70 p-4">
              <p className="font-display text-3xl font-extrabold text-gold">{cfg.maxHp}</p>
              <p className="text-sm text-muted-foreground">boss health</p>
            </div>
            <div className="rounded-2xl bg-secondary/70 p-4">
              <p className="font-display text-3xl font-extrabold">{plannedQuestions}</p>
              <p className="text-sm text-muted-foreground">questions today</p>
            </div>
            <div className="rounded-2xl bg-secondary/70 p-4">
              <p className="font-display text-xl font-extrabold">
                {best
                  ? `${best.hits} ${best.hits === 1 ? "hit" : "hits"}, ${best.misses} ${best.misses === 1 ? "miss" : "misses"}`
                  : "no record yet"}
              </p>
              <p className="text-sm text-muted-foreground">best fight</p>
            </div>
          </div>
          <button
            onClick={start}
            className="btn-pop w-full bg-gold px-4 py-4 text-xl text-gold-foreground"
          >
            Start the fight! ⚔️
          </button>
          {defeated && (
            <p className="text-base text-grass">
              You've beaten this boss before — can you beat your record?
            </p>
          )}
        </div>
      </div>
    );
  }

  if (phase === "won") {
    return (
      <div className="card-quest animate-pop-in space-y-3 p-8 text-center">
        <p className="text-7xl">🎉</p>
        <p className="font-display text-3xl font-extrabold">
          {surrendered ? "The boss surrenders! 😅" : "Boss Defeated!"}
        </p>
        <p className="text-lg text-muted-foreground">
          {surrendered ? "You never gave up, so the boss did! " : ""}
          {hits} {hits === 1 ? "hit" : "hits"}, {misses} {misses === 1 ? "miss" : "misses"}. You
          unlocked the {lesson.sticker.name} sticker {lesson.sticker.emoji}
        </p>
        <p className="font-display text-lg text-gold">
          {best && best.hits === hits && best.misses === misses
            ? "New personal record! 🏅"
            : `Best: ${best?.hits} ${best?.hits === 1 ? "hit" : "hits"}, ${best?.misses} ${best?.misses === 1 ? "miss" : "misses"}`}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={start}
            className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground"
          >
            Battle again 🔄
          </button>
          <button
            onClick={() => setPhase("intro")}
            className="btn-pop bg-secondary px-4 py-3 text-lg text-secondary-foreground"
          >
            Done for now ✅
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="card-quest space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {bossFace}
          <div className="min-w-[200px] flex-1 space-y-2">
            <div className="h-6 overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${band === 2 ? "bg-berry" : "bg-gold"}`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-base text-gold">
                Boss health: {hp} / {cfg.maxHp}
              </p>
              {streak >= 2 && (
                <span className="rounded-full bg-berry px-3 py-1 text-sm font-bold text-primary-foreground">
                  🔥 x{streak} streak
                </span>
              )}
              <p className="font-display text-base">Hits landed: {hits} 💥</p>
            </div>
          </div>
        </div>
        {message && <p className="font-display text-lg text-grass">{message}</p>}
        {superArmed ? (
          <p className="rounded-2xl bg-gold/20 px-4 py-2 text-center font-display text-base font-bold text-gold">
            ⚡ SUPER ARMED — your next correct answer deals {cfg.superDamage} damage!
          </p>
        ) : superReady ? (
          <button
            onClick={() => setSuperArmed(true)}
            className="btn-pop animate-glow w-full bg-gold px-4 py-3 text-lg text-gold-foreground"
          >
            ⚡ SUPER MOVE READY — tap to power your next answer ({cfg.superDamage} damage)!
          </button>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            ⚡ Super Move: {superCharge}/{cfg.superEvery} correct answers to charge
          </p>
        )}
        <button
          onClick={() => setPhase("intro")}
          className="btn-pop bg-secondary px-3 py-2 text-base text-secondary-foreground"
        >
          Run away! 🏃
        </button>
      </header>

      {/* Same three-mode audio system as every other screen. In Teacher Reads mode
          the pop-out carries this question's script so the tutor can voice it in a
          window the student never sees. */}
      {current && (
        <AudioModePanel
          scriptTitle={`Boss fight — ${cfg.name}`}
          scriptLines={[
            `<strong>${current.label}</strong>`,
            current.speak
              ? `Read this sentence aloud (twice, slowly): <strong>“${current.speak}”</strong>`
              : `Read the question aloud: <strong>“${current.prompt}”</strong>`,
            `Choices on ${state.studentName}'s screen: ${current.options.join(" · ")}`,
            `Answer (tutor only — keep this window hidden): <strong>${current.answer}</strong>`,
            `Clue if he is stuck twice: ${current.hint}`,
            superArmed
              ? `⚡ Super Move is ARMED — a correct answer now deals ${cfg.superDamage} damage!`
              : `⚡ Super Move: ${superCharge}/${cfg.superEvery} charged${superReady ? " and READY to arm" : ""}.`,
          ]}
        />
      )}

      {current && (
        <div className={`card-quest space-y-4 p-5 ${finishLine ? "ring-2 ring-berry" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold">
              {current.label}
            </span>
            {current.review && (
              <span className="rounded-full bg-berry px-3 py-1 text-sm font-bold text-primary-foreground">
                Surprise review! 🔁
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="font-display text-2xl font-bold">{current.prompt}</p>
            <SpeakerButton text={current.speak ?? current.prompt} />
          </div>
          {current.kind === "listen" && !appVoice && (
            <p className="rounded-2xl bg-secondary/70 px-4 py-3 text-base text-muted-foreground">
              {audioMode === "teacher"
                ? "App voice is off — ask your tutor to read the sentence out loud."
                : "App voice is off — play the sentence on your own device, or switch to App Voice."}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {current.options.map((o) => (
              <button
                key={o}
                onClick={() => answer(o)}
                disabled={locked}
                className={`btn-pop bg-secondary px-4 py-4 text-lg text-secondary-foreground ${
                  wrongKey === o ? "animate-shake" : ""
                } ${locked ? "opacity-60" : ""}`}
              >
                {o}
              </button>
            ))}
          </div>
          {(missCounts.current[current.key] ?? 0) >= 2 && (
            <div className="space-y-2">
              {showHint ? (
                <p className="rounded-2xl bg-secondary/70 px-4 py-3 text-base">💡 {current.hint}</p>
              ) : (
                <button
                  onClick={() => setShowHint(true)}
                  className="btn-pop bg-berry px-4 py-2 text-base text-primary-foreground"
                >
                  Need a hint? 💡
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
