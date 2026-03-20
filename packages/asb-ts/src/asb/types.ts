import * as v from "valibot";

/*
  values.ts 用のts の型
*/

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

/*
  valibot の型
*/

export const PositiveValueSchema = v.pipe(v.number(), v.minValue(0));

/**
 * packages/asb-ts/ARKStatsExtractor/ARKBreedingStats/species/SpeciesStat.cs
 */
export type SpeciesStat = v.InferOutput<typeof SpeciesStatSchema>;
export type SpeciesStatIn = v.InferInput<typeof SpeciesStatSchema>;
export const SpeciesStatSchema = v.strictObject({
  baseValue: v.pipe(
    PositiveValueSchema,
    v.brand("SpeciesStatSchema/baseValue"),
  ),
  incPerWildLevel: v.pipe(
    PositiveValueSchema,
    v.brand("SpeciesStatSchema/incPerWildLevel"),
  ),
});

/**
 * asb-ts/ARKStatsExtractor/ARKBreedingStats/Ark.cs
 */
export type Stats = v.InferOutput<typeof StatsSchema>;
export type StatsIn = v.InferInput<typeof StatsSchema>;
export const StatsSchema = v.object({
  health: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/health")),
  stamina: v.nullable(
    v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/stamina")),
  ),
  oxygen: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/oxygen")),
  food: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/food")),
  water: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/water")),
  temperature: v.nullable(
    v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/temperature")),
  ),
  weight: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/eight")),
  meleeDamageMultiplier: v.nullable(
    v.pipe(
      v.nullable(SpeciesStatSchema),
      v.brand("StatsSchema/meleeDamageMultiplier"),
    ),
  ),
  speedMultiplier: v.nullable(
    v.pipe(
      v.nullable(SpeciesStatSchema),
      v.brand("StatsSchema/speedMultiplier"),
    ),
  ),
  temperatureFortitude: v.nullable(
    v.pipe(
      v.nullable(SpeciesStatSchema),
      v.brand("StatsSchema/temperatureFortitude"),
    ),
  ),
  craftingSpeedMultiplier: v.nullable(
    v.pipe(
      v.nullable(SpeciesStatSchema),
      v.brand("StatsSchema/craftingSpeedMultiplier"),
    ),
  ),
  torpidity: v.nullable(
    v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/torpidity")),
  ),
});

/**
 * wild: 野生のレベル
 * error: 実際の値と算出した値の誤差
 */
export type LevelDetail = v.InferOutput<typeof LevelDetailSchema>;
export type LevelDetailIn = v.InferInput<typeof LevelDetailSchema>;
export const LevelDetailSchema = v.object({
  wild: v.pipe(PositiveValueSchema, v.brand("LevelDetailSchema/wild")),
  error: v.pipe(
    v.nullish(PositiveValueSchema),
    v.brand("LevelDetailSchema/error"),
  ),
});

export type Levels = v.InferOutput<typeof LevelsSchema>;
export type LevelsIn = v.InferInput<typeof LevelsSchema>;
export const LevelsSchema = v.object({
  health: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/health")),
  stamina: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/stamina")),
  oxygen: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/oxygen")),
  food: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/food")),
  water: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/water")),
  temperature: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/temperature")),
  weight: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/weight")),
  meleeDamageMultiplier: v.pipe(
    LevelDetailSchema,
    v.brand("LevelsSchema/meleeDamageMultiplier"),
  ),
  speedMultiplier: v.pipe(
    LevelDetailSchema,
    v.brand("LevelsSchema/speedMultiplier"),
  ),
  temperatureFortitude: v.pipe(
    LevelDetailSchema,
    v.brand("LevelsSchema/temperatureFortitude"),
  ),
  craftingSpeedMultiplier: v.pipe(
    LevelDetailSchema,
    v.brand("LevelsSchema/craftingSpeedMultiplier"),
  ),
  torpidity: v.pipe(LevelDetailSchema, v.brand("LevelsSchema/torpidity")),
});

export type Values = v.InferOutput<typeof ValuesSchema>;
export type ValuesIn = v.InferInput<typeof ValuesSchema>;
export const ValuesSchema = v.object({
  health: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/health")),
  stamina: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/stamina")),
  oxygen: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/oxygen")),
  food: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/food")),
  water: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/water")),
  temperature: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/temperature")),
  weight: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/weight")),
  meleeDamageMultiplier: v.pipe(
    PositiveValueSchema,
    v.brand("ValuesSchema/meleeDamageMultiplier"),
  ),
  speedMultiplier: v.pipe(
    PositiveValueSchema,
    v.brand("ValuesSchema/speedMultiplier"),
  ),
  temperatureFortitude: v.pipe(
    PositiveValueSchema,
    v.brand("ValuesSchema/temperatureFortitude"),
  ),
  craftingSpeedMultiplier: v.pipe(
    PositiveValueSchema,
    v.brand("ValuesSchema/craftingSpeedMultiplier"),
  ),
  torpidity: v.pipe(PositiveValueSchema, v.brand("ValuesSchema/torpidity")),
});
