import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/tokens.css", "utf-8");

/** The declarations of one theme block: ":root" holds the light tokens, ".dark" the dark ones. */
const block = (selector: ":root" | ".dark") => {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`no ${selector} block in tokens.css`);
  return css.slice(start, css.indexOf("}", start));
};

const token = (declarations: string, name: string) => {
  const line = declarations.split("\n").find((l) => l.trim().startsWith(`${name}:`));
  const hex = line && /#[0-9a-fA-F]{6}/.exec(line)?.[0];
  if (!hex) throw new Error(`token ${name} not found`);
  return hex;
};

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe.each([
  ["light", ":root"],
  ["dark", ".dark"],
] as const)("%s text contrast", (_name, selector) => {
  const decl = block(selector);
  const surfaces = ["--surface-container", "--surface-page-background", "--surface-raised"].map((n) => token(decl, n));

  it("keeps quaternary text at 4.5:1 or better on every surface", () => {
    const q = token(decl, "--text-quaternary");
    surfaces.forEach((s) => expect(ratio(q, s)).toBeGreaterThanOrEqual(4.5));
  });

  it("keeps the text steps in order: secondary, tertiary, quaternary", () => {
    const container = token(decl, "--surface-container");
    const r = ["--text-secondary", "--text-tertiary", "--text-quaternary"].map((n) => ratio(token(decl, n), container));
    expect(r[0]).toBeGreaterThan(r[1]);
    expect(r[1]).toBeGreaterThan(r[2]);
  });
});
