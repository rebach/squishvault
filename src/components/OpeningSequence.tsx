'use client';

import { useState, useEffect } from 'react';
import SquishySVG from './SquishySVG';
import RarityBadge from './RarityBadge';
import Confetti from './Confetti';
import { RARITY_CONFIG } from '@/lib/constants';
import { playSound, preloadSounds } from '@/lib/sounds';

interface Props {
  bag: any;
  result: any | null;
  onDone: () => void;
}

const BAG_EMOJIS: Record<string, string> = {
  'Classic NeeDoh Bag': '🎒',
  'Dumpling Mystery Box': '🥡',
  'Groovy Mix Bag': '🎁',
  'Rare Seeker Box': '💎',
  'Mythic Vault': '🏆',
  'Season Special': '🌸',
};

export default function OpeningSequence({ bag, result, onDone }: Props) {
  const [phase, setPhase] = useState<'shake' | 'reveal' | 'show'>('shake');

  useEffect(() => {
    preloadSounds(['bag-crinkle', 'bag-rip', 'reveal-common', 'reveal-uncommon', 'reveal-rare', 'reveal-mythic', 'celebration']);
    playSound('bag-crinkle');
  }, []);

  useEffect(() => {
    if (result) {
      const t = setTimeout(() => {
        playSound('bag-rip');
        setPhase('reveal');
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [result]);

  useEffect(() => {
    if (phase === 'reveal') {
      const t = setTimeout(() => {
        const rKey = result?.squishy?.rarity || 'common';
        playSound(`reveal-${rKey}` as any);
        if (rKey === 'rare' || rKey === 'mythic') {
          playSound('celebration');
        }
        setPhase('show');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, result]);

  const squishy = result?.squishy;
  const rarity = squishy?.rarity;
  const rarityConfig = rarity ? RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG] : null;
  const shapeIdx = squishy ? squishy.name.length % 8 : 0;
  const emoji = BAG_EMOJIS[bag.name] || '🎒';
  const showConfetti = phase === 'show' && (rarity === 'rare' || rarity === 'mythic');

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: phase === 'shake'
          ? 'linear-gradient(135deg, #2D1B4E, #1A1028)'
          : rarity === 'mythic'
          ? 'linear-gradient(135deg, #1A1028, #3D2B0A)'
          : 'linear-gradient(135deg, #1A1028, #2D1B4E)',
        transition: 'background 0.6s ease',
      }}
    >
      {showConfetti && (
        <Confetti
          count={rarity === 'mythic' ? 80 : 40}
          colors={
            rarity === 'mythic'
              ? ['#FFD700', '#FFA500', '#FFE87C', '#FF85C2', '#FFFFFF']
              : ['#B97FFF', '#C8A8F5', '#FF85C2', '#5BB8FF', '#FFFFFF']
          }
        />
      )}

      {/* Shake phase */}
      {phase === 'shake' && (
        <div style={{ animation: 'bag-shake 0.6s ease-in-out infinite', fontSize: 120, filter: 'drop-shadow(0 0 30px rgba(255,133,194,0.4))' }}>
          {emoji}
        </div>
      )}

      {/* Reveal glow phase */}
      {phase === 'reveal' && rarityConfig && (
        <div
          className="flex items-center justify-center"
          style={{
            width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${rarityConfig.color}44, transparent)`,
            animation: 'reveal-glow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          <div
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: rarityConfig.color,
              boxShadow: `0 0 60px ${rarityConfig.color}`,
            }}
          />
        </div>
      )}

      {/* Show squishy phase */}
      {phase === 'show' && squishy && rarityConfig && (
        <div className="flex flex-col items-center gap-6" style={{ animation: 'reveal-glow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
          <div
            className="p-5 rounded-full"
            style={{
              background: `radial-gradient(circle, ${rarityConfig.color}22, transparent)`,
              boxShadow: rarityConfig.glow,
              animation: rarity === 'mythic' ? 'mythic-pulse 2s infinite' : rarity === 'rare' ? 'rare-shimmer 2s infinite' : 'none',
            }}
          >
            <SquishySVG shapeIdx={shapeIdx} size={160} />
          </div>

          <div className="text-center" style={{ animation: 'slide-up 0.5s 0.3s ease both' }}>
            <RarityBadge rarity={rarity as any} large />
            <h2 className="text-3xl font-bold text-white mt-3 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {squishy.name}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(245,238,255,0.53)' }}>
              {squishy.color_variant} · {squishy.series}
            </p>
            {result.isDuplicate && (
              <p className="text-sm mt-2" style={{ color: 'var(--color-coral-blush)' }}>
                (Duplicate — you already have this one!)
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-4" style={{ animation: 'slide-up 0.5s 0.6s ease both' }}>
            <button
              onClick={onDone}
              className="px-8 py-3.5 rounded-full text-white text-lg font-bold border-none cursor-pointer"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, #FF85C2, #FF6BA8)',
                boxShadow: '0 4px 20px rgba(255,133,194,0.5)',
              }}
            >
              Awesome! 🫧
            </button>
          </div>
        </div>
      )}

      {/* Loading state while waiting for server */}
      {phase === 'shake' && !result && (
        <p className="text-white mt-4 text-sm opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
          Opening...
        </p>
      )}
    </div>
  );
}
