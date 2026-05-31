import * as v from "valibot";
import { PositiveValueSchema } from "./common.js";
import { SettingsSchema } from "./settings.js";
import { SpeciesSchema } from "./species.js";
import { StatsNames } from "./stats-name.js";

/**
 * wild: 野生のレベル
 * dom: 飼育のレベル
 * error: 実際の値と算出した値の誤差
 */
export type LevelDetail = v.InferOutput<typeof LevelDetailSchema>;
export type LevelDetailIn = v.InferInput<typeof LevelDetailSchema>;
export const LevelDetailSchema = v.object({
  wild: PositiveValueSchema,
  mut: v.nullish(PositiveValueSchema),
  dom: v.nullish(PositiveValueSchema),
  error: v.nullish(PositiveValueSchema),
});

export type Levels = v.InferOutput<typeof LevelsSchema>;
export type LevelsIn = v.InferInput<typeof LevelsSchema>;
export const LevelsSchema = v.object(
  v.entriesFromList(StatsNames, LevelDetailSchema),
);

export type Values = v.InferOutput<typeof ValuesSchema>;
export type ValuesIn = v.InferInput<typeof ValuesSchema>;
export const ValuesSchema = v.object(
  v.entriesFromList(StatsNames, PositiveValueSchema),
);

export type Imprinting = v.InferOutput<typeof ImprintingSchema>;
export const ImprintingSchema = v.pipe(
  PositiveValueSchema,
  v.brand("ImprintingSchema"),
);

export type Type = (typeof Types)[number];
export const Types = ["wild", "dom", "bred"] as const;

export type TameEffectiveness = v.InferOutput<typeof TameEffectivenessSchema>;
export const TameEffectivenessSchema = v.pipe(
  PositiveValueSchema,
  v.brand("TameEffectivenessSchema"),
);

export type CalculateValueInputPack = v.InferOutput<
  typeof CalculateValueInputPackSchema
>;
export const CalculateValueInputPackSchema = v.object({
  type: v.picklist(Types),
  levels: LevelsSchema,
  tameEffectiveness: TameEffectivenessSchema,
  imprinting: ImprintingSchema,
  species: SpeciesSchema,
  settings: SettingsSchema,
});

export type CalculateLevelInputPack = v.InferOutput<
  typeof CalculateLevelInputPackSchema
>;
export const CalculateLevelInputPackSchema = v.object({
  type: v.picklist(Types),
  values: ValuesSchema,
  imprinting: ImprintingSchema,
  species: SpeciesSchema,
  settings: SettingsSchema,
});
