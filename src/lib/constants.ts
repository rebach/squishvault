export const COLORS = {
  bubblePink: '#FF85C2',
  mintCream: '#B8F4E8',
  lavenderPop: '#C8A8F5',
  butterYellow: '#FFE87C',
  coralBlush: '#FF9A8B',
  surfaceBg: '#FFF5FB',
  surfaceCard: '#FFFFFF',
  textPrimary: '#2D1B4E',
  textSecondary: '#7A6B8A',
} as const;

export const RARITY_CONFIG = {
  common:   { color: '#A8B8C8', bg: '#E8EDF2', label: 'Common',   glow: 'none' },
  uncommon: { color: '#5BB8FF', bg: '#E0F2FF', label: 'Uncommon', glow: '0 0 15px rgba(91,184,255,0.4)' },
  rare:     { color: '#B97FFF', bg: '#F0E5FF', label: 'Rare',     glow: '0 0 25px rgba(185,127,255,0.6)' },
  mythic:   { color: '#FFD700', bg: '#FFF8E0', label: 'Mythic',   glow: '0 0 40px rgba(255,215,0,0.8)' },
} as const;

export type RarityType = keyof typeof RARITY_CONFIG;

export const SQUISHY_SHAPES = [
  { shape: 'circle' as const, colors: ['#FF6B9D', '#FF85C2'] },
  { shape: 'blob1' as const,  colors: ['#7EC8E3', '#5BB8FF'] },
  { shape: 'blob2' as const,  colors: ['#98D89E', '#6BC975'] },
  { shape: 'blob3' as const,  colors: ['#FFB347', '#FF9A3C'] },
  { shape: 'blob4' as const,  colors: ['#DDA0DD', '#B97FFF'] },
  { shape: 'circle' as const, colors: ['#FFD700', '#FFC107'] },
  { shape: 'blob1' as const,  colors: ['#FF9A8B', '#FF6B6B'] },
  { shape: 'blob2' as const,  colors: ['#B8F4E8', '#7EDDC7'] },
] as const;
