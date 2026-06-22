/** Small formatting helpers. */
import { Discipline } from '@/theme/theme';

/** Joins the chosen disciplines for display, e.g. "Yoga · Pilates". */
export function focusLabel(t: (path: string) => string, focus: Discipline[]): string {
  return focus.map((d) => t(`disciplines.${d}`)).join(' · ');
}

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

/** Darkens a #rrggbb color by `amount` (0-1) — used to build a gradient end-stop from a single accent. */
export function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}
