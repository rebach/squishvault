export function getDailyReward(streakDays: number): number {
  if (streakDays >= 3) return 50;
  if (streakDays === 2) return 40;
  if (streakDays === 1) return 30;
  return 25;
}

export function getStreakBonus(streakDays: number): number {
  return streakDays === 6 ? 100 : 0; // 7th day (0-indexed at claim time)
}
