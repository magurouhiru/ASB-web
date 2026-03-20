import type { SpeciesStat, Stats } from "./stats.js";
import type { LevelDetail, Levels, Values } from "./types.js";

export function calculateValue(stats: Stats, levels: Levels): Values {
  return {
    Health: calcV(stats.Health, levels.Health),
    Stamina: calcV(stats.Stamina, levels.Stamina),
    Oxygen: calcV(stats.Oxygen, levels.Oxygen),
    Food: calcV(stats.Food, levels.Food),
    Water: calcV(stats.Water, levels.Water),
    Temperature: calcV(stats.Temperature, levels.Temperature),
    Weight: calcV(stats.Weight, levels.Weight),
    MeleeDamageMultiplier: calcV(
      stats.MeleeDamageMultiplier,
      levels.MeleeDamageMultiplier,
    ),
    SpeedMultiplier: calcV(stats.SpeedMultiplier, levels.SpeedMultiplier),
    TemperatureFortitude: calcV(
      stats.TemperatureFortitude,
      levels.TemperatureFortitude,
    ),
    CraftingSpeedMultiplier: calcV(
      stats.CraftingSpeedMultiplier,
      levels.CraftingSpeedMultiplier,
    ),
    Torpidity: calcV(stats.Torpidity, levels.Torpidity),
  };
}

function calcV(stat: SpeciesStat | null, level: LevelDetail): number {
  if (!stat) return 0;
  return stat.BaseValue * (1 + stat.IncPerWildLevel * level.wild);
}

export function calculateLevel(stats: Stats, values: Values): Levels {
  return {
    Health: calcL(stats.Health, values.Health),
    Stamina: calcL(stats.Stamina, values.Stamina),
    Oxygen: calcL(stats.Oxygen, values.Oxygen),
    Food: calcL(stats.Food, values.Food),
    Water: calcL(stats.Water, values.Water),
    Temperature: calcL(stats.Temperature, values.Temperature),
    Weight: calcL(stats.Weight, values.Weight),
    MeleeDamageMultiplier: calcL(
      stats.MeleeDamageMultiplier,
      values.MeleeDamageMultiplier,
    ),
    SpeedMultiplier: calcL(stats.SpeedMultiplier, values.SpeedMultiplier),
    TemperatureFortitude: calcL(
      stats.TemperatureFortitude,
      values.TemperatureFortitude,
    ),
    CraftingSpeedMultiplier: calcL(
      stats.CraftingSpeedMultiplier,
      values.CraftingSpeedMultiplier,
    ),
    Torpidity: calcL(stats.Torpidity, values.Torpidity),
  };
}

function calcL(stat: SpeciesStat | null, value: number): LevelDetail {
  if (!stat || value === 0) return { wild: 0 };
  const cLevel = Math.round(
    (value - stat.BaseValue) / stat.BaseValue / stat.IncPerWildLevel,
  );
  const cValue = calcV(stat, { wild: cLevel });
  const error = Math.abs(value - cValue) / value;
  return {
    wild: cLevel,
    error: error !== 0 ? error : null,
  };
}
