import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const RARITY_STYLES: Record<string, { bg: string; accent: string; glow: string }> = {
  common:   { bg: 'linear-gradient(135deg, #E8EDF2, #D0D8E0)', accent: '#A8B8C8', glow: 'none' },
  uncommon: { bg: 'linear-gradient(135deg, #E0F2FF, #B8DFFF)', accent: '#5BB8FF', glow: '0 0 20px rgba(91,184,255,0.5)' },
  rare:     { bg: 'linear-gradient(135deg, #F0E5FF, #D4C0FF)', accent: '#B97FFF', glow: '0 0 30px rgba(185,127,255,0.6)' },
  mythic:   { bg: 'linear-gradient(135deg, #FFF8E0, #FFE87C)', accent: '#FFD700', glow: '0 0 40px rgba(255,215,0,0.8)' },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'Unknown Squishy';
  const rarity = searchParams.get('rarity') || 'common';
  const series = searchParams.get('series') || '';
  const username = searchParams.get('username') || 'Collector';

  const style = RARITY_STYLES[rarity] || RARITY_STYLES.common;

  return new ImageResponse(
    (
      <div
        style={{
          width: 600,
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: style.bg,
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Border frame */}
        <div
          style={{
            position: 'absolute',
            inset: 12,
            border: `3px solid ${style.accent}40`,
            borderRadius: 32,
            display: 'flex',
          }}
        />

        {/* SquishVault logo */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 32,
            fontSize: 18,
            fontWeight: 700,
            color: '#2D1B4E',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🫧</span>
          <span>SquishVault</span>
        </div>

        {/* Rarity badge */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            right: 32,
            padding: '4px 14px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            background: `${style.accent}22`,
            color: style.accent,
            border: `2px solid ${style.accent}44`,
            display: 'flex',
          }}
        >
          {rarity.toUpperCase()}
        </div>

        {/* Squishy emoji placeholder */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${style.accent}30, ${style.accent}10)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 100,
            boxShadow: style.glow,
          }}
        >
          🫧
        </div>

        {/* Name */}
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            fontWeight: 800,
            color: '#2D1B4E',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          {name}
        </div>

        {/* Series */}
        {series && (
          <div
            style={{
              marginTop: 8,
              fontSize: 16,
              color: '#7A6B8A',
              display: 'flex',
            }}
          >
            {series}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            fontSize: 14,
            color: '#7A6B8A',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>Pulled by</span>
          <span style={{ fontWeight: 700, color: '#2D1B4E' }}>{username}</span>
        </div>
      </div>
    ),
    { width: 600, height: 600 },
  );
}
