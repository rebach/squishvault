import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StoreClient from './StoreClient';

export default async function StorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('coins')
    .eq('id', user.id)
    .single();

  const { data: bags } = await supabase
    .from('bag_types')
    .select('*')
    .eq('is_available', true)
    .order('sort_order');

  return <StoreClient coins={profile?.coins || 0} bags={bags || []} />;
}
