import { createClient } from '@/lib/supabase/server';
import LeaderboardClient from './LeaderboardClient';

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Top rare+ pulls this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: rarePulls } = await supabase
    .from('pull_history')
    .select('*, squishy:squishies(*), profile:profiles(username)')
    .in('squishy.rarity', ['rare', 'mythic'])
    .gte('pulled_at', oneWeekAgo.toISOString())
    .order('pulled_at', { ascending: false })
    .limit(20);

  // Top bag openers
  const { data: topOpeners } = await supabase
    .from('profiles')
    .select('id, username, total_bags_opened')
    .order('total_bags_opened', { ascending: false })
    .limit(20);

  return (
    <LeaderboardClient
      rarePulls={rarePulls || []}
      topOpeners={topOpeners || []}
    />
  );
}
