'use client';

import { useState } from 'react';
import Link from 'next/link';
import SquishySVG from '@/components/SquishySVG';
import RarityBadge from '@/components/RarityBadge';
import { RARITY_CONFIG } from '@/lib/constants';

interface Props {
  collection: any[];
  totalPossible: number;
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'NeeDoh Classics', label: 'NeeDoh' },
  { id: 'Mystery Dumplings', label: 'Dumplings' },
  { id: 'Seasonal', label: 'Seasonal' },
  { id: 'favorites', label: '♥ Faves' },
];

export default function CollectionClient({ collection, totalPossible }: Props) {
  const [filter, setFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);

  const filtered = collection.filter((item) => {
    const s = item.squishy;
    if (!s) return false;
    if (filter === 'favorites') return item.is_favorite;
    if (filter !== 'all' && s.series !== filter) return false;
    if (rarityFilter && s.rarity !== rarityFilter) return false;
    return true;
  });

  const uniqueOwned = new Set(collection.map((c) => c.squishy_id)).size;

  return (
    <div className="px-5 py-5" style={{ animation: 'fade-in 0.3s ease' }}>
      <h1 className="text-3xl font-bold text-center mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        My Squishies
      </h1>

      {/* Progress Bar */}
      <div className="my-3 p-3.5" style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(200,168,245,0.1)' }}>
        <div className="flex justify-between text-sm mb-2" style={{ fontFamily: 'var(--font-body)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Collection Progress</span>
          <span style={{ color: 'var(--text-secondary)' }}>{uniqueOwned}/{totalPossible}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F0E5FF' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(uniqueOwned / Math.max(totalPossible, 1)) * 100}%`,
              background: 'linear-gradient(90deg, #FF85C2, #C8A8F5, #5BB8FF)',
              backgroundSize: '200% auto',
              animation: 'progress-shine 3s linear infinite',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Series Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-none cursor-pointer"
            style={{
              background: filter === f.id ? 'linear-gradient(135deg, #FF85C2, #C8A8F5)' : 'white',
              border: filter === f.id ? 'none' : '1px solid #E8E0F0',
              color: filter === f.id ? 'white' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Rarity Chips */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {(['common', 'uncommon', 'rare', 'mythic'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRarityFilter(rarityFilter === r ? null : r)}
            className="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
            style={{
              border: `1.5px solid ${RARITY_CONFIG[r].color}`,
              background: rarityFilter === r ? RARITY_CONFIG[r].color : 'transparent',
              color: rarityFilter === r ? 'white' : RARITY_CONFIG[r].color,
              fontFamily: 'var(--font-body)',
            }}
          >
            {RARITY_CONFIG[r].label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {filtered.map((item, i) => {
            const s = item.squishy;
            if (!s) return null;
            const shapeIdx = s.name.length % 8;
            return (
              <Link
                key={item.id}
                href={`/collection/squish/${item.id}`}
                className="flex flex-col items-center gap-2 p-4 relative no-underline"
                style={{
                  background: 'white',
                  borderRadius: 20,
                  border: `2px solid ${RARITY_CONFIG[s.rarity as keyof typeof RARITY_CONFIG]?.color || '#ddd'}22`,
                  boxShadow: `0 4px 16px ${RARITY_CONFIG[s.rarity as keyof typeof RARITY_CONFIG]?.color || '#ddd'}15`,
                  animation: `slide-up 0.4s ${i * 0.05}s ease both`,
                }}
              >
                {item.is_favorite && (
                  <span className="absolute top-2 right-2.5 text-sm">❤️</span>
                )}
                <SquishySVG shapeIdx={shapeIdx} size={80} />
                <span
                  className="text-xs text-center leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  {s.name}
                </span>
                <RarityBadge rarity={s.rarity} />
                {item.times_squished > 0 && (
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                    🫧 {item.times_squished}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          {collection.length === 0
            ? 'No squishies yet! Open a bag in the store 🛍️'
            : 'No squishies match this filter'}
        </div>
      )}
    </div>
  );
}
