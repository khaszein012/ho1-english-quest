import { useState, type ReactNode } from "react";

export function FlipCard({
  front,
  back,
  className = "",
  height = "h-52",
  onFirstFlip,
}: {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  height?: string;
  onFirstFlip?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flip-scene ${height} ${className}`}>
      <button
        type="button"
        onClick={() => {
          setFlipped((f) => !f);
          if (!flipped) onFirstFlip?.();
        }}
        className="flip-inner h-full w-full text-left"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
        aria-pressed={flipped}
      >
        <div className="flip-face card-quest flex flex-col items-center justify-center gap-2 p-4">{front}</div>
        <div
          className="flip-face card-quest flex flex-col items-center justify-center gap-2 p-4"
          style={{ transform: "rotateY(180deg)", background: "linear-gradient(160deg, var(--primary), var(--surface-2))" }}
        >
          {back}
        </div>
      </button>
    </div>
  );
}
