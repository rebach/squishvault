'use client';

export default function CoinDisplay({ amount, size = 'md', animate = false }: { amount: number; size?: 'sm' | 'md' | 'lg'; animate?: boolean }) {
  const fontSize = size === 'lg' ? 28 : size === 'md' ? 18 : 14;
  const coinSize = size === 'lg' ? 32 : size === 'md' ? 24 : 18;

  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        fontFamily: 'var(--font-accent)',
        fontSize,
        color: 'var(--text-primary)',
        animation: animate ? 'coin-bounce 0.4s ease' : 'none',
      }}
    >
      <span
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: coinSize,
          height: coinSize,
          background: 'linear-gradient(135deg, #FFE87C, #FFD700)',
          fontSize: coinSize * 0.6,
          boxShadow: '0 2px 8px rgba(255,215,0,0.3)',
        }}
      >
        $
      </span>
      {amount.toLocaleString()}
    </span>
  );
}
