'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateSquishCount(collectionItemId: string, count: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_collection')
    .update({ times_squished: count })
    .eq('id', collectionItemId)
    .eq('user_id', user.id);
}

export async function toggleFavorite(collectionItemId: string, isFavorite: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_collection')
    .update({ is_favorite: isFavorite })
    .eq('id', collectionItemId)
    .eq('user_id', user.id);
}
