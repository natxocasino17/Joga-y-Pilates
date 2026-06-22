/**
 * Static catalogs for the selectable options (levels, disciplines, zones,
 * goals, injuries) plus session-length presets. Used by onboarding, settings
 * and the library filters. Labels resolve through i18n keys.
 */
import { Ionicons } from '@expo/vector-icons';
import { BodyZone, Focus, Goal, Injury, Level } from './types';

type IconName = keyof typeof Ionicons.glyphMap;

export const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];

export const FOCUSES: Focus[] = ['yoga', 'pilates', 'gym', 'mixed'];

export const SESSION_PRESETS = [5, 10, 15, 20, 30] as const;

export const ZONES: { id: BodyZone; icon: IconName }[] = [
  { id: 'core', icon: 'flame-outline' },
  { id: 'back', icon: 'body-outline' },
  { id: 'legs', icon: 'walk-outline' },
  { id: 'glutes', icon: 'fitness-outline' },
  { id: 'arms', icon: 'barbell-outline' },
  { id: 'shoulders', icon: 'accessibility-outline' },
  { id: 'chest', icon: 'heart-outline' },
  { id: 'hips', icon: 'sync-outline' },
  { id: 'fullBody', icon: 'person-outline' },
  { id: 'balance', icon: 'analytics-outline' },
];

export const GOALS: { id: Goal; icon: IconName }[] = [
  { id: 'flexibility', icon: 'resize-outline' },
  { id: 'strength', icon: 'barbell-outline' },
  { id: 'relaxation', icon: 'leaf-outline' },
  { id: 'posture', icon: 'man-outline' },
  { id: 'mobility', icon: 'sync-outline' },
  { id: 'energy', icon: 'flash-outline' },
];

export const INJURIES: { id: Injury; icon: IconName }[] = [
  { id: 'knee', icon: 'walk-outline' },
  { id: 'lowerBack', icon: 'body-outline' },
  { id: 'neck', icon: 'happy-outline' },
  { id: 'shoulder', icon: 'accessibility-outline' },
  { id: 'wrist', icon: 'hand-left-outline' },
  { id: 'hip', icon: 'sync-outline' },
  { id: 'ankle', icon: 'footsteps-outline' },
];

export const FOCUS_ICONS: Record<Focus, IconName> = {
  yoga: 'leaf-outline',
  pilates: 'body-outline',
  gym: 'barbell-outline',
  mixed: 'shapes-outline',
};
