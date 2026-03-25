'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RARITY_CONFIG } from '@/lib/constants';
import CoinDisplay from '@/components/CoinDisplay';
import { openBag } from '@/app/actions/open-bag';
import OpeningSequence from '@/components/OpeningSequence';

interface Props {
  coins: number;
  bags: any[];
}

const BAG_EMOJIS: Record<string, string> = {
  'Classic NeeDoh Bag': '🎒',
  'Dumpling Mystery Box': '🥡',
  'Groovy Mix Bag': '🎁',
  'Rare Seeker Box': '💎',
  'Mythic Vault': '🏆',
  'Season Special': '🌸',
};

export default function StoreClient({ coins: initialCoins, bags }: Props) {
  const [coins, setCoins] = useState(initialCoins);
  const [hoveredBag, setHoveredBag] = useState<string | null>(null);
  const [openingBag, setOpeningBag] = useState<any>(null);
  const [pullResult, setPullResult] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBuyBag = (bag: any) => {
    if (coins < bag.cost_coins || isPending) return;
    setOpeningBag(bag);

    startTransition(async () => {
      try {
        const result = await openBag(bag.id);
        setPullResult(result);
        setCoins(result.newCoinBalance);
      } catch (err: any) {
        console.error(err);
        setOpeningBag(null);
      }
    });
  };

  const handleOpeningDone = () => {
    setOpeningBag(null);
    setPullResult(null);
    router.refresh();
  };

  return (
    <>
      <div className="px-5 py-5" style={{ animation: 'fade-in 0.3s ease' }}>
        <h1 className="text-3xl font-bold text-center mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Blind Bag Store
        </h1>
        <p className="text-sm text-center mb-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          Choose a bag and discover what&apos;s inside!
        </p>

        <div className="grid grid-cols-2 gap-4">
          {bags.map((bag) => {
            const canAfford = coins >= bag.cost_coins;
            const emoji = BAG_EMOJIS[bag.name] || '🎒';
            const isLimited = bag.available_until != null;

            return (
              <button
                key={bag.id}
                onClick={() => handleBuyBag(bag)}
                onMouseEnter={() => setHoveredBag(bag.id)}
                onMouseLeave={() => setHoveredBag(null)}
                disabled={!canAfford || isPending}
                className="flex flex-col items-center gap-2 p-5 text-center relative"
                style={{
                  background: canAfford ? 'white' : '#F8F4FC',
                  borderRadius: 24,
                  border: `2px solid ${canAfford ? 'rgba(255,133,194,0.2)' : '#E8E0F0'}`,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  boxShadow: hoveredBag === bag.id && canAfford
                    ? '0 8px 30px rgba(255,133,194,0.25)'
                    : '0 4px 16px rgba(200,168,245,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: hoveredBag === bag.id && canAfford ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
                  opacity: canAfford ? 1 : 0.6,
                  animation: canAfford ? 'bag-jiggle 4s ease-in-out infinite' : 'none',
                }}
              >
                {isLimited && (
                  <div
                    className="absolute -top-2 -right-2 text-white text-xs font-bold px-2.5 py-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #FF6B6B, #FF85C2)',
                      borderRadius: 9999,
                      boxShadow: '0 2px 8px rgba(255,107,107,0.3)',
                    }}
                  >
                    LIMITED
                  </div>
                )}

                <span className="text-5xl">{emoji}</span>
                <span
                  className="text-sm font-semibold leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  {bag.name}
                </span>

                {/* Rarity percentages */}
                <div className="flex gap-1 flex-wrap justify-center">
                  {Object.entries(bag.rarity_table as Record<string, number>)
                    .filter(([, v]) => v > 0)
                    .map(([r, v]) => (
                      <span
                        key={r}
                        className="text-[10px] px-1.5 py-0.5 rounded-lg font-semibold"
                        style={{
                          background: RARITY_CONFIG[r as keyof typeof RARITY_CONFIG]?.bg || '#eee',
                          color: RARITY_CONFIG[r as keyof typeof RARITY_CONFIG]?.color || '#999',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {v}% {r[0].toUpperCase()}
                      </span>
                    ))}
                </div>

                {/* Price */}
                <div
                  className="mt-1 px-5 py-2 rounded-full text-base font-semibold"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    background: canAfford ? 'linear-gradient(135deg, #FFE87C, #FFD700)' : '#E8E0F0',
                    color: canAfford ? 'var(--text-primary)' : 'var(--text-secondary)',
                    boxShadow: canAfford ? '0 2px 10px rgba(255,215,0,0.3)' : 'none',
                  }}
                >
                  {canAfford ? `${bag.cost_coins} coins` : `Need ${bag.cost_coins - coins} more`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opening Sequence Overlay */}
      {openingBag && (
        <OpeningSequence
          bag={openingBag}
          result={pullResult}
          onDone={handleOpeningDone}
        />
      )}
    </>
  );
}
