export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  coins: number;
  streak_days: number;
  last_login_date: string | null;
  total_bags_opened: number;
  created_at: string;
}

export interface Squishy {
  id: string;
  name: string;
  series: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  color_variant: string | null;
  image_url: string;
  description: string | null;
  drop_weight: number;
  is_limited: boolean;
  series_season: string | null;
  created_at: string;
}

export interface BagType {
  id: string;
  name: string;
  description: string | null;
  cost_coins: number;
  image_url: string;
  rarity_table: { common: number; uncommon: number; rare: number; mythic: number };
  series_filter: string[];
  is_available: boolean;
  available_until: string | null;
  sort_order: number;
}

export interface UserCollectionItem {
  id: string;
  user_id: string;
  squishy_id: string;
  obtained_at: string;
  times_squished: number;
  is_favorite: boolean;
  bag_type_id: string | null;
  squishy?: Squishy;
}

export interface PullHistoryItem {
  id: string;
  user_id: string;
  squishy_id: string;
  bag_type_id: string;
  pulled_at: string;
  is_duplicate: boolean;
  shared: boolean;
  squishy?: Squishy;
  bag_type?: BagType;
}

export interface DailyReward {
  id: string;
  user_id: string;
  claimed_at: string;
  coins_awarded: number;
  streak_day: number;
}
