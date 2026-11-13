export type ReadingSentence = { text: string; paragraph: number };

const ATTRIBUTION_VERBS =
  /\b(?:said|says|asked|asks|replied|replies|explained|explains|shouted|shouts|whispered|whispers|wrote|writes|laughed|laughs|smiled|smiles|added|adds|continued|continues)\b/i;

function isLetterOrNumber(value: string | undefined) {
  return value !== undefined && /[A-Za-z0-9]/.test(value);
}

function isApostrophe(text: string, index: number) {
  return isLetterOrNumber(text[index - 1]) && isLetterOrNumber(text[index + 1]);
}

function previousNonSpace(text: string, index: number) {
  let cursor = index - 1;
  while (cursor >= 0 && /\s/.test(text[cursor] ?? "")) cursor -= 1;
  return text[cursor];
}

function hasAttributionAfterQuote(text: string, quoteIndex: number) {
  let cursor = quoteIndex + 1;
  while (cursor < text.length && /\s/.test(text[cursor] ?? "")) cursor += 1;
  if ([",", ";", ":", "—", "–", "-"].includes(text[cursor] ?? "")) return true;
  const followingWords =
    text
      .slice(cursor)
      .match(/[A-Za-z]+/g)
      ?.slice(0, 4)
      .join(" ") ?? "";
  return ATTRIBUTION_VERBS.test(followingWords);
}

/**
 * Split a passage into read-aloud units without breaking quoted dialogue at its
 * internal punctuation. Attribution stays with the quote: "Look!" says Dito.
 */
export function splitSentences(paragraphs: string[]): ReadingSentence[] {
  const sentences: ReadingSentence[] = [];

  paragraphs.forEach((paragraphText, paragraph) => {
    let start = 0;
    let quote: '"' | "'" | null = null;

    const push = (end: number) => {
      const text = paragraphText.slice(start, end).trim();
      if (text) sentences.push({ text, paragraph });
      start = end;
    };

    const closeQuote = (index: number) => {
      quote = null;
      const terminal = ".!?".includes(previousNonSpace(paragraphText, index) ?? "");
      if (terminal && !hasAttributionAfterQuote(paragraphText, index)) push(index + 1);
    };

    for (let index = 0; index < paragraphText.length; index += 1) {
      const character = paragraphText[index];

      if (character === "“") {
        quote = '"';
        continue;
      }
      if (character === "”") {
        if (quote === '"') closeQuote(index);
        continue;
      }
      if (character === "‘") {
        quote = "'";
        continue;
      }
      if (character === "’") {
        if (quote === "'" && !isApostrophe(paragraphText, index)) closeQuote(index);
        continue;
      }
      if (character === '"') {
        if (quote === '"') closeQuote(index);
        else quote = '"';
        continue;
      }
      if (character === "'") {
        if (!isApostrophe(paragraphText, index)) {
          if (quote === "'") closeQuote(index);
          else quote = "'";
        }
        continue;
      }

      if (!character || !".!?".includes(character) || quote) continue;

      // Keep ellipses and repeated punctuation together as one ending.
      let end = index + 1;
      while (end < paragraphText.length && ".!?".includes(paragraphText[end] ?? "")) {
        end += 1;
      }
      push(end);
      index = end - 1;
    }

    push(paragraphText.length);
  });

  return sentences;
}
