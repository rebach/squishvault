'use client';

import { SQUISHY_SHAPES } from '@/lib/constants';

interface SquishySVGProps {
  shapeIdx: number;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function SquishySVG({ shapeIdx, size = 120, style = {}, className }: SquishySVGProps) {
  const { shape, colors } = SQUISHY_SHAPES[shapeIdx % SQUISHY_SHAPES.length];

  const paths: Record<string, string> = {
    circle: `M ${size/2},${size*0.1} C ${size*0.85},${size*0.1} ${size*0.9},${size*0.85} ${size/2},${size*0.9} C ${size*0.1},${size*0.85} ${size*0.15},${size*0.1} ${size/2},${size*0.1} Z`,
    blob1: `M ${size*0.5},${size*0.08} C ${size*0.8},${size*0.05} ${size*0.95},${size*0.35} ${size*0.88},${size*0.6} C ${size*0.82},${size*0.85} ${size*0.55},${size*0.95} ${size*0.35},${size*0.88} C ${size*0.1},${size*0.78} ${size*0.05},${size*0.45} ${size*0.15},${size*0.25} C ${size*0.25},${size*0.08} ${size*0.35},${size*0.1} ${size*0.5},${size*0.08} Z`,
    blob2: `M ${size*0.45},${size*0.06} C ${size*0.75},${size*0.02} ${size*0.92},${size*0.3} ${size*0.9},${size*0.55} C ${size*0.88},${size*0.8} ${size*0.6},${size*0.96} ${size*0.4},${size*0.92} C ${size*0.15},${size*0.87} ${size*0.06},${size*0.6} ${size*0.1},${size*0.38} C ${size*0.14},${size*0.15} ${size*0.28},${size*0.08} ${size*0.45},${size*0.06} Z`,
    blob3: `M ${size*0.5},${size*0.05} C ${size*0.78},${size*0.08} ${size*0.95},${size*0.38} ${size*0.85},${size*0.65} C ${size*0.75},${size*0.92} ${size*0.45},${size*0.98} ${size*0.25},${size*0.85} C ${size*0.05},${size*0.72} ${size*0.08},${size*0.35} ${size*0.2},${size*0.18} C ${size*0.32},${size*0.02} ${size*0.42},${size*0.03} ${size*0.5},${size*0.05} Z`,
    blob4: `M ${size*0.48},${size*0.05} C ${size*0.82},${size*0.0} ${size*0.98},${size*0.42} ${size*0.88},${size*0.68} C ${size*0.78},${size*0.94} ${size*0.48},${size*0.98} ${size*0.28},${size*0.88} C ${size*0.08},${size*0.78} ${size*0.02},${size*0.42} ${size*0.18},${size*0.2} C ${size*0.3},${size*0.05} ${size*0.38},${size*0.07} ${size*0.48},${size*0.05} Z`,
  };

  const gradientId = `grad-${shapeIdx}-${size}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style} className={className}>
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="35%">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors[1]} />
        </radialGradient>
      </defs>
      <path d={paths[shape]} fill={`url(#${gradientId})`} stroke={colors[1]} strokeWidth="1.5" />
      {/* Kawaii face */}
      <circle cx={size * 0.38} cy={size * 0.42} r={size * 0.04} fill="#2D1B4E" />
      <circle cx={size * 0.62} cy={size * 0.42} r={size * 0.04} fill="#2D1B4E" />
      <ellipse cx={size * 0.385} cy={size * 0.405} rx={size * 0.015} ry={size * 0.012} fill="white" />
      <ellipse cx={size * 0.625} cy={size * 0.405} rx={size * 0.015} ry={size * 0.012} fill="white" />
      <path
        d={`M ${size * 0.42},${size * 0.54} Q ${size * 0.5},${size * 0.62} ${size * 0.58},${size * 0.54}`}
        stroke="#2D1B4E" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      {/* Blush cheeks */}
      <ellipse cx={size * 0.28} cy={size * 0.52} rx={size * 0.06} ry={size * 0.035} fill="#FF85C2" opacity="0.3" />
      <ellipse cx={size * 0.72} cy={size * 0.52} rx={size * 0.06} ry={size * 0.035} fill="#FF85C2" opacity="0.3" />
    </svg>
  );
}
