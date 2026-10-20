/**
 * Vertical domain for a sensor sparkline: the data with a margin, so the line uses the height it has. The instrument's
 * full range (min..max) is far wider than a sensor ever moves, which squashed every line flat; including the normal
 * band did the same (a reading moves a few percent of the band). `normalMin`/`normalMax` only set a minimum span, so a
 * reading that barely moves is not stretched into noise.
 */
export function sparklineDomain(data: number[], normalMin: number, normalMax: number) {
  const values = data.filter(Number.isFinite);
  const lo = values.length ? Math.min(...values) : normalMin;
  const hi = values.length ? Math.max(...values) : normalMax;
  const minSpan = (normalMax - normalMin) * 0.1 || Math.abs(hi) * 0.02 || 1;
  const span = Math.max(hi - lo, minSpan);
  const mid = (hi + lo) / 2;
  const pad = span * 0.25;
  return { min: mid - span / 2 - pad, max: mid + span / 2 + pad };
}
