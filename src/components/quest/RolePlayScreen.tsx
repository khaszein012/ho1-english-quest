import { useRef, useState } from "react";
import type { Lesson } from "@/lib/quest/config";
import { AudioModePanel, SpeakerButton } from "@/lib/quest/audio";
import { starBurst } from "@/lib/quest/fx";
import { DrawAndDescribe } from "./DrawAndDescribe";
import { useQuest } from "@/lib/quest/store";

export function RolePlayScreen({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const rp = lesson.rolePlay;
  const { state } = useQuest();
  const [checked, setChecked] = useState<number[]>([]);
  const [twist, setTwist] = useState<string | null>(null);

  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const livePreview = useRef<HTMLVideoElement | null>(null);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (livePreview.current) {
        livePreview.current.srcObject = stream;
        await livePreview.current.play().catch(() => undefined);
      }
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "video/webm" });
        setVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        if (livePreview.current) livePreview.current.srcObject = null;
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("I couldn't reach your camera or microphone. Check your browser permissions.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="space-y-5">
      <header className="card-quest p-5">
        <h2 className="font-display text-2xl font-extrabold">Role-Play 🎭</h2>
        <p className="mt-1 font-display text-xl text-gold">{rp.title}</p>
      </header>

      <AudioModePanel scriptTitle={`Role-play: ${rp.title}`} scriptLines={rp.prompts} />

      <div className="card-quest space-y-3 p-5">
        {rp.prompts.map((p, i) => (
          <div key={p} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/70 px-4 py-3">
            <button
              onClick={() => {
                if (!checked.includes(i)) {
                  setChecked((c) => [...c, i]);
                  starBurst();
                  onComplete();
                }
              }}
              className={`flex flex-1 items-center gap-3 text-left text-lg ${
                checked.includes(i) ? "text-grass line-through" : ""
              }`}
            >
              <span className="text-2xl">{checked.includes(i) ? "✅" : "⬜"}</span>
              {p}
            </button>
            <SpeakerButton text={p} />
          </div>
        ))}
        <button
          onClick={() => setTwist(rp.twists[Math.floor(Math.random() * rp.twists.length)] ?? null)}
          className="btn-pop bg-berry px-4 py-3 text-lg text-primary-foreground"
        >
          Surprise Twist! 🎉
        </button>
        {twist && (
          <p className="animate-pop-in rounded-2xl bg-gold px-4 py-3 font-display text-xl font-bold text-gold-foreground">
            {twist}
          </p>
        )}
      </div>

      {rp.drawAndDescribe && <DrawAndDescribe checklist={rp.drawChecklist ?? rp.prompts} />}



      <div className="card-quest space-y-3 p-5">
        <h3 className="font-display text-xl font-bold">Homework 🏠</h3>
        <p className="text-lg">{rp.homework}</p>
        <p className="rounded-2xl bg-secondary/70 px-4 py-2 text-sm font-bold text-gold">
          Your recording stays on this device only.
        </p>
        <video ref={livePreview} muted playsInline className="w-full max-w-md rounded-2xl bg-background" />
        <div className="flex flex-wrap gap-3">
          {!recording ? (
            <button onClick={startRecording} className="btn-pop bg-berry px-4 py-3 text-lg text-primary-foreground">
              ⏺️ Start recording
            </button>
          ) : (
            <button onClick={stopRecording} className="btn-pop bg-destructive px-4 py-3 text-lg text-primary-foreground">
              ⏹️ Stop recording
            </button>
          )}
          {videoUrl && (
            <a
              href={videoUrl}
              download={`${state.studentName.replace(/[^\p{L}\p{N}-]+/gu, "-")}-english-quest-recording.webm`}
              className="btn-pop inline-block bg-grass px-4 py-3 text-lg text-gold-foreground"
            >
              ⬇️ Download my recording
            </a>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {videoUrl && <video src={videoUrl} controls className="w-full max-w-md rounded-2xl" />}
      </div>
    </div>
  );
}
