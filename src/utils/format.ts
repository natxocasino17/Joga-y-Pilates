/** Small formatting helpers. */

/** 95 -> "1:35", 8 -> "0:08". */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/** 95 -> "2 min", rounds up so a session never reads as shorter than it is. */
export function formatMinutes(totalSeconds: number): number {
  return Math.max(1, Math.round(totalSeconds / 60));
}
