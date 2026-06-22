/** A soft diffused radial-gradient halo — the "difuminación" accent used behind hero art and icons. */
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

interface GlowProps {
  color?: string;
  opacity?: number;
  cx?: string;
  cy?: string;
  r?: string;
}

export function Glow({ color = '#FFFFFF', opacity = 0.35, cx = '50%', cy = '30%', r = '75%' }: GlowProps) {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <RadialGradient id="glow" cx={cx} cy={cy} r={r}>
          <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#glow)" />
    </Svg>
  );
}
