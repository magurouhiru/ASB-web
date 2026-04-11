import * as v from "valibot";
import { ModNameSchema } from "../values/index.js";
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
  stamina: v.pipe(
    v.nullable(SpeciesStatSchema),
    v.brand("StatsSchema/stamina"),
  ),
  oxygen: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/oxygen")),
  food: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/food")),
  water: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/water")),
  temperature: v.pipe(
    v.nullable(SpeciesStatSchema),
    v.brand("StatsSchema/temperature"),
  ),
  weight: v.pipe(v.nullable(SpeciesStatSchema), v.brand("StatsSchema/eight")),
  meleeDamageMultiplier: v.pipe(
    v.nullable(SpeciesStatSchema),
    v.brand("StatsSchema/meleeDamageMultiplier"),
  ),
  speedMultiplier: v.pipe(
    v.nullable(SpeciesStatSchema),
    v.brand("StatsSchema/speedMultiplier"),
  ),
  temperatureFortitude: v.pipe(
    v.nullable(SpeciesStatSchema),
    v.brand("StatsSchema/temperatureFortitude"),
  ),
  craftingSpeedMultiplier: v.pipe(
    v.nullable(SpeciesStatSchema),
    v.brand("StatsSchema/craftingSpeedMultiplier"),
  ),
  torpidity: v.pipe(
    v.nullable(SpeciesStatSchema),
    v.brand("StatsSchema/torpidity"),
  ),
});

export type BlueprintPath = v.InferOutput<typeof BlueprintPathSchema>;
export type BlueprintPathIn = v.InferInput<typeof BlueprintPathSchema>;
export const BlueprintPathSchema = v.pipe(
  v.string(),
  v.brand("SpeciesSchema/blueprintPath"),
);

export type Species = v.InferOutput<typeof SpeciesSchema>;
export type SpeciesIn = v.InferInput<typeof SpeciesSchema>;
export const SpeciesSchema = v.object({
  name: v.string(),
  blueprintPath: BlueprintPathSchema,
  variants: v.array(VariantSchema),
  mod: v.nullable(ModNameSchema),
  stats: StatsSchema,
});
