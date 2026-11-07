import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import type { Lesson } from "@/lib/quest/config";
import { SpeakerButton } from "@/lib/quest/audio";
import { Button } from "@/components/ui/button";

export function ConversationPractice({ conversation, onRolePlay }: {
  conversation: Lesson["rolePlay"]["conversation"];
  onRolePlay: () => void;
}) {
  const [role, setRole] = useState<0 | 1>(0);
  const [hideLines, setHideLines] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);

  return (
    <section className="conversation-practice" aria-label="Conversation practice">
      <div className="conversation-scene">
        <img src={conversation.image} alt={conversation.imageAlt} width={1200} height={800} className="conversation-image" />
        <div className="mt-4 space-y-2">
          <p className="section-kicker">01 · CONVERSATION PRACTICE</p>
          <h3 className="font-display text-2xl font-extrabold">{conversation.title}</h3>
          <p className="text-muted-foreground">{conversation.scene}</p>
        </div>
      </div>
      <div className="conversation-dialogue">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">My role</span>
            <div className="flex gap-1" role="group" aria-label="Choose your conversation role">
              {conversation.roles.map((name, index) => (
                <Button key={name} size="auto" variant={role === index ? "default" : "secondary"} className="px-3 py-2" aria-pressed={role === index} onClick={() => { setRole(index === 0 ? 0 : 1); setRevealed([]); }}>{name}</Button>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="auto" className="px-2 py-2 text-sm" aria-pressed={hideLines} onClick={() => { setHideLines(!hideLines); setRevealed([]); }}>
            {hideLines ? <Eye /> : <EyeOff />}{hideLines ? "Show my lines" : "Hide my lines"}
          </Button>
        </div>
        <ol className="mt-4 space-y-2">
          {conversation.lines.map((line, index) => {
            const mine = line.role === role;
            const hidden = mine && hideLines && !revealed.includes(index);
            return (
              <li key={index} className={`conversation-line ${mine ? "conversation-line-mine" : ""}`}>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-extrabold text-muted-foreground">{conversation.roles[line.role]}{mine ? " · You" : " · Partner"}</p>
                  {hidden ? <Button variant="ghost" size="auto" className="justify-start px-0 py-1 text-sm text-gold" onClick={() => setRevealed((previous) => [...previous, index])}>Reveal my line</Button> : <p className="text-lg">{line.text}</p>}
                </div>
                <SpeakerButton text={line.text} label={`Hear ${conversation.roles[line.role]}'s line`} />
              </li>
            );
          })}
        </ol>
        <div className="mt-5 flex justify-end">
          <Button onClick={onRolePlay} size="auto" className="px-4 py-3">Ready for role-play <ArrowRight /></Button>
        </div>
      </div>
    </section>
  );
}