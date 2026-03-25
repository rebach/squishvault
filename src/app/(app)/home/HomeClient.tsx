'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SquishySVG from '@/components/SquishySVG';
import Onboarding from '@/components/Onboarding';
import { RARITY_CONFIG, SQUISHY_SHAPES } from '@/lib/constants';
import { claimDailyReward } from '@/app/actions/claim-daily';
import { playSound } from '@/lib/sounds';

interface Props {
  profile: any;
  recentCollection: any[];
  dailyClaimed: boolean;
}

export default function HomeClient({ profile, recentCollection, dailyClaimed: initialClaimed }: Props) {
  const [claimed, setClaimed] = useState(initialClaimed);
  const [claimResult, setClaimResult] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show onboarding for new users (0 bags opened, first visit)
    if (profile?.total_bags_opened === 0 && !localStorage.getItem('sv_onboarded')) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingDone = () => {
    setShowOnboarding(false);
    try { localStorage.setItem('sv_onboarded', '1'); } catch {}
  };

  const handleClaimDaily = () => {
    startTransition(async () => {
      try {
        const result = await claimDailyReward();
        setClaimResult(result);
        setClaimed(true);
        playSound('daily-reward');
        playSound('coin-shower');
        router.refresh();
      } catch (err: any) {
        console.error(err);
      }
    });
  };

  const streak = profile?.streak_days || 0;

  const activityFeed = [
    { user: 'SquishFan99', action: 'pulled a', item: 'Mythic Golden Dumpling', rarity: 'mythic' as const, time: '2m ago' },
    { user: 'NeedohLover', action: 'opened their', item: '100th bag!', rarity: null, time: '5m ago' },
    { user: 'DumplingQueen', action: 'pulled a', item: 'Rare Dream Drop', rarity: 'rare' as const, time: '12m ago' },
  ];

  return (
    <>
    {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
    <div className="px-5 py-5" style={{ animation: 'fade-in 0.3s ease' }}>
      {/* Daily Reward Banner */}
      {!claimed ? (
        <button
          onClick={handleClaimDaily}
          disabled={isPending}
          className="w-full p-5 mb-6 text-center text-white border-3 border-white cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #FF85C2, #C8A8F5, #5BB8FF)',
            borderRadius: 20,
            boxShadow: '0 4px 30px rgba(255,133,194,0.35)',
            fontFamily: 'var(--font-display)',
            animation: 'pulse-border 2s ease infinite',
          }}
        >
          <div className="text-2xl mb-1">✨ Claim Today&apos;s Coins! ✨</div>
          <div className="text-sm opacity-90" style={{ fontFamily: 'var(--font-body)' }}>
            Day {streak + 1} — Earn {streak >= 3 ? 50 : streak === 2 ? 40 : streak === 1 ? 30 : 25} coins
            {streak === 6 && ' + 🔥 7-Day Streak Bonus!'}
          </div>
        </button>
      ) : (
        <div
          className="w-full p-4 mb-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(184,244,232,0.13), rgba(224,242,255,0.27))',
            borderRadius: 20,
            border: '1px solid rgba(184,244,232,0.4)',
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
          }}
        >
          ✅ Daily coins claimed!{claimResult && ` +${claimResult.coinsAwarded} coins`} Come back tomorrow!
        </div>
      )}

      {/* Quick Squish */}
      <div className="mb-7">
        <h2 className="text-xl mb-3.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Quick Squish
        </h2>
        {recentCollection.length > 0 ? (
          <div className="flex gap-3.5 overflow-x-auto pb-2">
            {recentCollection.map((item: any) => {
              const s = item.squishy;
              if (!s) return null;
              // Determine shapeIdx from squishy id hash
              const shapeIdx = s.name.length % 8;
              return (
                <Link
                  key={item.id}
                  href={`/collection/squish/${item.id}`}
                  className="flex-shrink-0 w-28 p-3.5 flex flex-col items-center gap-2 no-underline"
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    border: `2px solid ${RARITY_CONFIG[s.rarity as keyof typeof RARITY_CONFIG]?.color || '#ddd'}33`,
                    boxShadow: '0 4px 16px rgba(200,168,245,0.15)',
                    animation: 'squishy-float 3s ease-in-out infinite',
                  }}
                >
                  <SquishySVG shapeIdx={shapeIdx} size={70} series={s.series} />
                  <span
                    className="text-xs text-center truncate w-full"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {s.name}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="p-8 text-center"
            style={{
              background: 'white',
              borderRadius: 20,
              border: '2px dashed rgba(200,168,245,0.27)',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
            }}
          >
            No squishies yet! Visit the store to open your first bag 🎒
          </div>
        )}
      </div>

      {/* Open a Bag CTA */}
      <Link
        href="/store"
        className="flex items-center justify-center gap-2.5 w-full py-4 mb-7 text-white text-xl font-bold no-underline"
        style={{
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(135deg, #FF85C2, #FF6BA8)',
          borderRadius: 9999,
          boxShadow: '0 4px 20px rgba(255,133,194,0.4)',
        }}
      >
        🛍️ Open a Bag
      </Link>

      {/* Activity Feed */}
      <div>
        <h2 className="text-xl mb-3.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Activity
        </h2>
        <div className="flex flex-col gap-2.5">
          {activityFeed.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3.5 text-sm"
              style={{
                background: 'white',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(200,168,245,0.1)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-primary)',
                animation: `slide-up 0.4s ${i * 0.1}s ease both`,
              }}
            >
              <div>
                <strong>{item.user}</strong> {item.action}{' '}
                <span
                  className="font-semibold"
                  style={{ color: item.rarity ? RARITY_CONFIG[item.rarity]?.color : 'var(--text-primary)' }}
                >
                  {item.item}
                </span>
                {item.rarity === 'mythic' && ' 🤯'}
              </div>
              <span className="text-xs ml-2 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
