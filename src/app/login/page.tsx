'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || email.split('@')[0] },
          },
        });
        if (signUpError) throw signUpError;

        // Create profile
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: username || email.split('@')[0],
            coins: 50,
            streak_days: 0,
            total_bags_opened: 0,
          });
        }
        router.push('/home');
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push('/home');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, #FFF5FB, #F0E5FF)' }}>
      <div className="mb-6 text-center">
        <div className="text-6xl mb-3" style={{ animation: 'squishy-float 3s ease-in-out infinite' }}>🫧</div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {isSignUp ? 'Join SquishVault' : 'Welcome Back!'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {isSignUp ? 'Create an account to start collecting' : 'Sign in to your collection'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        {isSignUp && (
          <input
            type="text"
            placeholder="Pick a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border-2 text-base outline-none"
            style={{
              fontFamily: 'var(--font-body)',
              borderColor: 'rgba(200,168,245,0.3)',
              background: 'white',
              color: 'var(--text-primary)',
            }}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border-2 text-base outline-none"
          style={{
            fontFamily: 'var(--font-body)',
            borderColor: 'rgba(200,168,245,0.3)',
            background: 'white',
            color: 'var(--text-primary)',
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border-2 text-base outline-none"
          style={{
            fontFamily: 'var(--font-body)',
            borderColor: 'rgba(200,168,245,0.3)',
            background: 'white',
            color: 'var(--text-primary)',
          }}
          minLength={6}
          required
        />

        {error && (
          <p className="text-sm text-center" style={{ color: '#FF6B6B' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full text-white text-lg font-bold"
          style={{
            fontFamily: 'var(--font-display)',
            background: loading ? '#ccc' : 'linear-gradient(135deg, #FF85C2, #FF6BA8)',
            boxShadow: '0 4px 20px rgba(255,133,194,0.4)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
          className="text-sm font-semibold mt-2 bg-transparent border-none cursor-pointer"
          style={{ color: 'var(--color-bubble-pink)', fontFamily: 'var(--font-body)' }}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  );
}
