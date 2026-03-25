import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
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
    .eq('user_id', user.id);

  const { data: pullHistory } = await supabase
    .from('pull_history')
    .select('*, squishy:squishies(*), bag_type:bag_types(name)')
    .eq('user_id', user.id)
    .order('pulled_at', { ascending: false })
    .limit(5);

  return (
    <ProfileClient
      profile={profile}
      collection={collection || []}
      pullHistory={pullHistory || []}
    />
  );
}
