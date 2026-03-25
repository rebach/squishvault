import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CollectionClient from './CollectionClient';

export default async function CollectionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collection } = await supabase
    .from('user_collection')
    .select('*, squishy:squishies(*)')
    .eq('user_id', user.id)
    .order('obtained_at', { ascending: false });

  const { data: totalSquishies } = await supabase
    .from('squishies')
    .select('id', { count: 'exact', head: true });

  return (
    <CollectionClient
      collection={collection || []}
      totalPossible={totalSquishies?.length || 16}
    />
  );
}
