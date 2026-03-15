import { SPECIES as ASA_SPECIES } from "./ASA-values.js";
import type { FullStatsRaw, StatsRow } from "./types.js";
import { SPECIES } from "./values.js";

// Index of the base value in fullStatsRaw.
const StatsRawIndexBase = 0;

// Index of the increase per wild level value in fullStatsRaw.
const StatsRawIndexIncPerWildLevel = 1;

/**
 * packages/asb-ts/ARKStatsExtractor/ARKBreedingStats/species/SpeciesStat.cs
 */
export interface SpeciesStat {
  BaseValue: number;
  IncPerWildLevel: number;
}

const Health = 0;
const Stamina = 1;
const Torpidity = 2;
const Oxygen = 3;
const Food = 4;
const Water = 5;
const Temperature = 6;
const Weight = 7;
const MeleeDamageMultiplier = 8;
const SpeedMultiplier = 9;
const TemperatureFortitude = 10;
const CraftingSpeedMultiplier = 11;

/**
 * asb-ts/ARKStatsExtractor/ARKBreedingStats/Ark.cs
 */
export interface Stats {
  Health: SpeciesStat | null;
  Stamina: SpeciesStat | null;
  Oxygen: SpeciesStat | null;
  Food: SpeciesStat | null;
  Water: SpeciesStat | null;
  Temperature: SpeciesStat | null;
  Weight: SpeciesStat | null;
  MeleeDamageMultiplier: SpeciesStat | null;
  SpeedMultiplier: SpeciesStat | null;
  TemperatureFortitude: SpeciesStat | null;
  CraftingSpeedMultiplier: SpeciesStat | null;
  Torpidity: SpeciesStat | null;
}

const NULL_STATS: Stats = {
  Health: null,
  Stamina: null,
  Oxygen: null,
  Food: null,
  Water: null,
  Temperature: null,
  Weight: null,
  MeleeDamageMultiplier: null,
  SpeedMultiplier: null,
  TemperatureFortitude: null,
  CraftingSpeedMultiplier: null,
  Torpidity: null,
};

const SEARCH_ORDER = [SPECIES, ASA_SPECIES] as const;
const SEARCH_TARGET = SEARCH_ORDER.flat();

export function getStats(name: string): Stats {
  if (name === "") throw new Error(`なんかいきものの名前を入力して`);
  const found = SEARCH_TARGET.find((s) => s.name === name);
  if (!found) throw new Error(`${name}が見つからなんだ`);
  return SEARCH_TARGET.filter((s) => s.blueprintPath === found.blueprintPath)
    .map((s) => {
      if (!s.fullStatsRaw) return null;
      return toStats(s.fullStatsRaw);
    })
    .filter((s) => !!s)
    .reduce(reducer, NULL_STATS);
}

function reducer(accumulator: Stats, currentValue: Stats): Stats {
  if (currentValue.Health) accumulator.Health = currentValue.Health;
  if (currentValue.Stamina) accumulator.Stamina = currentValue.Stamina;
  if (currentValue.Oxygen) accumulator.Oxygen = currentValue.Oxygen;
  if (currentValue.Food) accumulator.Food = currentValue.Food;
  if (currentValue.Water) accumulator.Water = currentValue.Water;
  if (currentValue.Temperature)
    accumulator.Temperature = currentValue.Temperature;
  if (currentValue.Weight) accumulator.Weight = currentValue.Weight;
  if (currentValue.MeleeDamageMultiplier)
    accumulator.MeleeDamageMultiplier = currentValue.MeleeDamageMultiplier;
  if (currentValue.SpeedMultiplier)
    accumulator.SpeedMultiplier = currentValue.SpeedMultiplier;
  if (currentValue.TemperatureFortitude)
    accumulator.TemperatureFortitude = currentValue.TemperatureFortitude;
  if (currentValue.CraftingSpeedMultiplier)
    accumulator.CraftingSpeedMultiplier = currentValue.CraftingSpeedMultiplier;
  if (currentValue.Torpidity) accumulator.Torpidity = currentValue.Torpidity;
  return accumulator;
}

function toStats(fullStatsRaw: FullStatsRaw): Stats {
  return {
    Health: fullStatsRaw[Health] ? toSpeciesStat(fullStatsRaw[Health]) : null,
    Stamina: fullStatsRaw[Stamina]
      ? toSpeciesStat(fullStatsRaw[Stamina])
      : null,
    Oxygen: fullStatsRaw[Oxygen] ? toSpeciesStat(fullStatsRaw[Oxygen]) : null,
    Food: fullStatsRaw[Food] ? toSpeciesStat(fullStatsRaw[Food]) : null,
    Water: fullStatsRaw[Water] ? toSpeciesStat(fullStatsRaw[Water]) : null,
    Temperature: fullStatsRaw[Temperature]
      ? toSpeciesStat(fullStatsRaw[Temperature])
      : null,
    Weight: fullStatsRaw[Weight] ? toSpeciesStat(fullStatsRaw[Weight]) : null,
    MeleeDamageMultiplier: fullStatsRaw[MeleeDamageMultiplier]
      ? toSpeciesStat(fullStatsRaw[MeleeDamageMultiplier])
      : null,
    SpeedMultiplier: fullStatsRaw[SpeedMultiplier]
      ? toSpeciesStat(fullStatsRaw[SpeedMultiplier])
      : null,
    TemperatureFortitude: fullStatsRaw[TemperatureFortitude]
      ? toSpeciesStat(fullStatsRaw[TemperatureFortitude])
      : null,
    CraftingSpeedMultiplier: fullStatsRaw[CraftingSpeedMultiplier]
      ? toSpeciesStat(fullStatsRaw[CraftingSpeedMultiplier])
      : null,
    Torpidity: fullStatsRaw[Torpidity]
      ? toSpeciesStat(fullStatsRaw[Torpidity])
      : null,
  };
}

function toSpeciesStat(row: StatsRow): SpeciesStat {
  return {
    BaseValue: row[StatsRawIndexBase],
    IncPerWildLevel: row[StatsRawIndexIncPerWildLevel],
  };
}
