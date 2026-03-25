'use client';

import { SQUISHY_SHAPES } from '@/lib/constants';

interface SquishySVGProps {
  shapeIdx: number;
  size?: number;
  series?: string;
  style?: React.CSSProperties;
  className?: string;
}

// Dumpling colors matching the photo - rainbow steamers
const DUMPLING_COLORS = [
  ['#FF6B9D', '#E85A8A'],   // pink
  ['#FF9A3C', '#E88830'],   // orange
  ['#FFE040', '#E6C830'],   // yellow
  ['#90E050', '#78C840'],   // green
  ['#5BB8FF', '#4AA0E0'],   // blue
  ['#B97FFF', '#A068E0'],   // purple
  ['#FFD700', '#E0B800'],   // gold (mythic)
  ['#FF6B9D', '#E85A8A'],   // pink repeat
];

function DumplingSVG({ shapeIdx, size }: { shapeIdx: number; size: number }) {
  const colors = DUMPLING_COLORS[shapeIdx % DUMPLING_COLORS.length];
  const cx = size / 2;
  const cy = size / 2;
  const gradId = `dgrad-${shapeIdx}-${size}`;

  // Steamer basket dimensions
  const basketW = size * 0.72;
  const basketH = size * 0.18;
  const basketX = cx - basketW / 2;
  const basketY = size * 0.62;

  // Dumpling body dimensions
  const dumpW = size * 0.56;
  const dumpH = size * 0.38;
  const dumpCx = cx;
  const dumpCy = basketY - dumpH * 0.08;

  // Pleats on top
  const pleatCount = 5;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={gradId} cx="40%" cy="30%">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colors[1]} />
        </radialGradient>
        <linearGradient id={`basket-${shapeIdx}-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D5B0" />
          <stop offset="50%" stopColor="#D4C098" />
          <stop offset="100%" stopColor="#C0A878" />
        </linearGradient>
      </defs>

      {/* Steamer basket - back rim */}
      <ellipse
        cx={cx}
        cy={basketY + basketH * 0.3}
        rx={basketW / 2}
        ry={basketH / 2}
        fill={`url(#basket-${shapeIdx}-${size})`}
        stroke="#B8A070"
        strokeWidth="1.2"
      />

      {/* Steamer basket - side */}
      <rect
        x={basketX}
        y={basketY - basketH * 0.15}
        width={basketW}
        height={basketH * 0.9}
        rx={3}
        fill={`url(#basket-${shapeIdx}-${size})`}
        stroke="#B8A070"
        strokeWidth="0"
      />

      {/* Bamboo texture lines on basket */}
      {[0.2, 0.5, 0.8].map((t, i) => (
        <line
          key={i}
          x1={basketX + 4}
          y1={basketY - basketH * 0.15 + basketH * 0.9 * t}
          x2={basketX + basketW - 4}
          y2={basketY - basketH * 0.15 + basketH * 0.9 * t}
          stroke="#B8A070"
          strokeWidth="0.6"
          opacity="0.5"
        />
      ))}

      {/* Dumpling body - half-dome shape */}
      <ellipse
        cx={dumpCx}
        cy={dumpCy}
        rx={dumpW / 2}
        ry={dumpH}
        fill={`url(#${gradId})`}
        stroke={colors[1]}
        strokeWidth="1.2"
      />

      {/* Clip the bottom half so dumpling sits in basket */}
      <rect
        x={0}
        y={dumpCy + dumpH * 0.08}
        width={size}
        height={size}
        fill={`url(#basket-${shapeIdx}-${size})`}
      />

      {/* Steamer basket - front rim */}
      <ellipse
        cx={cx}
        cy={basketY + basketH * 0.3}
        rx={basketW / 2}
        ry={basketH / 2}
        fill="none"
        stroke="#B8A070"
        strokeWidth="1.5"
      />

      {/* Pleats on top of dumpling */}
      {Array.from({ length: pleatCount }).map((_, i) => {
        const angle = ((i - (pleatCount - 1) / 2) / pleatCount) * 1.2;
        const px = dumpCx + Math.sin(angle) * dumpW * 0.2;
        const py = dumpCy - dumpH * 0.65;
        const bx = dumpCx + Math.sin(angle) * dumpW * 0.35;
        const by = dumpCy - dumpH * 0.15;
        return (
          <path
            key={i}
            d={`M ${px},${py} Q ${(px + bx) / 2 + Math.sin(angle) * 4},${(py + by) / 2 - 3} ${bx},${by}`}
            stroke={colors[1]}
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />
        );
      })}

      {/* Top pinch of dumpling */}
      <circle
        cx={dumpCx}
        cy={dumpCy - dumpH * 0.72}
        r={size * 0.025}
        fill={colors[1]}
        opacity="0.6"
      />

      {/* Kawaii face */}
      {/* Eyes */}
      <circle cx={dumpCx - size * 0.09} cy={dumpCy - dumpH * 0.15} r={size * 0.035} fill="#2D1B4E" />
      <circle cx={dumpCx + size * 0.09} cy={dumpCy - dumpH * 0.15} r={size * 0.035} fill="#2D1B4E" />

      {/* Eye highlights */}
      <ellipse cx={dumpCx - size * 0.085} cy={dumpCy - dumpH * 0.17} rx={size * 0.013} ry={size * 0.01} fill="white" />
      <ellipse cx={dumpCx + size * 0.095} cy={dumpCy - dumpH * 0.17} rx={size * 0.013} ry={size * 0.01} fill="white" />

      {/* Smile */}
      <path
        d={`M ${dumpCx - size * 0.06},${dumpCy + dumpH * 0.05} Q ${dumpCx},${dumpCy + dumpH * 0.2} ${dumpCx + size * 0.06},${dumpCy + dumpH * 0.05}`}
        stroke="#2D1B4E"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Blush cheeks */}
      <ellipse cx={dumpCx - size * 0.16} cy={dumpCy + dumpH * 0.02} rx={size * 0.045} ry={size * 0.03} fill="#FF85C2" opacity="0.35" />
      <ellipse cx={dumpCx + size * 0.16} cy={dumpCy + dumpH * 0.02} rx={size * 0.045} ry={size * 0.03} fill="#FF85C2" opacity="0.35" />
    </svg>
  );
}

export default function SquishySVG({ shapeIdx, size = 120, series, style = {}, className }: SquishySVGProps) {
  // If it's a dumpling series, render the dumpling variant
  if (series && series.toLowerCase().includes('dumpling')) {
    return (
      <div style={style} className={className}>
        <DumplingSVG shapeIdx={shapeIdx} size={size} />
      </div>
    );
  }

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
