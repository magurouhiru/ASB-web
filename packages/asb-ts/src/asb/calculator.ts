import * as v from "valibot";
import {
  DefaultSettings,
  type Imprinting,
  type LevelDetailIn,
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
        0 as Imprinting, // テイム後のレベル計算ではインプリントは考慮しない。
        tameEffectiveness,
        settings,
      );
    }
    case "bred": {
      return calculateValueDom(
        species,
        levels,
        imprinting,
        1 as TameEffectiveness, // ブリはテイム効果なしで計算する。
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
    health: round(
      cVw(stats.health, levels.health, settings.statMultipliers.health),
    ),
    stamina: round(
      cVw(stats.stamina, levels.stamina, settings.statMultipliers.stamina),
    ),
    oxygen: round(
      cVw(stats.oxygen, levels.oxygen, settings.statMultipliers.oxygen),
    ),
    food: round(cVw(stats.food, levels.food, settings.statMultipliers.food)),
    water: round(
      cVw(stats.water, levels.water, settings.statMultipliers.water),
    ),
    temperature: round(
      cVw(
        stats.temperature,
        levels.temperature,
        settings.statMultipliers.temperature,
      ),
    ),
    weight: round(
      cVw(stats.weight, levels.weight, settings.statMultipliers.weight),
    ),
    meleeDamageMultiplier: round(
      cVw(
        stats.meleeDamageMultiplier,
        levels.meleeDamageMultiplier,
        settings.statMultipliers.meleeDamageMultiplier,
      ),
      PRECISION_1000,
    ),
    speedMultiplier: round(
      cVw(
        stats.speedMultiplier,
        levels.speedMultiplier,
        settings.statMultipliers.speedMultiplier,
      ),
    ),
    temperatureFortitude: round(
      cVw(
        stats.temperatureFortitude,
        levels.temperatureFortitude,
        settings.statMultipliers.temperatureFortitude,
      ),
    ),
    craftingSpeedMultiplier: round(
      cVw(
        stats.craftingSpeedMultiplier,
        levels.craftingSpeedMultiplier,
        settings.statMultipliers.craftingSpeedMultiplier,
      ),
    ),
    torpidity: round(
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
    health: round(
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
    stamina: round(
      cVpt(
        tameEffectiveness,
        stats.stamina,
        levels.stamina,
        imprinting,
        settings.statMultipliers.stamina,
        settings,
      ),
    ),
    oxygen: round(
      cVpt(
        tameEffectiveness,
        stats.oxygen,
        levels.oxygen,
        imprinting,
        settings.statMultipliers.oxygen,
        settings,
      ),
    ),
    food: round(
      cVpt(
        tameEffectiveness,
        stats.food,
        levels.food,
        imprinting,
        settings.statMultipliers.food,
        settings,
      ),
    ),
    water: round(
      cVpt(
        tameEffectiveness,
        stats.water,
        levels.water,
        imprinting,
        settings.statMultipliers.water,
        settings,
      ),
    ),
    temperature: round(
      cVpt(
        tameEffectiveness,
        stats.temperature,
        levels.temperature,
        imprinting,
        settings.statMultipliers.temperature,
        settings,
      ),
    ),
    weight: round(
      cVpt(
        tameEffectiveness,
        stats.weight,
        levels.weight,
        imprinting,
        settings.statMultipliers.weight,
        settings,
      ),
    ),
    meleeDamageMultiplier: round(
      cVpt(
        tameEffectiveness,
        stats.meleeDamageMultiplier,
        levels.meleeDamageMultiplier,
        imprinting,
        settings.statMultipliers.meleeDamageMultiplier,
        settings,
      ),
      PRECISION_1000,
    ),
    speedMultiplier: round(
      cVpt(
        tameEffectiveness,
        stats.speedMultiplier,
        levels.speedMultiplier,
        imprinting,
        settings.statMultipliers.speedMultiplier,
        settings,
      ),
    ),
    temperatureFortitude: round(
      cVpt(
        tameEffectiveness,
        stats.temperatureFortitude,
        levels.temperatureFortitude,
        imprinting,
        settings.statMultipliers.temperatureFortitude,
        settings,
      ),
    ),
    craftingSpeedMultiplier: round(
      cVpt(
        tameEffectiveness,
        stats.craftingSpeedMultiplier,
        levels.craftingSpeedMultiplier,
        imprinting,
        settings.statMultipliers.craftingSpeedMultiplier,
        settings,
      ),
    ),
    torpidity: round(
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

const PRECISION_10 = 10;
const PRECISION_1000 = 1000; // 近接攻撃力は%で表示されるので小数点以下3桁まで表示する。

function round(num: number, precision: number = PRECISION_10): number {
  return Math.round(num * precision) / precision;
}

function cVw(
  stat: SpeciesStat | null,
  level: LevelDetailIn,
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
  level: LevelDetailIn,
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

export function calculateLevelController(
  species: Species,
  values: Values,
  imprinting: Imprinting,
  type: Type,
  settings: Settings = DefaultSettings,
): Levels {
  switch (type) {
    case "wild": {
      return calculateLevelWild(species.stats, values, settings);
    }
    case "dom": {
      return calculateLevelDom(species, values, settings);
    }
    case "bred": {
      return calculateLevelBred(species, values, settings, imprinting);
    }
    default: {
      throw new Error("invalid type");
    }
  }
}

function calculateLevelWild(
  stats: Stats,
  values: Values,
  settings: Settings,
): Levels {
  return v.parse(LevelsSchema, {
    health: cLw(stats.health, values.health, settings.statMultipliers.health),
    stamina: cLw(
      stats.stamina,
      values.stamina,
      settings.statMultipliers.stamina,
    ),
    oxygen: cLw(stats.oxygen, values.oxygen, settings.statMultipliers.oxygen),
    food: cLw(stats.food, values.food, settings.statMultipliers.food),
    water: cLw(stats.water, values.water, settings.statMultipliers.water),
    temperature: cLw(
      stats.temperature,
      values.temperature,
      settings.statMultipliers.temperature,
    ),
    weight: cLw(stats.weight, values.weight, settings.statMultipliers.weight),
    meleeDamageMultiplier: cLw(
      stats.meleeDamageMultiplier,
      values.meleeDamageMultiplier,
      settings.statMultipliers.meleeDamageMultiplier,
      PRECISION_1000,
    ),
    speedMultiplier: cLw(
      stats.speedMultiplier,
      values.speedMultiplier,
      settings.statMultipliers.speedMultiplier,
    ),
    temperatureFortitude: cLw(
      stats.temperatureFortitude,
      values.temperatureFortitude,
      settings.statMultipliers.temperatureFortitude,
    ),
    craftingSpeedMultiplier: cLw(
      stats.craftingSpeedMultiplier,
      values.craftingSpeedMultiplier,
      settings.statMultipliers.craftingSpeedMultiplier,
    ),
    torpidity: cLw(
      stats.torpidity,
      values.torpidity,
      settings.statMultipliers.torpidity,
    ),
  } satisfies LevelsIn);
}

function calculateLevelDom(
  species: Species,
  values: Values,
  settings: Settings,
): Levels {
  let bufError = Number.MAX_SAFE_INTEGER;
  let bufLevels: Levels | null = null;
  for (let te = 0; te <= 1; te += 0.01) {
    const tmp = calculateLevelDomCore(
      species,
      te as TameEffectiveness,
      values,
      0 as Imprinting, // テイム後のレベル計算ではインプリントは考慮しない。
      settings,
    );
    const error = sumError(tmp);
    if (error === 0) {
      return tmp;
    } else if (error < bufError) {
      bufError = error;
      bufLevels = tmp;
    }
  }
  if (!bufLevels) throw new Error("calculateLevelDomがなんかへん");
  return bufLevels;
}

function calculateLevelBred(
  species: Species,
  values: Values,
  settings: Settings,
  imprinting: Imprinting,
): Levels {
  return calculateLevelDomCore(
    species,
    1 as TameEffectiveness, // ブリはテイム効果1で計算する。
    values,
    imprinting,
    settings,
  );
}

function sumError(levels: Levels): number {
  return (
    Math.abs(levels.health.error ?? 0) +
    Math.abs(levels.stamina.error ?? 0) +
    Math.abs(levels.oxygen.error ?? 0) +
    Math.abs(levels.food.error ?? 0) +
    Math.abs(levels.water.error ?? 0) +
    Math.abs(levels.temperature.error ?? 0) +
    Math.abs(levels.weight.error ?? 0) +
    Math.abs(levels.meleeDamageMultiplier.error ?? 0) +
    Math.abs(levels.speedMultiplier.error ?? 0) +
    Math.abs(levels.temperatureFortitude.error ?? 0) +
    Math.abs(levels.craftingSpeedMultiplier.error ?? 0) +
    Math.abs(levels.torpidity.error ?? 0)
  );
}

function calculateLevelDomCore(
  { stats, tamedBaseHealthMultiplier }: Species,
  te: TameEffectiveness,
  values: Values,
  imprinting: Imprinting,
  settings: Settings,
): Levels {
  return v.parse(LevelsSchema, {
    health: cLpt(
      te,
      stats.health,
      values.health,
      imprinting,
      settings.statMultipliers.health,
      settings,
      tamedBaseHealthMultiplier,
    ),
    stamina: cLpt(
      te,
      stats.stamina,
      values.stamina,
      imprinting,
      settings.statMultipliers.stamina,
      settings,
    ),
    oxygen: cLpt(
      te,
      stats.oxygen,
      values.oxygen,
      imprinting,
      settings.statMultipliers.oxygen,
      settings,
    ),
    food: cLpt(
      te,
      stats.food,
      values.food,
      imprinting,
      settings.statMultipliers.food,
      settings,
    ),
    water: cLpt(
      te,
      stats.water,
      values.water,
      imprinting,
      settings.statMultipliers.water,
      settings,
    ),
    temperature: cLpt(
      te,
      stats.temperature,
      values.temperature,
      imprinting,
      settings.statMultipliers.temperature,
      settings,
    ),
    weight: cLpt(
      te,
      stats.weight,
      values.weight,
      imprinting,
      settings.statMultipliers.weight,
      settings,
    ),
    meleeDamageMultiplier: cLpt(
      te,
      stats.meleeDamageMultiplier,
      values.meleeDamageMultiplier,
      imprinting,
      settings.statMultipliers.meleeDamageMultiplier,
      settings,
      undefined,
      PRECISION_1000,
    ),
    speedMultiplier: cLpt(
      te,
      stats.speedMultiplier,
      values.speedMultiplier,
      imprinting,
      settings.statMultipliers.speedMultiplier,
      settings,
    ),
    temperatureFortitude: cLpt(
      te,
      stats.temperatureFortitude,
      values.temperatureFortitude,
      imprinting,
      settings.statMultipliers.temperatureFortitude,
      settings,
    ),
    craftingSpeedMultiplier: cLpt(
      te,
      stats.craftingSpeedMultiplier,
      values.craftingSpeedMultiplier,
      imprinting,
      settings.statMultipliers.craftingSpeedMultiplier,
      settings,
    ),
    torpidity: cLpt(
      te,
      stats.torpidity,
      values.torpidity,
      imprinting,
      settings.statMultipliers.torpidity,
      settings,
    ),
  } satisfies LevelsIn);
}

function cLw(
  stat: SpeciesStat | null,
  value: number,
  statMultiplierItem: StatMultiplierItem,
  precision: number = PRECISION_10,
): LevelDetailIn {
  if (!stat || stat.incPerWildLevel <= 0 || value <= 0)
    return { wild: 0, error: null };
  let bufVw = 0;
  for (let level = 0; level <= 255; level++) {
    const tmpVw = round(
      cVw(stat, { wild: level }, statMultiplierItem),
      precision,
    );
    if (tmpVw === value) {
      return { wild: level, error: null };
    } else if (tmpVw > value) {
      const bufDiff = value - bufVw;
      const tmpDiff = tmpVw - value;
      if (bufDiff < tmpDiff) {
        return { wild: level - 1, error: bufDiff };
      } else {
        return { wild: level, error: tmpDiff };
      }
    }
    bufVw = tmpVw;
  }
  throw new Error("value is too high");
}

function cLpt(
  te: TameEffectiveness,
  stat: SpeciesStat | null,
  value: number,
  imprinting: Imprinting,
  statMultiplierItem: StatMultiplierItem,
  settings: Settings,
  tbhm: number | undefined = 1,
  precision: number = PRECISION_10,
): LevelDetailIn {
  if (!stat || stat.incPerWildLevel <= 0 || value <= 0)
    return { wild: 0, error: null };
  let bufVpt = 0;
  for (let level = 0; level <= 255; level++) {
    const tmpVpt = round(
      cVpt(
        te,
        stat,
        { wild: level },
        imprinting,
        statMultiplierItem,
        settings,
        tbhm,
      ),
      precision,
    );
    if (tmpVpt === value) {
      return { wild: level, error: null };
    } else if (tmpVpt > value) {
      const bufDiff = value - bufVpt;
      const tmpDiff = tmpVpt - value;
      if (bufDiff < tmpDiff) {
        return { wild: level - 1, error: bufDiff };
      } else {
        return { wild: level, error: tmpDiff };
      }
    }
    bufVpt = tmpVpt;
  }
  throw new Error("value is too high");
}
