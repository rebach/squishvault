import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SquishModeClient from './SquishModeClient';

export default async function SquishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: item } = await supabase
    .from('user_collection')
    .select('*, squishy:squishies(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!item) redirect('/collection');

  return <SquishModeClient item={item} />;
}
