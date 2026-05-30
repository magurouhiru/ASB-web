import * as v from "valibot";
import {
  DefaultSettings,
  type Imprinting,
  type LevelDetail,
  type LevelDetailIn,
  LevelDetailSchema,
  type Levels,
  type LevelsIn,
  LevelsSchema,
  type Settings,
  type Species,
  type SpeciesStat,
  type StatMultiplierItem,
  type Stats,
  type TameEffectiveness,
  type Type,
  type Values,
  type ValuesIn,
  ValuesSchema,
} from "./types/index.js";

export function calculateValueController(
  species: Species,
  levels: Levels,
  imprinting: Imprinting,
  tameEffectiveness: TameEffectiveness,
  type: Type,
  settings: Settings = DefaultSettings,
): Values {
  switch (type) {
    case "wild": {
      return calculateValueWild(species.stats, levels, settings);
    }
    case "dom": {
      return calculateValueDom(
        species,
        levels,
        imprinting,
        tameEffectiveness,
        settings,
      );
    }
    case "bred": {
      return calculateValueDom(
        species,
        levels,
        imprinting,
        1 as TameEffectiveness, // 飼育はテイム効果なしで計算する。
        settings,
      );
    }
    default: {
      throw new Error("invalid type");
    }
  }
}

function calculateValueWild(
  stats: Stats,
  levels: Levels,
  settings: Settings,
): Values {
  return v.parse(ValuesSchema, {
    health: round10(
      cVw(stats.health, levels.health, settings.statMultipliers.health),
    ),
    stamina: round10(
      cVw(stats.stamina, levels.stamina, settings.statMultipliers.stamina),
    ),
    oxygen: round10(
      cVw(stats.oxygen, levels.oxygen, settings.statMultipliers.oxygen),
    ),
    food: round10(cVw(stats.food, levels.food, settings.statMultipliers.food)),
    water: round10(
      cVw(stats.water, levels.water, settings.statMultipliers.water),
    ),
    temperature: round10(
      cVw(
        stats.temperature,
        levels.temperature,
        settings.statMultipliers.temperature,
      ),
    ),
    weight: round10(
      cVw(stats.weight, levels.weight, settings.statMultipliers.weight),
    ),
    meleeDamageMultiplier: round1000(
      cVw(
        stats.meleeDamageMultiplier,
        levels.meleeDamageMultiplier,
        settings.statMultipliers.meleeDamageMultiplier,
      ),
    ),
    speedMultiplier: round10(
      cVw(
        stats.speedMultiplier,
        levels.speedMultiplier,
        settings.statMultipliers.speedMultiplier,
      ),
    ),
    temperatureFortitude: round10(
      cVw(
        stats.temperatureFortitude,
        levels.temperatureFortitude,
        settings.statMultipliers.temperatureFortitude,
      ),
    ),
    craftingSpeedMultiplier: round10(
      cVw(
        stats.craftingSpeedMultiplier,
        levels.craftingSpeedMultiplier,
        settings.statMultipliers.craftingSpeedMultiplier,
      ),
    ),
    torpidity: round10(
      cVw(
        stats.torpidity,
        levels.torpidity,
        settings.statMultipliers.torpidity,
      ),
    ),
  } satisfies ValuesIn);
}

function calculateValueDom(
  { stats, tamedBaseHealthMultiplier }: Species,
  levels: Levels,
  imprinting: Imprinting,
  tameEffectiveness: TameEffectiveness,
  settings: Settings = DefaultSettings,
): Values {
  return v.parse(ValuesSchema, {
    health: round10(
      cVpt(
        tameEffectiveness,
        stats.health,
        levels.health,
        imprinting,
        settings.statMultipliers.health,
        settings,
        tamedBaseHealthMultiplier,
      ),
    ),
    stamina: round10(
      cVpt(
        tameEffectiveness,
        stats.stamina,
        levels.stamina,
        imprinting,
        settings.statMultipliers.stamina,
        settings,
      ),
    ),
    oxygen: round10(
      cVpt(
        tameEffectiveness,
        stats.oxygen,
        levels.oxygen,
        imprinting,
        settings.statMultipliers.oxygen,
        settings,
      ),
    ),
    food: round10(
      cVpt(
        tameEffectiveness,
        stats.food,
        levels.food,
        imprinting,
        settings.statMultipliers.food,
        settings,
      ),
    ),
    water: round10(
      cVpt(
        tameEffectiveness,
        stats.water,
        levels.water,
        imprinting,
        settings.statMultipliers.water,
        settings,
      ),
    ),
    temperature: round10(
      cVpt(
        tameEffectiveness,
        stats.temperature,
        levels.temperature,
        imprinting,
        settings.statMultipliers.temperature,
        settings,
      ),
    ),
    weight: round10(
      cVpt(
        tameEffectiveness,
        stats.weight,
        levels.weight,
        imprinting,
        settings.statMultipliers.weight,
        settings,
      ),
    ),
    meleeDamageMultiplier: round1000(
      cVpt(
        tameEffectiveness,
        stats.meleeDamageMultiplier,
        levels.meleeDamageMultiplier,
        imprinting,
        settings.statMultipliers.meleeDamageMultiplier,
        settings,
      ),
    ),
    speedMultiplier: round10(
      cVpt(
        tameEffectiveness,
        stats.speedMultiplier,
        levels.speedMultiplier,
        imprinting,
        settings.statMultipliers.speedMultiplier,
        settings,
      ),
    ),
    temperatureFortitude: round10(
      cVpt(
        tameEffectiveness,
        stats.temperatureFortitude,
        levels.temperatureFortitude,
        imprinting,
        settings.statMultipliers.temperatureFortitude,
        settings,
      ),
    ),
    craftingSpeedMultiplier: round10(
      cVpt(
        tameEffectiveness,
        stats.craftingSpeedMultiplier,
        levels.craftingSpeedMultiplier,
        imprinting,
        settings.statMultipliers.craftingSpeedMultiplier,
        settings,
      ),
    ),
    torpidity: round10(
      cVpt(
        tameEffectiveness,
        stats.torpidity,
        levels.torpidity,
        imprinting,
        settings.statMultipliers.torpidity,
        settings,
      ),
    ),
  } satisfies ValuesIn);
}

function round10(num: number): number {
  return Math.round(num * 10) / 10;
}

// 近接攻撃力は%で表示されるので小数点以下3桁まで表示する。
function round1000(num: number): number {
  return Math.round(num * 1000) / 1000;
}

function cVw(
  stat: SpeciesStat | null,
  level: LevelDetail,
  statMultiplierItem: StatMultiplierItem,
): number {
  if (!stat) return 0;
  return (
    stat.baseValue *
    (1 + level.wild * stat.incPerWildLevel * statMultiplierItem.IwM)
  );
}

function cVpt(
  te: TameEffectiveness,
  stat: SpeciesStat | null,
  level: LevelDetail,
  imprinting: Imprinting,
  statMultiplierItem: StatMultiplierItem,
  { IBM }: Settings,
  tbhm: number | undefined = 1,
): number {
  if (!stat) return 0;
  const vw = cVw(stat, level, statMultiplierItem);
  return (
    (vw * tbhm * (1 + imprinting * 0.2 * IBM) +
      stat.additiveBonus * statMultiplierItem.TaM) *
    (1 + te * stat.multiplicativeBonus * statMultiplierItem.TmM)
  );
}

// 2進数による誤差をなくすための値、これより小さい値は四捨五入する。
const ROUND_DOWN = 10000;
function calcV(stat: SpeciesStat | null, level: LevelDetail): number {
  if (!stat) return 0;
  return (
    // 2進数による誤差をなくす
    Math.round(
      stat.baseValue * (1 + stat.incPerWildLevel * level.wild) * ROUND_DOWN,
    ) / ROUND_DOWN
  );
}

export function calculateLevel(stats: Stats, values: Values): Levels {
  return v.parse(LevelsSchema, {
    health: calcL(stats.health, values.health),
    stamina: calcL(stats.stamina, values.stamina),
    oxygen: calcL(stats.oxygen, values.oxygen),
    food: calcL(stats.food, values.food),
    water: calcL(stats.water, values.water),
    temperature: calcL(stats.temperature, values.temperature),
    weight: calcL(stats.weight, values.weight),
    meleeDamageMultiplier: calcL(
      stats.meleeDamageMultiplier,
      values.meleeDamageMultiplier,
    ),
    speedMultiplier: calcL(stats.speedMultiplier, values.speedMultiplier),
    temperatureFortitude: calcL(
      stats.temperatureFortitude,
      values.temperatureFortitude,
    ),
    craftingSpeedMultiplier: calcL(
      stats.craftingSpeedMultiplier,
      values.craftingSpeedMultiplier,
    ),
    torpidity: calcL(stats.torpidity, values.torpidity),
  } satisfies LevelsIn);
}

/** 丸める */
const ROUND = 10;
function calcL(stat: SpeciesStat | null, value: number): LevelDetail {
  if (!stat || value === 0)
    return v.parse(LevelDetailSchema, {
      wild: 0,
      error: null,
    } satisfies LevelDetailIn);
  if (stat.baseValue === 0 || stat.incPerWildLevel === 0)
    throw new Error("データがおかしくて0で割ろうとしてるよ");
  const tmpV = Math.round(
    (value - stat.baseValue) / stat.baseValue / stat.incPerWildLevel,
  );
  const cLevel = Math.max(tmpV, 0); // マイナスになるとあれなので最小値0にする。
  const cValue = calcV(
    stat,
    v.parse(LevelDetailSchema, { wild: cLevel } satisfies LevelDetailIn),
  );
  // 2進数による誤差をなくす
  const tmpE =
    Math.round((Math.abs(value - cValue) / value) * cLevel * ROUND_DOWN) /
    ROUND_DOWN;
  const error = Math.ceil(tmpE * ROUND) / ROUND; // あれなので丸める。
  return v.parse(LevelDetailSchema, {
    wild: cLevel,
    error: error !== 0 ? error : null,
  } satisfies LevelDetailIn);
}
