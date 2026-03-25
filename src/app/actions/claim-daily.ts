'use server';

import { createClient } from '@/lib/supabase/server';
import { getDailyReward, getStreakBonus } from '@/lib/coins';
import { revalidatePath } from 'next/cache';

export async function claimDailyReward() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) throw new Error('Profile not found');

  // Check if already claimed today
  const today = new Date().toISOString().split('T')[0];
  if (profile.last_login_date === today) {
    throw new Error('Already claimed today');
  }

  // Calculate streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = 1;
  if (profile.last_login_date === yesterdayStr) {
    newStreak = profile.streak_days + 1;
  }

  // Calculate reward
  const baseReward = getDailyReward(newStreak - 1);
  const streakBonus = getStreakBonus(newStreak - 1);
  const totalReward = baseReward + streakBonus;

  // Update profile
  await supabase.from('profiles').update({
    coins: profile.coins + totalReward,
    streak_days: newStreak,
    last_login_date: today,
  }).eq('id', user.id);

  // Record daily reward
  await supabase.from('daily_rewards').insert({
    user_id: user.id,
    coins_awarded: totalReward,
    streak_day: newStreak,
  });

  // Record coin transaction
  await supabase.from('coin_transactions').insert({
    user_id: user.id,
    amount: totalReward,
    reason: newStreak >= 7 ? 'streak_bonus' : 'daily_login',
  });

  revalidatePath('/home');
  revalidatePath('/profile');

  return {
    coinsAwarded: totalReward,
    baseReward,
    streakBonus,
    newStreak,
    newCoinBalance: profile.coins + totalReward,
  };
}
