import * as v from "valibot";
import { ModNameSchema, NameSchema } from "../values/index.js";
import { VariantSchema } from "../variants/index.js";
import { PositiveValueSchema } from "./common.js";

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

export type Species = v.InferOutput<typeof SpeciesSchema>;
export type SpeciesIn = v.InferInput<typeof SpeciesSchema>;
export const SpeciesSchema = v.object({
  name: NameSchema,
  blueprintPath: v.string(),
  variants: v.array(VariantSchema),
  mod: ModNameSchema,
  stats: StatsSchema,
});
