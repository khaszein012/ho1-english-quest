import { ASKS, applies, answerFor } from "@/components/quest/FamilyDetective";
import { LESSONS } from "@/lib/quest/config";

const faces = LESSONS.find((l) => l.detective)!.detective!.faces;
console.log("faces:", faces.length);
let bad: string[] = [];
for (const f of faces) {
  for (const a of ASKS) {
    const ans = answerFor(a, f);
    const yes = ans.startsWith("Yes");
    const truth = applies(a, f);
    const q = a.text(f);
    // pronoun sanity
    if (yes !== truth && !ans.startsWith("No —")) bad.push(`${f.name}: ${q} -> ${ans} (truth ${truth})`);
    if (a.form !== "they" && ans.startsWith("Yes") && !ans.includes(f.gender === "female" ? "she" : "he"))
      bad.push(`${f.name}: pronoun in ${ans}`);
    // semantic cross-checks
    if (a.id === "she-old" && yes && (f.gender !== "female" || f.age < 60)) bad.push(`old-f ${f.name}`);
    if (a.id === "he-old" && yes && (f.gender !== "male" || f.age < 60)) bad.push(`old-m ${f.name}`);
    if (a.id === "she-young" && yes && (f.gender !== "female" || f.age >= 30)) bad.push(`young-f ${f.name}`);
    if (a.id === "he-young" && yes && (f.gender !== "male" || f.age >= 30)) bad.push(`young-m ${f.name}`);
    if (a.id === "they-children" && yes !== f.age < 13) bad.push(`child ${f.name}`);
    if (a.id === "age-30" && yes !== f.age > 30) bad.push(`age30 ${f.name}`);
    if (a.id === "she-woman" && yes !== (f.gender === "female")) bad.push(`woman ${f.name}`);
    if (a.id === "he-man" && yes !== (f.gender === "male")) bad.push(`man ${f.name}`);
    if (a.id === "they-grandparents" && yes !== (f.relation === "grandparent")) bad.push(`gp ${f.name}`);
    if (a.id === "she-mother" && yes !== (f.relation === "mother")) bad.push(`mum ${f.name}`);
    if (a.id === "he-father" && yes !== (f.relation === "father")) bad.push(`dad ${f.name}`);
    // gendered question about the other gender must not answer about the attribute
    if (a.gender && f.gender !== a.gender && !ans.startsWith("No —")) bad.push(`gender leak ${f.name} ${q} ${ans}`);
  }
}
console.log("forward problems:", bad);

// reverse round simulation: hide each face, answer truthfully, must never contradict
function nextAsk(cands: typeof faces, asked: string[]) {
  const g = new Set(cands.map((f) => f.gender));
  const known = g.size === 1 ? [...g][0] : null;
  return ASKS.find((a) => !asked.includes(a.id) && (!a.gender || a.gender === known) && cands.some((f) => applies(a, f)) && cands.some((f) => !applies(a, f))) ?? null;
}
const rbad: string[] = [];
for (const secret of faces) {
  let cands = faces.slice();
  const asked: string[] = [];
  const log: string[] = [];
  for (let i = 0; i < 20; i++) {
    if (cands.length === 1) break;
    const a = nextAsk(cands, asked);
    if (!a) break;
    if (a.gender && secret.gender !== a.gender) rbad.push(`wrong pronoun asked for ${secret.name}: ${a.text(cands[0])}`);
    const yes = applies(a, secret);
    log.push(`${a.text(cands[0])} ${yes ? "Yes" : "No"}`);
    cands = cands.filter((f) => applies(a, f) === yes);
    asked.push(a.id);
    if (!cands.some((f) => f.id === secret.id)) rbad.push(`${secret.name} eliminated itself! ${log.join(" | ")}`);
  }
  const final = cands[0];
  if (!final || final.id !== secret.id) rbad.push(`${secret.name} -> guessed ${final?.name} (left ${cands.map((f) => f.name).join(",")}) [${log.join(" | ")}]`);
}
console.log("reverse problems:", rbad);
