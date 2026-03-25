'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CoinDisplay from '@/components/CoinDisplay';
import SquishySVG from '@/components/SquishySVG';
import RarityBadge from '@/components/RarityBadge';
import { RARITY_CONFIG } from '@/lib/constants';

interface Props {
  profile: any;
  collection: any[];
  pullHistory: any[];
}

export default function ProfileClient({ profile, collection, pullHistory }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const uniqueOwned = new Set(collection.map((c) => c.squishy_id)).size;
  const totalSquishes = collection.reduce((sum, c) => sum + (c.times_squished || 0), 0);

  const rarityOrder: Record<string, number> = { mythic: 4, rare: 3, uncommon: 2, common: 1 };
  const rarestPull = pullHistory.length > 0
    ? pullHistory.reduce((best, p) =>
        (rarityOrder[p.squishy?.rarity] || 0) > (rarityOrder[best.squishy?.rarity] || 0) ? p : best
      )
    : null;

  const stats = [
    { label: 'Bags Opened', value: profile?.total_bags_opened || 0, icon: '🎒' },
    { label: 'Unique Squishies', value: uniqueOwned, icon: '📦' },
    { label: 'Total Squishes', value: totalSquishes.toLocaleString(), icon: '🫧' },
    { label: 'Current Streak', value: `${profile?.streak_days || 0} days`, icon: '🔥' },
    { label: 'Rarest Pull', value: rarestPull?.squishy?.name || 'None yet', icon: '✨' },
    { label: 'Coins', value: (profile?.coins || 0).toLocaleString(), icon: '💰' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="px-5 py-5" style={{ animation: 'fade-in 0.3s ease' }}>
      {/* Avatar & Name */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-22 h-22 rounded-full flex items-center justify-center text-4xl text-white mb-3.5"
          style={{
            width: 88, height: 88,
            background: 'linear-gradient(135deg, #FF85C2, #C8A8F5, #5BB8FF)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            boxShadow: '0 8px 30px rgba(255,133,194,0.3)',
          }}
        >
          {profile?.username?.[0]?.toUpperCase() || 'S'}
        </div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {profile?.username || 'Squisher'}
        </h1>
        <div className="mt-2">
          <CoinDisplay amount={profile?.coins || 0} size="lg" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-4"
            style={{
              background: 'white',
              borderRadius: 20,
              boxShadow: '0 4px 16px rgba(200,168,245,0.1)',
              animation: `slide-up 0.4s ${i * 0.08}s ease both`,
            }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl" style={{ fontFamily: 'var(--font-accent)', color: 'var(--text-primary)' }}>
              {stat.value}
            </div>
            <div className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Pulls */}
      {pullHistory.length > 0 && (
        <div className="mt-7">
          <h2 className="text-xl mb-3.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Recent Pulls
          </h2>
          <div className="flex flex-col gap-2">
            {pullHistory.map((pull, i) => {
              const s = pull.squishy;
              if (!s) return null;
              const shapeIdx = s.name.length % 8;
              return (
                <div
                  key={pull.id}
                  className="flex items-center gap-3 p-3"
                  style={{
                    background: 'white',
                    borderRadius: 16,
                    boxShadow: '0 2px 10px rgba(200,168,245,0.08)',
                    animation: `slide-up 0.3s ${i * 0.05}s ease both`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: RARITY_CONFIG[s.rarity as keyof typeof RARITY_CONFIG]?.bg || '#eee' }}
                  >
                    <SquishySVG shapeIdx={shapeIdx} size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                      {s.name}
                    </div>
                    <RarityBadge rarity={s.rarity} />
                  </div>
                  <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                    {pull.bag_type?.name || 'Bag'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 py-3 rounded-full text-sm font-semibold border-none cursor-pointer"
        style={{
          background: 'rgba(255,107,107,0.1)',
          color: '#FF6B6B',
          fontFamily: 'var(--font-body)',
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
