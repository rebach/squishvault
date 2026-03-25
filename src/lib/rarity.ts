export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic';

export interface RarityTable {
  common: number;
  uncommon: number;
  rare: number;
  mythic: number;
}

export function rollRarity(table: RarityTable): Rarity {
  const roll = Math.random() * 100;
  if (roll < table.mythic) return 'mythic';
  if (roll < table.mythic + table.rare) return 'rare';
  if (roll < table.mythic + table.rare + table.uncommon) return 'uncommon';
  return 'common';
}
