'use client';

import { RARITY_CONFIG, type RarityType } from '@/lib/constants';

export default function RarityBadge({ rarity, large = false }: { rarity: RarityType; large?: boolean }) {
  const cfg = RARITY_CONFIG[rarity];
  const bgMap: Record<string, string> = {
    mythic: 'linear-gradient(135deg, #FFD700, #FFA500)',
    rare: 'linear-gradient(135deg, #B97FFF, #8B5CF6)',
    uncommon: 'linear-gradient(135deg, #5BB8FF, #3B9FE8)',
    common: '#E8EDF2',
  };

  return (
    <span
      className={large ? 'text-base px-4 py-1.5' : 'text-xs px-3 py-1'}
      style={{
        display: 'inline-block',
        borderRadius: 9999,
        fontFamily: 'var(--font-accent)',
        fontWeight: 600,
        color: rarity === 'common' ? 'var(--text-secondary)' : 'white',
        background: bgMap[rarity],
        boxShadow: rarity === 'rare' || rarity === 'mythic' ? cfg.glow : 'none',
        animation: rarity === 'mythic' ? 'mythic-pulse 2s infinite' : rarity === 'rare' ? 'rare-shimmer 2s infinite' : 'none',
        letterSpacing: 0.5,
      }}
    >
      {rarity === 'mythic' && '✨ '}{cfg.label}{rarity === 'mythic' && ' ✨'}
    </span>
  );
}
