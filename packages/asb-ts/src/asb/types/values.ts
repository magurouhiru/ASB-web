import * as v from "valibot";
import { PositiveValueSchema } from "./common.js";

/*
  元のARKStatsExtractorベースの定義
*/

/**
 * /ARKStatsExtractor/ARKBreedingStats/species/Species.cs
 * 0: baseValue
 * 1: incPerWildLevel
 * 2: incPerDomLevel
 * 3: addBonus
 * 4: multBonus
 */
export type StatsRow = v.InferOutput<typeof StatsRowSchema>;
export type StatsRowIn = v.InferInput<typeof StatsRowSchema>;
export const StatsRowSchema = v.tuple([
  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,
]);

/**
 * /ARKStatsExtractor/ARKBreedingStats/Ark.cs
 * fullStatsRaw:
 *   0:  Health
 *   1:  Stamina
 *   2:  Torpidity
 *   3:  Oxygen
 *
 *   4:  Food
 *   5:  Water
 *   6:  Temperature
 *   7:  Weight
 *
 *   8:  MeleeDamageMultiplier
 *   9:  SpeedMultiplier
 *   10: TemperatureFortitude
 *   11: CraftingSpeedMultiplier
 */
export type FullStatsRaw = v.InferOutput<typeof FullStatsRawSchema>;
export type FullStatsRawIn = v.InferInput<typeof FullStatsRawSchema>;
export const FullStatsRawSchema = v.tuple([
  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),

  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),

  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),
  v.nullable(StatsRowSchema),
]);

/**
 * MutationMult:
 *   0:  Health
 *   1:  Stamina
 *   2:  Torpidity
 *   3:  Oxygen
 *
 *   4:  Food
 *   5:  Water
 *   6:  Temperature
 *   7:  Weight
 *
 *   8:  MeleeDamageMultiplier
 *   9:  SpeedMultiplier
 *   10: TemperatureFortitude
 *   11: CraftingSpeedMultiplier
 */
export type MutationMult = v.InferOutput<typeof MutationMultSchema>;
export type MutationMultIn = v.InferInput<typeof MutationMultSchema>;
export const MutationMultSchema = v.tuple([
  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,

  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,

  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,
  PositiveValueSchema,
]);

export type Species = v.InferOutput<typeof SpeciesSchema>;
export type SpeciesIn = v.InferInput<typeof SpeciesSchema>;
export const SpeciesSchema = v.pipe(
  v.object({
    name: v.nullish(v.string()),
    blueprintPath: v.string(),
    variants: v.nullish(v.array(v.string())),
    fullStatsRaw: v.nullish(FullStatsRawSchema),
    mutationMult: v.nullish(MutationMultSchema),
  }),
);
