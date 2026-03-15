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
