/**
 * /ARKStatsExtractor/ARKBreedingStats/species/Species.cs
 * 0: baseValue, 1: incPerWildLevel, 2: incPerDomLevel, 3: addBonus, 4: multBonus.
 */
export type StatsRow = [number, number, number, number, number];

/**
 * /ARKStatsExtractor/ARKBreedingStats/Ark.cs
 * fullStatsRaw:
 *   0:  Health
 *   1:  Stamina
 *   2:  Torpidity
 *   3:  Oxygen
 *   4:  Food
 *   5:  Water
 *   6:  Temperature
 *   7:  Weight
 *   8:  MeleeDamageMultiplier
 *   9:  SpeedMultiplier
 *   10: TemperatureFortitude
 *   11: CraftingSpeedMultiplier
 */
export type FullStatsRaw = [
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
  StatsRow | null,
];

export interface Species {
  name?: string;
  blueprintPath: string;
  fullStatsRaw?: FullStatsRaw;
  mutationMult?: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}

/**
 * wild: 野生のレベル
 * error: 実際の値と算出した値の誤差(%)
 */
export interface LevelDetail {
  wild: number;
  error?: number | null;
}

export interface Levels {
  Health: LevelDetail;
  Stamina: LevelDetail;
  Oxygen: LevelDetail;
  Food: LevelDetail;
  Water: LevelDetail;
  Temperature: LevelDetail;
  Weight: LevelDetail;
  MeleeDamageMultiplier: LevelDetail;
  SpeedMultiplier: LevelDetail;
  TemperatureFortitude: LevelDetail;
  CraftingSpeedMultiplier: LevelDetail;
  Torpidity: LevelDetail;
}

export interface Values {
  Health: number;
  Stamina: number;
  Oxygen: number;
  Food: number;
  Water: number;
  Temperature: number;
  Weight: number;
  MeleeDamageMultiplier: number;
  SpeedMultiplier: number;
  TemperatureFortitude: number;
  CraftingSpeedMultiplier: number;
  Torpidity: number;
}
