// Label helpers for chart axes.

/** Wraps a category label onto at most two lines of `maxChars`, truncating the rest. */
export const wrapLabel = (text: string, maxChars: number): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (line && (line + " " + w).length > maxChars) {
      lines.push(line);
      line = w;
    } else {
      line = line ? line + " " + w : w;
    }
  }
  if (line) lines.push(line);
  if (lines.length > 2) {
    const kept = lines.slice(0, 2);
    kept[1] = kept[1].length >= maxChars ? kept[1].slice(0, maxChars - 1) + "…" : kept[1] + "…";
    return kept;
  }
  return lines;
};
