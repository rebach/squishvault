import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: collection } = await supabase
    .from('user_collection')
    .select('*, squishy:squishies(*)')
    .eq('user_id', user.id)
    .order('obtained_at', { ascending: false })
    .limit(3);

  const today = new Date().toISOString().split('T')[0];
  const dailyClaimed = profile?.last_login_date === today;

  return (
    <HomeClient
      profile={profile}
      recentCollection={collection || []}
      dailyClaimed={dailyClaimed}
    />
  );
}
