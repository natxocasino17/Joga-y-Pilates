/**
 * Domain types shared across the app.
 */
import { Discipline } from '@/theme/theme';

export type Level = 'beginner' | 'intermediate' | 'advanced';

/** One or more disciplines the user wants in their routines. */
export type Focus = Discipline[];

export type BodyZone =
  | 'core'
  | 'back'
  | 'legs'
  | 'glutes'
  | 'arms'
  | 'shoulders'
  | 'chest'
  | 'hips'
  | 'fullBody'
  | 'balance';

export type Goal =
  | 'flexibility'
  | 'strength'
  | 'relaxation'
  | 'posture'
  | 'mobility'
  | 'energy';

export type Injury =
  | 'knee'
  | 'lowerBack'
  | 'neck'
  | 'shoulder'
  | 'wrist'
  | 'hip'
  | 'ankle';

/** Key into the PoseIllustration component's set of line-art figures. */
export type IllustrationKey =
  | 'mountain'
  | 'forwardFold'
  | 'warrior'
  | 'tree'
  | 'child'
  | 'cobra'
  | 'downDog'
  | 'bridge'
  | 'twist'
  | 'seated'
  | 'plank'
  | 'sidebend'
  | 'cat'
  | 'boat'
  | 'crunch'
  | 'legRaise'
  | 'squat'
  | 'lunge'
  | 'pushup'
  | 'gluteBridge'
  | 'deadbug'
  | 'sidePlank'
  | 'jumpingJack'
  | 'rest';

export interface LocalizedText {
  es: string;
  en: string;
}

export interface Exercise {
  id: string;
  discipline: Discipline;
  name: LocalizedText;
  /** One-line summary shown on cards. */
  summary: LocalizedText;
  /** Ordered, step-by-step cues. */
  steps: { es: string[]; en: string[] };
  /** Optional coaching tips. */
  tips: { es: string[]; en: string[] };
  /** Breathing cue. */
  breathing: LocalizedText;
  levels: Level[];
  zones: BodyZone[];
  goals: Goal[];
  /** Injuries this exercise should be avoided with. */
  avoidWith: Injury[];
  /** How the exercise is measured during a session. */
  mode: 'timed' | 'reps' | 'hold';
  /** Default duration in seconds (timed/hold) — base value for intermediate. */
  durationSec: number;
  /** Default reps (reps mode). */
  reps?: number;
  illustration: IllustrationKey;
  /** Whether both sides are performed (adds a second timed/rep block). */
  bilateral?: boolean;
}

/** A single step within a generated routine (an exercise + its prescription). */
export interface RoutineItem {
  exerciseId: string;
  /** Resolved duration in seconds for this session (timed/hold). */
  durationSec?: number;
  /** Resolved reps for this session. */
  reps?: number;
  /** Rest after this item, in seconds. */
  restSec: number;
  side?: 'left' | 'right' | 'both';
}

export interface Routine {
  id: string;
  /** ISO date string (yyyy-mm-dd) this routine was generated for. */
  date: string;
  focus: Focus;
  level: Level;
  /** Target total length in minutes the user asked for. */
  targetMinutes: number;
  items: RoutineItem[];
  /** Estimated total seconds (exercises + rest). */
  estimatedSec: number;
}

export interface UserProfile {
  name: string;
  focus: Focus;
  level: Level;
  sessionMinutes: number;
  zones: BodyZone[];
  goals: Goal[];
  injuries: Injury[];
}

export type ThemePreference = 'auto' | 'light' | 'dark';

export interface SessionRecord {
  /** ISO date (yyyy-mm-dd). */
  date: string;
  focus: Focus;
  durationSec: number;
  exerciseCount: number;
}

export interface Progress {
  sessions: SessionRecord[];
  currentStreak: number;
  bestStreak: number;
  totalSessions: number;
  totalSeconds: number;
}
