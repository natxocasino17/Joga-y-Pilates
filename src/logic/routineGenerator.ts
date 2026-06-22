/**
 * Routine generator.
 *
 * Given a user profile + a date (and an optional salt to reshuffle), it builds
 * a personalized session: a gentle warm-up, a main block biased toward the
 * user's chosen zones/goals, and a calming cool-down — filtered by level and
 * by any injuries to avoid, then trimmed to fit the target session length.
 *
 * Selection is deterministic per (date + salt) so the "routine of the day" is
 * stable across app restarts, but the user can request a fresh one.
 */
import { exercises } from '@/data/exercises';
import { BodyZone, Exercise, Goal, Level, Routine, RoutineItem, UserProfile } from '@/data/types';

// ── seeded RNG (mulberry32) so a given seed always yields the same routine ──
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SEC_PER_REP = 3.2;

const LEVEL_SCALE: Record<Level, { dur: number; reps: number; rest: number }> = {
  beginner: { dur: 0.85, reps: 0.8, rest: 1.35 },
  intermediate: { dur: 1, reps: 1, rest: 1 },
  advanced: { dur: 1.25, reps: 1.3, rest: 0.75 },
};

/** Estimated seconds an exercise will take with a given prescription. */
function estimateItemSeconds(ex: Exercise, durationSec: number, reps: number, restSec: number): number {
  const work = ex.mode === 'reps' ? reps * SEC_PER_REP : durationSec;
  const sides = ex.bilateral ? 2 : 1;
  return work * sides + restSec;
}

function resolvePrescription(ex: Exercise, level: Level): { durationSec: number; reps: number; restSec: number } {
  const scale = LEVEL_SCALE[level];
  const durationSec = Math.round((ex.durationSec * scale.dur) / 5) * 5 || ex.durationSec;
  const reps = ex.reps ? Math.max(4, Math.round(ex.reps * scale.reps)) : 0;
  // Rest scales with intensity: strength/cardio get a bit more breathing room.
  const baseRest = ex.goals.includes('relaxation') ? 5 : ex.mode === 'reps' ? 20 : 15;
  const restSec = Math.round(baseRest * scale.rest);
  return { durationSec, reps, restSec };
}

/** Higher score = better match for this user. */
function scoreExercise(ex: Exercise, zones: BodyZone[], goals: Goal[]): number {
  let score = 0;
  for (const z of ex.zones) if (zones.includes(z)) score += 3;
  for (const g of ex.goals) if (goals.includes(g)) score += 2;
  return score;
}

function isWarmup(ex: Exercise): boolean {
  return ex.goals.includes('mobility') || ex.goals.includes('energy');
}

function isCooldown(ex: Exercise): boolean {
  return ex.goals.includes('relaxation') || ex.goals.includes('flexibility');
}

export interface GenerateOptions {
  profile: UserProfile;
  date: string; // yyyy-mm-dd
  salt?: number; // bump to reshuffle for the same day
}

export function generateRoutine({ profile, date, salt = 0 }: GenerateOptions): Routine {
  const rng = makeRng(hashString(date) ^ (salt * 0x9e3779b1) ^ hashString(profile.focus.join(',') + profile.level));
  const disciplines = profile.focus;

  // 1. Filter by discipline, level and injuries.
  const pool = exercises.filter(
    (ex) =>
      disciplines.includes(ex.discipline) &&
      ex.levels.includes(profile.level) &&
      !ex.avoidWith.some((inj) => profile.injuries.includes(inj))
  );

  // 2. Rank by match score, with a touch of randomness so days vary.
  const ranked = [...pool].sort((a, b) => {
    const sa = scoreExercise(a, profile.zones, profile.goals) + rng() * 4;
    const sb = scoreExercise(b, profile.zones, profile.goals) + rng() * 4;
    return sb - sa;
  });

  const warmups = ranked.filter(isWarmup);
  const cooldowns = ranked.filter(isCooldown);
  const targetSec = profile.sessionMinutes * 60;

  const used = new Set<string>();
  const items: RoutineItem[] = [];
  let elapsed = 0;

  const pushItem = (ex: Exercise) => {
    if (used.has(ex.id)) return false;
    const { durationSec, reps, restSec } = resolvePrescription(ex, profile.level);
    const cost = estimateItemSeconds(ex, durationSec, reps, restSec);
    used.add(ex.id);
    items.push({
      exerciseId: ex.id,
      durationSec: ex.mode === 'reps' ? undefined : durationSec,
      reps: ex.mode === 'reps' ? reps : undefined,
      restSec,
      side: ex.bilateral ? 'both' : undefined,
    });
    elapsed += cost;
    return true;
  };

  // 3. Warm-up: 1 item for short sessions, 2 for longer ones.
  const warmupCount = profile.sessionMinutes >= 20 ? 2 : 1;
  for (const ex of warmups) {
    if (items.length >= warmupCount) break;
    pushItem(ex);
  }

  // Reserve room for a cool-down so we always end calm.
  const cooldownReserve = 80;

  // 4. Main block: fill toward the target, leaving room for the cool-down.
  for (const ex of ranked) {
    if (elapsed >= targetSec - cooldownReserve) break;
    if (isCooldown(ex) && !isWarmup(ex)) continue; // save pure stretches for the end
    pushItem(ex);
  }

  // If we under-filled (small pool), allow cooldown-ish exercises into the body.
  if (items.length < 3) {
    for (const ex of ranked) {
      if (items.length >= 5) break;
      pushItem(ex);
    }
  }

  // 5. Cool-down: end with a relaxation/stretch exercise.
  for (const ex of cooldowns) {
    if (used.has(ex.id)) continue;
    pushItem(ex);
    break;
  }

  // No rest after the final item.
  if (items.length > 0) items[items.length - 1].restSec = 0;

  const estimatedSec = items.reduce((sum, it) => {
    const ex = exercises.find((e) => e.id === it.exerciseId)!;
    return sum + estimateItemSeconds(ex, it.durationSec ?? 0, it.reps ?? 0, it.restSec);
  }, 0);

  return {
    id: `${date}-${salt}`,
    date,
    focus: profile.focus,
    level: profile.level,
    targetMinutes: profile.sessionMinutes,
    items,
    estimatedSec,
  };
}

/** Today's date as yyyy-mm-dd in local time. */
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
