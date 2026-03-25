'use client';

import { useState } from 'react';
import { RARITY_CONFIG } from '@/lib/constants';
import RarityBadge from '@/components/RarityBadge';

interface Props {
  rarePulls: any[];
  topOpeners: any[];
}

export default function LeaderboardClient({ rarePulls, topOpeners }: Props) {
  const [tab, setTab] = useState<'rare' | 'openers'>('rare');

  return (
    <div className="px-5 py-5" style={{ animation: 'fade-in 0.3s ease' }}>
      <h1
        className="text-3xl font-bold text-center mb-1.5"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
      >
        Leaderboard
      </h1>
      <p
        className="text-sm text-center mb-5"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
      >
        See who&apos;s pulling the rarest finds!
      </p>

      {/* Tabs */}
      <div
        className="flex mb-5 p-1 rounded-full"
        style={{ background: '#F0E5FF' }}
      >
        {(['rare', 'openers'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold border-none cursor-pointer transition-all"
            style={{
              fontFamily: 'var(--font-body)',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--color-bubble-pink)' : 'var(--text-secondary)',
              boxShadow: tab === t ? '0 2px 12px rgba(200,168,245,0.2)' : 'none',
            }}
          >
            {t === 'rare' ? 'Rare Pulls' : 'Top Openers'}
          </button>
        ))}
      </div>

      {/* Rare Pulls Tab */}
      {tab === 'rare' && (
        <div className="flex flex-col gap-2.5">
          {rarePulls.length === 0 ? (
            <div
              className="p-8 text-center"
              style={{
                background: 'white',
                borderRadius: 20,
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
              }}
            >
              No rare pulls this week yet!
            </div>
          ) : (
            rarePulls.map((pull, i) => (
              <div
                key={pull.id}
                className="flex items-center gap-3 p-3.5"
                style={{
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(200,168,245,0.1)',
                  animation: `slide-up 0.4s ${i * 0.05}s ease both`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: i < 3
                      ? 'linear-gradient(135deg, #FFE87C, #FFD700)'
                      : '#F0E5FF',
                    color: i < 3 ? '#2D1B4E' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-accent)',
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {pull.profile?.username || 'Unknown'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-xs"
                      style={{
                        color: RARITY_CONFIG[pull.squishy?.rarity as keyof typeof RARITY_CONFIG]?.color,
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {pull.squishy?.name}
                    </span>
                  </div>
                </div>
                <RarityBadge rarity={pull.squishy?.rarity} />
              </div>
            ))
          )}
        </div>
      )}

      {/* Top Openers Tab */}
      {tab === 'openers' && (
        <div className="flex flex-col gap-2.5">
          {topOpeners.length === 0 ? (
            <div
              className="p-8 text-center"
              style={{
                background: 'white',
                borderRadius: 20,
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
              }}
            >
              No data yet!
            </div>
          ) : (
            topOpeners.map((opener, i) => (
              <div
                key={opener.id}
                className="flex items-center gap-3 p-3.5"
                style={{
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(200,168,245,0.1)',
                  animation: `slide-up 0.4s ${i * 0.05}s ease both`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                      : i === 1
                      ? 'linear-gradient(135deg, #E0E0E0, #B0B0B0)'
                      : i === 2
                      ? 'linear-gradient(135deg, #DBA76E, #B8860B)'
                      : '#F0E5FF',
                    color: i < 3 ? 'white' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-accent)',
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {opener.username}
                  </span>
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-bubble-pink)' }}
                >
                  {opener.total_bags_opened} bags
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
