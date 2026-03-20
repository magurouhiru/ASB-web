import * as v from "valibot";
import {
  type LevelDetail,
  type LevelDetailIn,
  LevelDetailSchema,
  type Levels,
  type LevelsIn,
  LevelsSchema,
  type SpeciesStat,
  type Stats,
  type Values,
  
  type ValuesIn,
  ValuesSchema,
} from "./types.js";

export function calculateValue(stats: Stats, levels: Levels): Values {
  return v.parse(ValuesSchema, {
    health: calcV(stats.health, levels.health),
    stamina: calcV(stats.stamina, levels.stamina),
    oxygen: calcV(stats.oxygen, levels.oxygen),
    food: calcV(stats.food, levels.food),
    water: calcV(stats.water, levels.water),
    temperature: calcV(stats.temperature, levels.temperature),
    weight: calcV(stats.weight, levels.weight),
    meleeDamageMultiplier: calcV(
      stats.meleeDamageMultiplier,
      levels.meleeDamageMultiplier,
    ),
    speedMultiplier: calcV(stats.speedMultiplier, levels.speedMultiplier),
    temperatureFortitude: calcV(
      stats.temperatureFortitude,
      levels.temperatureFortitude,
    ),
    craftingSpeedMultiplier: calcV(
      stats.craftingSpeedMultiplier,
      levels.craftingSpeedMultiplier,
    ),
    torpidity: calcV(stats.torpidity, levels.torpidity),
  } satisfies ValuesIn);
}

function calcV(stat: SpeciesStat | null, level: LevelDetail): number {
  if (!stat) return 0;
  return stat.baseValue * (1 + stat.incPerWildLevel * level.wild);
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
    return v.parse(LevelDetailSchema, { wild: 0 } satisfies LevelDetailIn);
  const tmpV = Math.round(
    (value - stat.baseValue) / stat.baseValue / stat.incPerWildLevel,
  );
  const cLevel = Math.max(tmpV, 0); // マイナスになるとあれなので最小値0にする。
  const cValue = calcV(
    stat,
    v.parse(LevelDetailSchema, { wild: cLevel } satisfies LevelDetailIn),
  );
  const tmpE = (Math.abs(value - cValue) / value) * cLevel;
  const error = Math.ceil(tmpE * ROUND) / ROUND; // あれなので丸める。
  return v.parse(LevelDetailSchema, {
    wild: cLevel,
    error: error !== 0 ? error : null,
  } satisfies LevelDetailIn);
}
