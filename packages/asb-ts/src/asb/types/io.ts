import * as v from "valibot";
import { PositiveValueSchema } from "./common.js";
import { SettingsSchema } from "./settings.js";
import { SpeciesSchema } from "./species.js";
import { StatsNames } from "./stats-name.js";

export type LevelDetail = v.InferOutput<typeof LevelDetailSchema>;
export const LevelDetailSchema = v.object({
  wild: PositiveValueSchema,
  mut: v.nullish(PositiveValueSchema),
  dom: v.nullish(PositiveValueSchema),
  error: v.nullish(PositiveValueSchema),
});

export type Levels = v.InferOutput<typeof LevelsSchema>;
export const LevelsSchema = v.object(
  v.entriesFromList(StatsNames, LevelDetailSchema),
);

export type Values = v.InferOutput<typeof ValuesSchema>;
export const ValuesSchema = v.object(
  v.entriesFromList(StatsNames, PositiveValueSchema),
);

export type Type = (typeof Types)[number];
export const Types = ["wild", "dom", "bred"] as const;

export type TameEffectiveness = v.InferOutput<typeof TameEffectivenessSchema>;
export const MIN_TE = 0;
export const MAX_TE = 1;
export const TameEffectivenessSchema = v.pipe(
  v.number(),
  v.minValue(MIN_TE),
  v.maxValue(MAX_TE),
  v.brand("" as "TameEffectivenessSchema"),
);

export type Imprinting = v.InferOutput<typeof ImprintingSchema>;
export const MIN_IMP = 0;
export const MAX_IMP = 1;
export const ImprintingSchema = v.pipe(
  v.number(),
  v.minValue(MIN_IMP),
  v.maxValue(MAX_IMP),
  v.brand("" as "ImprintingSchema"),
);

// 野生はテイム効果なしで計算する。
export const WILD_TE = MIN_TE;
const WildTeSchema = v.pipe(
  v.fallback(v.literal(WILD_TE), WILD_TE),
  v.brand("" as "TameEffectivenessSchema"),
);

// 野生は刷り込みボーナスなしで計算する。
export const WILD_IMP = MIN_IMP;
const WildImpSchema = v.pipe(
  v.fallback(v.literal(WILD_IMP), WILD_IMP),
  v.brand("" as "ImprintingSchema"),
);

// テイム後は刷り込みボーナスなしで計算する。
export const DOM_IMP = MIN_IMP;
const DomImpSchema = v.pipe(
  v.fallback(v.literal(DOM_IMP), DOM_IMP),
  v.brand("" as "ImprintingSchema"),
);

// ブリはテイム効果1で計算する。
export const BRED_TE = MAX_TE;
const BredTeSchema = v.pipe(
  v.fallback(v.literal(BRED_TE), BRED_TE),
  v.brand("" as "TameEffectivenessSchema"),
);

export type CalculateValueInputPack = v.InferOutput<
  typeof CalculateValueInputPackSchema
>;
export const CalculateValueInputPackSchema = v.variant("type", [
  v.object({
    type: v.literal("wild" satisfies Type),
    levels: LevelsSchema,
    tameEffectiveness: WildTeSchema,
    imprinting: WildImpSchema,
    species: SpeciesSchema,
    settings: SettingsSchema,
  }),
  v.object({
    type: v.literal("dom" satisfies Type),
    levels: LevelsSchema,
    tameEffectiveness: TameEffectivenessSchema,
    imprinting: DomImpSchema,
    species: SpeciesSchema,
    settings: SettingsSchema,
  }),
  v.object({
    type: v.literal("bred" satisfies Type),
    levels: LevelsSchema,
    tameEffectiveness: BredTeSchema,
    imprinting: ImprintingSchema,
    species: SpeciesSchema,
    settings: SettingsSchema,
  }),
]);

export type CalculateLevelInputPack = v.InferOutput<
  typeof CalculateLevelInputPackSchema
>;
export const CalculateLevelInputPackSchema = v.variant("type", [
  v.object({
    type: v.literal("wild" satisfies Type),
    values: ValuesSchema,
    imprinting: WildImpSchema,
    species: SpeciesSchema,
    settings: SettingsSchema,
  }),
  v.object({
    type: v.literal("dom" satisfies Type),
    values: ValuesSchema,
    imprinting: DomImpSchema,
    species: SpeciesSchema,
    settings: SettingsSchema,
  }),
  v.object({
    type: v.literal("bred" satisfies Type),
    values: ValuesSchema,
    imprinting: ImprintingSchema,
    species: SpeciesSchema,
    settings: SettingsSchema,
  }),
]);
