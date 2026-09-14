import { useEffect, useRef, useState } from "react";

/* =============================================================================
 * DRAW & DESCRIBE ✏️ — a deliberately tiny sketchpad: pen (3 sizes), 6 colours,
 * eraser, clear-all. Nothing is uploaded anywhere; "Save my drawing" downloads a
 * PNG straight to this device.
 * ========================================================================== */

const COLORS = ["#1f2544", "#e94f37", "#f6bd60", "#2a9d8f", "#4361ee", "#9d4edd"];
const SIZES = [3, 8, 16];

export function DrawAndDescribe({ checklist }: { checklist: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState(COLORS[0]!);
  const [size, setSize] = useState(SIZES[1]!);
  const [eraser, setEraser] = useState(false);
  const [big, setBig] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.strokeStyle = eraser ? "#ffffff" : color;
    ctx.lineWidth = eraser ? size * 3 : size;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function up() {
    drawing.current = false;
  }

  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "my-family-drawing.png";
    link.click();
  }

  const pad = (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            aria-label={`colour ${c}`}
            onClick={() => {
              setColor(c);
              setEraser(false);
            }}
            style={{ background: c }}
            className={`h-9 w-9 rounded-full border-4 ${color === c && !eraser ? "border-gold" : "border-transparent"}`}
          />
        ))}
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`btn-pop px-3 py-2 text-base ${size === s ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            {s === 3 ? "Thin ✏️" : s === 8 ? "Medium 🖊️" : "Thick 🖌️"}
          </button>
        ))}
        <button
          onClick={() => setEraser((v) => !v)}
          className={`btn-pop px-3 py-2 text-base ${eraser ? "bg-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          Eraser 🧽
        </button>
        <button onClick={clearAll} className="btn-pop bg-secondary px-3 py-2 text-base text-secondary-foreground">
          Clear all 🗑️
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={960}
        height={600}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="w-full touch-none rounded-2xl bg-white"
        style={{ aspectRatio: "8 / 5" }}
      />
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setBig((b) => !b)}
          className="btn-pop bg-gold px-4 py-3 text-lg text-gold-foreground"
        >
          {big ? "Close big view ✖️" : "Show the teacher 👀"}
        </button>
        <button onClick={save} className="btn-pop bg-grass px-4 py-3 text-lg text-gold-foreground">
          Save my drawing ⬇️
        </button>
      </div>
    </div>
  );

  return (
    <div className="card-quest space-y-4 p-5">
      <h3 className="font-display text-xl font-bold">Draw &amp; Describe ✏️</h3>
      <div className="space-y-2">
        {checklist.map((c, i) => (
          <button
            key={c}
            onClick={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}
            className={`flex w-full items-center gap-3 rounded-2xl bg-secondary/70 px-4 py-3 text-left text-lg ${
              done.includes(i) ? "text-grass line-through" : ""
            }`}
          >
            <span className="text-2xl">{done.includes(i) ? "✅" : "⬜"}</span>
            {c}
          </button>
        ))}
      </div>
      {/* One single canvas element in both views: switching to the big view only
          changes this wrapper's classes, so the drawing is never wiped. */}
      <div className={big ? "fixed inset-0 z-50 overflow-auto bg-background/95 p-3" : ""}>{pad}</div>
      <p className="rounded-2xl bg-secondary/70 px-4 py-2 text-sm font-bold text-gold">
        Your drawing stays on this device only.
      </p>
    </div>
  );
}
