/**
 * PoseIllustration — a single parametric line-art figure renderer.
 *
 * Each pose is authored as a head position plus a set of polylines (limbs and
 * torso) on a 100×100 canvas with the floor near y=90. Rounded line caps and a
 * soft ground line give every exercise a consistent, minimalist look without
 * shipping dozens of separate assets.
 */
import React from 'react';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { IllustrationKey } from '@/data/types';

interface Pose {
  head: [number, number];
  /** Each entry is a polyline: a flat list of [x, y] points. */
  lines: [number, number][][];
}

const HEAD_R = 7;

// Reusable limb fragments keep authoring readable.
const POSES: Record<IllustrationKey, Pose> = {
  mountain: {
    head: [50, 16],
    lines: [
      [[50, 23], [50, 60]],
      [[50, 30], [40, 54]],
      [[50, 30], [60, 54]],
      [[50, 60], [44, 90]],
      [[50, 60], [56, 90]],
    ],
  },
  forwardFold: {
    head: [50, 58],
    lines: [
      [[50, 38], [50, 52]],
      [[50, 52], [44, 70]],
      [[50, 52], [56, 70]],
      [[50, 38], [46, 90]],
      [[50, 38], [54, 90]],
    ],
  },
  warrior: {
    head: [62, 20],
    lines: [
      [[62, 27], [58, 58]],
      [[58, 36], [40, 30]],
      [[58, 36], [80, 30]],
      [[58, 58], [40, 90]],
      [[58, 58], [78, 90]],
      [[40, 90], [40, 62]],
    ],
  },
  tree: {
    head: [50, 16],
    lines: [
      [[50, 23], [50, 60]],
      [[50, 30], [50, 18]],
      [[50, 60], [50, 90]],
      [[50, 62], [38, 74]],
      [[38, 74], [50, 60]],
    ],
  },
  child: {
    head: [30, 64],
    lines: [
      [[36, 66], [66, 78]],
      [[66, 78], [78, 70]],
      [[36, 66], [22, 78]],
      [[66, 78], [62, 90]],
      [[66, 78], [74, 90]],
    ],
  },
  cobra: {
    head: [30, 50],
    lines: [
      [[36, 54], [60, 78]],
      [[60, 78], [86, 84]],
      [[36, 54], [34, 78]],
      [[34, 78], [44, 80]],
    ],
  },
  downDog: {
    head: [34, 56],
    lines: [
      [[30, 54], [52, 34]],
      [[52, 34], [74, 84]],
      [[30, 54], [22, 84]],
      [[52, 34], [50, 36]],
    ],
  },
  bridge: {
    head: [26, 70],
    lines: [
      [[32, 70], [56, 54]],
      [[56, 54], [78, 82]],
      [[78, 82], [78, 70]],
      [[32, 70], [28, 82]],
    ],
  },
  twist: {
    head: [52, 24],
    lines: [
      [[52, 31], [50, 58]],
      [[50, 44], [68, 50]],
      [[50, 58], [30, 64]],
      [[50, 58], [70, 70]],
    ],
  },
  seated: {
    head: [34, 34],
    lines: [
      [[34, 41], [40, 64]],
      [[40, 64], [82, 64]],
      [[40, 50], [70, 60]],
    ],
  },
  plank: {
    head: [22, 56],
    lines: [
      [[28, 58], [82, 70]],
      [[28, 58], [26, 78]],
      [[82, 70], [80, 84]],
    ],
  },
  sidebend: {
    head: [40, 24],
    lines: [
      [[42, 31], [56, 58]],
      [[48, 40], [70, 26]],
      [[48, 40], [34, 54]],
      [[56, 58], [40, 90]],
      [[56, 58], [76, 90]],
    ],
  },
  cat: {
    head: [28, 52],
    lines: [
      [[32, 52], [54, 44]],
      [[54, 44], [78, 54]],
      [[32, 52], [32, 80]],
      [[78, 54], [78, 80]],
    ],
  },
  boat: {
    head: [34, 40],
    lines: [
      [[38, 46], [50, 66]],
      [[50, 66], [78, 40]],
      [[40, 50], [66, 44]],
    ],
  },
  crunch: {
    head: [32, 54],
    lines: [
      [[37, 57], [54, 68]],
      [[54, 68], [42, 50]],
      [[54, 68], [76, 56]],
      [[76, 56], [70, 74]],
    ],
  },
  legRaise: {
    head: [24, 66],
    lines: [
      [[30, 68], [62, 74]],
      [[62, 74], [82, 50]],
      [[62, 74], [82, 74]],
    ],
  },
  squat: {
    head: [50, 20],
    lines: [
      [[50, 27], [50, 52]],
      [[50, 34], [38, 44]],
      [[50, 34], [62, 44]],
      [[50, 52], [38, 64]],
      [[38, 64], [40, 90]],
      [[50, 52], [62, 64]],
      [[62, 64], [60, 90]],
    ],
  },
  lunge: {
    head: [44, 22],
    lines: [
      [[44, 29], [46, 56]],
      [[46, 56], [30, 70]],
      [[30, 70], [30, 90]],
      [[46, 56], [72, 72]],
      [[72, 72], [86, 90]],
    ],
  },
  pushup: {
    head: [22, 60],
    lines: [
      [[28, 62], [84, 74]],
      [[28, 62], [30, 80]],
      [[50, 66], [50, 82]],
      [[84, 74], [82, 84]],
    ],
  },
  gluteBridge: {
    head: [22, 68],
    lines: [
      [[28, 68], [58, 56]],
      [[58, 56], [76, 78]],
      [[76, 78], [76, 88]],
    ],
  },
  deadbug: {
    head: [24, 60],
    lines: [
      [[30, 62], [70, 62]],
      [[44, 62], [40, 42]],
      [[58, 62], [76, 48]],
      [[70, 62], [78, 70]],
    ],
  },
  sidePlank: {
    head: [22, 50],
    lines: [
      [[28, 54], [82, 84]],
      [[28, 54], [28, 84]],
      [[44, 62], [44, 38]],
    ],
  },
  jumpingJack: {
    head: [50, 16],
    lines: [
      [[50, 23], [50, 58]],
      [[50, 28], [32, 16]],
      [[50, 28], [68, 16]],
      [[50, 58], [38, 90]],
      [[50, 58], [62, 90]],
    ],
  },
  rest: {
    head: [20, 66],
    lines: [
      [[26, 68], [84, 72]],
      [[40, 70], [42, 60]],
      [[64, 71], [66, 61]],
    ],
  },
};

export interface PoseIllustrationProps {
  name: IllustrationKey;
  color: string;
  size?: number;
  /** Floor line color; omit to hide the ground line. */
  groundColor?: string;
  strokeWidth?: number;
}

export function PoseIllustration({
  name,
  color,
  size = 120,
  groundColor,
  strokeWidth = 4,
}: PoseIllustrationProps) {
  const pose = POSES[name] ?? POSES.mountain;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {groundColor ? (
        <Line x1={12} y1={92} x2={88} y2={92} stroke={groundColor} strokeWidth={3} strokeLinecap="round" />
      ) : null}
      <Circle cx={pose.head[0]} cy={pose.head[1]} r={HEAD_R} stroke={color} strokeWidth={strokeWidth} fill="none" />
      {pose.lines.map((pts, i) => (
        <Polyline
          key={i}
          points={pts.map((p) => p.join(',')).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}
