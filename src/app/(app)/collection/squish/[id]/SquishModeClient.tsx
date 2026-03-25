'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SquishySVG from '@/components/SquishySVG';
import RarityBadge from '@/components/RarityBadge';
import Confetti from '@/components/Confetti';
import { RARITY_CONFIG } from '@/lib/constants';
import { updateSquishCount, toggleFavorite } from '@/app/actions/squish';

interface Props {
  item: any;
}

export default function SquishModeClient({ item }: Props) {
  const squishy = item.squishy;
  const router = useRouter();
  const [isSquishing, setIsSquishing] = useState(false);
  const [squishCount, setSquishCount] = useState(item.times_squished || 0);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [isFavorite, setIsFavorite] = useState(item.is_favorite || false);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shapeIdx = squishy.name.length % 8;
  const rarityConfig = RARITY_CONFIG[squishy.rarity as keyof typeof RARITY_CONFIG];

  const handleSquishDown = useCallback(() => {
    setIsSquishing(true);
    setScaleX(1.3);
    setScaleY(0.7);

    setSquishCount((prev: number) => {
      const next = prev + 1;
      // Debounce save to server
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        updateSquishCount(item.id, next);
      }, 2000);
      return next;
    });

    setComboCount((prev) => {
      const next = prev + 1;
      if (next >= 10) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1500);
        return 0;
      }
      return next;
    });

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setComboCount(0), 5000);
  }, [item.id]);

  const handleSquishUp = useCallback(() => {
    setIsSquishing(false);
    setScaleX(0.9);
    setScaleY(1.15);
    setTimeout(() => {
      setScaleX(1.05);
      setScaleY(0.95);
      setTimeout(() => {
        setScaleX(1);
        setScaleY(1);
      }, 150);
    }, 150);
  }, []);

  const handleToggleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    toggleFavorite(item.id, next);
  };

  // Save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      updateSquishCount(item.id, squishCount);
    };
  }, [item.id, squishCount]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: `linear-gradient(180deg, var(--surface-bg), ${rarityConfig?.bg || '#F0E5FF'})`,
        animation: 'fade-in 0.3s ease',
      }}
    >
      {showCombo && (
        <Confetti count={30} colors={['#FF85C2', '#C8A8F5', '#FFD700', '#5BB8FF']} />
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-xl border-none cursor-pointer text-sm font-semibold"
          style={{
            background: 'white',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 2px 10px rgba(200,168,245,0.15)',
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleToggleFavorite}
          className="px-4 py-2.5 rounded-xl border-none cursor-pointer text-xl"
          style={{ background: 'white', boxShadow: '0 2px 10px rgba(200,168,245,0.15)' }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Squishy Area */}
      <div
        className="flex-1 flex flex-col items-center justify-center relative select-none"
        style={{ WebkitUserSelect: 'none' }}
      >
        {showCombo && (
          <div
            className="absolute top-[10%] z-10 text-4xl"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-bubble-pink)',
              animation: 'reveal-glow 0.5s ease',
              textShadow: '0 0 20px rgba(255,133,194,0.5)',
            }}
          >
            🎉 COMBO! 🎉
          </div>
        )}

        <div
          onMouseDown={handleSquishDown}
          onMouseUp={handleSquishUp}
          onMouseLeave={() => isSquishing && handleSquishUp()}
          onTouchStart={handleSquishDown}
          onTouchEnd={handleSquishUp}
          style={{
            cursor: 'pointer',
            transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
            transition: isSquishing
              ? 'transform 0.15s cubic-bezier(0.22, 1.0, 0.36, 1.0)'
              : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: isSquishing ? 'brightness(0.95)' : 'brightness(1)',
            animation: !isSquishing && scaleX === 1 ? 'squishy-float 3s ease-in-out infinite' : 'none',
          }}
        >
          <SquishySVG shapeIdx={shapeIdx} size={220} />
        </div>

        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          {squishCount < 3 ? '👆 Press and hold to squish!' : 'Keep squishing!'}
        </p>
      </div>

      {/* Info Panel */}
      <div
        className="px-6 py-6"
        style={{
          background: 'white',
          borderRadius: '28px 28px 0 0',
          boxShadow: '0 -4px 30px rgba(200,168,245,0.15)',
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {squishy.name}
            </h2>
            <RarityBadge rarity={squishy.rarity} />
          </div>
          <div className="text-right" style={{ fontFamily: 'var(--font-accent)' }}>
            <div className="text-3xl" style={{ color: 'var(--color-bubble-pink)' }}>
              {squishCount.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              squishes
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          <span>{squishy.color_variant}</span>
          <span>·</span>
          <span>{squishy.series}</span>
        </div>

        {/* Combo progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            <span>Combo progress</span>
            <span>{comboCount}/10</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0E5FF' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(comboCount / 10) * 100}%`,
                background: 'linear-gradient(90deg, #FF85C2, #C8A8F5)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
