'use server';

import { createClient } from '@/lib/supabase/server';
import { rollRarity } from '@/lib/rarity';
import { revalidatePath } from 'next/cache';

export async function openBag(bagTypeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get bag type
  const { data: bag } = await supabase.from('bag_types').select('*').eq('id', bagTypeId).single();
  if (!bag) throw new Error('Bag not found');

  // Get profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) throw new Error('Profile not found');
  if (profile.coins < bag.cost_coins) throw new Error('Not enough coins');

  // Roll rarity
  const rarity = rollRarity(bag.rarity_table);

  // Get eligible squishies
  let query = supabase.from('squishies').select('*').eq('rarity', rarity);
  if (bag.series_filter && bag.series_filter.length > 0) {
    query = query.in('series', bag.series_filter);
  }
  const { data: eligibleSquishies } = await query;

  if (!eligibleSquishies || eligibleSquishies.length === 0) {
    // Fallback: any squishy of that rarity
    const { data: fallback } = await supabase.from('squishies').select('*').eq('rarity', rarity);
    if (!fallback || fallback.length === 0) throw new Error('No squishies available');
    // Weight selection
    const totalWeight = fallback.reduce((sum, s) => sum + s.drop_weight, 0);
    let roll = Math.random() * totalWeight;
    let selected = fallback[0];
    for (const s of fallback) {
      roll -= s.drop_weight;
      if (roll <= 0) { selected = s; break; }
    }

    return await completePull(supabase, user.id, profile, bag, selected);
  }

  // Weighted selection
  const totalWeight = eligibleSquishies.reduce((sum, s) => sum + s.drop_weight, 0);
  let roll = Math.random() * totalWeight;
  let selected = eligibleSquishies[0];
  for (const s of eligibleSquishies) {
    roll -= s.drop_weight;
    if (roll <= 0) { selected = s; break; }
  }

  return await completePull(supabase, user.id, profile, bag, selected);
}

async function completePull(supabase: any, userId: string, profile: any, bag: any, squishy: any) {
  // Check if duplicate
  const { data: existing } = await supabase
    .from('user_collection')
    .select('id')
    .eq('user_id', userId)
    .eq('squishy_id', squishy.id);
  const isDuplicate = existing && existing.length > 0;

  // Deduct coins
  await supabase.from('profiles').update({
    coins: profile.coins - bag.cost_coins,
    total_bags_opened: profile.total_bags_opened + 1,
  }).eq('id', userId);

  // Add to collection
  await supabase.from('user_collection').insert({
    user_id: userId,
    squishy_id: squishy.id,
    bag_type_id: bag.id,
    times_squished: 0,
    is_favorite: false,
  });

  // Record pull history
  await supabase.from('pull_history').insert({
    user_id: userId,
    squishy_id: squishy.id,
    bag_type_id: bag.id,
    is_duplicate: isDuplicate,
  });

  // Record coin transaction
  await supabase.from('coin_transactions').insert({
    user_id: userId,
    amount: -bag.cost_coins,
    reason: 'bag_purchase',
  });

  revalidatePath('/home');
  revalidatePath('/collection');
  revalidatePath('/store');
  revalidatePath('/profile');

  return {
    squishy,
    isDuplicate,
    rarity: squishy.rarity,
    newCoinBalance: profile.coins - bag.cost_coins,
  };
}
