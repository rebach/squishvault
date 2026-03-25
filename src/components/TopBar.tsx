'use client';

import CoinDisplay from './CoinDisplay';
import Link from 'next/link';

interface TopBarProps {
  username: string;
  coins: number;
  streak: number;
}

export default function TopBar({ username, coins, streak }: TopBarProps) {
  return (
    <header
      className="flex justify-between items-center px-5 py-4 sticky top-0 z-40"
      style={{
        background: 'white',
        borderBottom: '1px solid rgba(200,168,245,0.15)',
        boxShadow: '0 2px 12px rgba(200,168,245,0.08)',
      }}
    >
      <Link href="/profile" className="flex items-center gap-2.5 no-underline">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg text-white"
          style={{
            background: 'linear-gradient(135deg, #FF85C2, #C8A8F5)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            boxShadow: '0 2px 10px rgba(255,133,194,0.3)',
          }}
        >
          {username[0]?.toUpperCase()}
        </div>
        <span
          className="text-base"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}
        >
          {username}
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {streak > 0 && (
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(255,154,139,0.13), rgba(255,133,194,0.13))',
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-coral-blush)',
            }}
          >
            <span style={{ animation: 'streak-flame 1s ease infinite', display: 'inline-block' }}>🔥</span>
            {streak}
          </div>
        )}
        <div
          className="px-3.5 py-1.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #FFF8E0, rgba(255,232,124,0.2))',
            border: '1px solid rgba(255,232,124,0.4)',
          }}
        >
          <CoinDisplay amount={coins} size="sm" />
        </div>
      </div>
    </header>
  );
}
