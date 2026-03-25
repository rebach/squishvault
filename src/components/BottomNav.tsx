'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/home', icon: '🏠', label: 'Home' },
  { href: '/store', icon: '🛍️', label: 'Store' },
  { href: '/collection', icon: '📦', label: 'Collection' },
  { href: '/leaderboard', icon: '🏆', label: 'Leaders' },
  { href: '/profile', icon: '👤', label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center z-50"
      style={{
        height: 72,
        background: 'white',
        borderTop: '1px solid rgba(200,168,245,0.2)',
        boxShadow: '0 -4px 20px rgba(200,168,245,0.1)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all"
            style={{
              color: isActive ? 'var(--color-bubble-pink)' : 'var(--text-secondary)',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            {isActive && (
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--color-bubble-pink)' }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
