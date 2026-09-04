import confetti from "canvas-confetti";

const COLORS = ["#f5b942", "#ffd977", "#8b7bf7", "#5ad39a", "#ff7ab8"];

export function starBurst() {
  confetti({
    particleCount: 55,
    spread: 70,
    startVelocity: 34,
    origin: { y: 0.7 },
    colors: COLORS,
    scalar: 0.9,
  });
}

export function bigCelebration() {
  confetti({ particleCount: 140, spread: 110, origin: { y: 0.6 }, colors: COLORS });
  window.setTimeout(
    () => confetti({ particleCount: 90, spread: 140, origin: { x: 0.2, y: 0.5 }, colors: COLORS }),
    220,
  );
  window.setTimeout(
    () => confetti({ particleCount: 90, spread: 140, origin: { x: 0.8, y: 0.5 }, colors: COLORS }),
    380,
  );
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }

  return copy;
}

export const PRAISE = ["Nice one!", "You've got this!", "Awesome!", "Great job!", "Brilliant!", "Keep going!"];

export function randomPraise() {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)]!;
}
