import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/home');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'linear-gradient(180deg, #FFF5FB, #F0E5FF)' }}>
      <div className="mb-8" style={{ animation: 'squishy-float 3s ease-in-out infinite' }}>
        <div className="text-8xl mb-4">🫧</div>
      </div>

      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        SquishVault
      </h1>
      <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
        Open. Collect. Squish.
      </p>
      <p className="text-sm mb-10 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
        Earn coins, open blind bags, and collect rare squishies with satisfying physics!
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/login"
          className="block w-full py-4 rounded-full text-white text-lg font-bold text-center no-underline"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #FF85C2, #FF6BA8)',
            boxShadow: '0 4px 20px rgba(255,133,194,0.4)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="block w-full py-3.5 rounded-full text-center no-underline font-semibold"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'white',
            border: '2px solid var(--color-bubble-pink)',
            color: 'var(--color-bubble-pink)',
          }}
        >
          I have an account
        </Link>
      </div>
    </div>
  );
}
