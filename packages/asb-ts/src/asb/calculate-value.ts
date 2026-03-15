import type { SpeciesStat, Stats } from "./stats.js";

interface LevelDetail {
  wild: number;
}

export interface Levels {
  Health: LevelDetail;
  Stamina: LevelDetail;
  Oxygen: LevelDetail;
  Food: LevelDetail;
  Water: LevelDetail;
  Temperature: LevelDetail;
  Weight: LevelDetail;
  MeleeDamageMultiplier: LevelDetail;
  SpeedMultiplier: LevelDetail;
  TemperatureFortitude: LevelDetail;
  CraftingSpeedMultiplier: LevelDetail;
  Torpidity: LevelDetail;
}

export interface Values {
  Health: number;
  Stamina: number;
  Oxygen: number;
  Food: number;
  Water: number;
  Temperature: number;
  Weight: number;
  MeleeDamageMultiplier: number;
  SpeedMultiplier: number;
  TemperatureFortitude: number;
  CraftingSpeedMultiplier: number;
  Torpidity: number;
}

export function calculateValue(stats: Stats, levels: Levels): Values {
  return {
    Health: calc(stats.Health, levels.Health),
    Stamina: calc(stats.Stamina, levels.Stamina),
    Oxygen: calc(stats.Oxygen, levels.Oxygen),
    Food: calc(stats.Food, levels.Food),
    Water: calc(stats.Water, levels.Water),
    Temperature: calc(stats.Temperature, levels.Temperature),
    Weight: calc(stats.Weight, levels.Weight),
    MeleeDamageMultiplier: calc(
      stats.MeleeDamageMultiplier,
      levels.MeleeDamageMultiplier,
    ),
    SpeedMultiplier: calc(stats.SpeedMultiplier, levels.SpeedMultiplier),
    TemperatureFortitude: calc(
      stats.TemperatureFortitude,
      levels.TemperatureFortitude,
    ),
    CraftingSpeedMultiplier: calc(
      stats.CraftingSpeedMultiplier,
      levels.CraftingSpeedMultiplier,
    ),
    Torpidity: calc(stats.Torpidity, levels.Torpidity),
  };
}

function calc(stat: SpeciesStat | null, level: LevelDetail): number {
  if (!stat) return 0;
  return stat.BaseValue * (1 + stat.IncPerWildLevel * level.wild);
}
