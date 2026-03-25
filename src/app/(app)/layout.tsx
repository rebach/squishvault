import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Create profile if missing (first login)
  if (!profile) {
    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Squisher';
    await supabase.from('profiles').upsert({
      id: user.id,
      username,
      coins: 50,
      streak_days: 0,
      total_bags_opened: 0,
    });
  }

  const p = profile || { username: 'Squisher', coins: 50, streak_days: 0 };

  return (
    <>
      <TopBar username={p.username} coins={p.coins} streak={p.streak_days} />
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
