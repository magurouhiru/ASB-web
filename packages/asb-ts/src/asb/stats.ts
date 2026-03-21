import * as v from "valibot";
import { SPECIES as ASA_SPECIES } from "./ASA-values.js";
import {
  type FullStatsRaw,
  type Name,
  type SpeciesStat,
  type SpeciesStatIn,
  SpeciesStatSchema,
  type Stats,
  type StatsIn,
  type StatsRow,
  StatsSchema,
} from "./types.js";
import { SPECIES } from "./values.js";

// Index of the base value in fullStatsRaw.
const StatsRawIndexBase = 0;

// Index of the increase per wild level value in fullStatsRaw.
const StatsRawIndexIncPerWildLevel = 1;

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

const NEED_STATS = [
  Health,
  Stamina,
  Torpidity,
  Oxygen,
  Food,
  Weight,
  MeleeDamageMultiplier,
];

const NULL_STATS = v.parse(StatsSchema, {
  health: null,
  stamina: null,
  oxygen: null,
  food: null,
  water: null,
  temperature: null,
  weight: null,
  meleeDamageMultiplier: null,
  speedMultiplier: null,
  temperatureFortitude: null,
  craftingSpeedMultiplier: null,
  torpidity: null,
} satisfies StatsIn);

const SEARCH_ORDER = [SPECIES, ASA_SPECIES] as const;
const SEARCH_TARGET = SEARCH_ORDER.flat();

export function getStats(name: Name): Stats {
  if (name === "") throw new Error(`なんかいきものの名前を入力して`);

  // TODO: ちゃんと元のやつを確認する。いったん計算に使えるやつで最後のやつを使う。
  const foundList = SEARCH_TARGET.filter((s) => s.name === name).filter((s) => {
    const fsr = s.fullStatsRaw;
    console.log("fsr", fsr);
    if (
      !fsr ||
      // incPerWildLevel が0の時はなし
      fsr.some((r) => {
        console.log(r);
        return r ? r[1] === 0 : false;
      })
    ) {
      return false;
    }
    return true;
  });
  const foundLast = foundList.at(-1);
  if (!foundLast) throw new Error(`${name}が見つからなんだ`);
  return SEARCH_TARGET.filter(
    (s) => s.blueprintPath === foundLast.blueprintPath,
  )
    .map((s) => {
      if (!s.fullStatsRaw) return null;
      return toStats(s.fullStatsRaw);
    })
    .filter((s) => !!s)
    .reduce(reducer, NULL_STATS);
}

function reducer(accumulator: Stats, currentValue: Stats): Stats {
  if (currentValue.health) accumulator.health = currentValue.health;
  if (currentValue.stamina) accumulator.stamina = currentValue.stamina;
  if (currentValue.oxygen) accumulator.oxygen = currentValue.oxygen;
  if (currentValue.food) accumulator.food = currentValue.food;
  if (currentValue.water) accumulator.water = currentValue.water;
  if (currentValue.temperature)
    accumulator.temperature = currentValue.temperature;
  if (currentValue.weight) accumulator.weight = currentValue.weight;
  if (currentValue.meleeDamageMultiplier)
    accumulator.meleeDamageMultiplier = currentValue.meleeDamageMultiplier;
  if (currentValue.speedMultiplier)
    accumulator.speedMultiplier = currentValue.speedMultiplier;
  if (currentValue.temperatureFortitude)
    accumulator.temperatureFortitude = currentValue.temperatureFortitude;
  if (currentValue.craftingSpeedMultiplier)
    accumulator.craftingSpeedMultiplier = currentValue.craftingSpeedMultiplier;
  if (currentValue.torpidity) accumulator.torpidity = currentValue.torpidity;
  return accumulator;
}

function toStats(fullStatsRaw: FullStatsRaw): Stats {
  return v.parse(StatsSchema, {
    health: fullStatsRaw[Health] ? toSpeciesStat(fullStatsRaw[Health]) : null,
    stamina: fullStatsRaw[Stamina]
      ? toSpeciesStat(fullStatsRaw[Stamina])
      : null,
    oxygen: fullStatsRaw[Oxygen] ? toSpeciesStat(fullStatsRaw[Oxygen]) : null,
    food: fullStatsRaw[Food] ? toSpeciesStat(fullStatsRaw[Food]) : null,
    water: fullStatsRaw[Water] ? toSpeciesStat(fullStatsRaw[Water]) : null,
    temperature: fullStatsRaw[Temperature]
      ? toSpeciesStat(fullStatsRaw[Temperature])
      : null,
    weight: fullStatsRaw[Weight] ? toSpeciesStat(fullStatsRaw[Weight]) : null,
    meleeDamageMultiplier: fullStatsRaw[MeleeDamageMultiplier]
      ? toSpeciesStat(fullStatsRaw[MeleeDamageMultiplier])
      : null,
    speedMultiplier: fullStatsRaw[SpeedMultiplier]
      ? toSpeciesStat(fullStatsRaw[SpeedMultiplier])
      : null,
    temperatureFortitude: fullStatsRaw[TemperatureFortitude]
      ? toSpeciesStat(fullStatsRaw[TemperatureFortitude])
      : null,
    craftingSpeedMultiplier: fullStatsRaw[CraftingSpeedMultiplier]
      ? toSpeciesStat(fullStatsRaw[CraftingSpeedMultiplier])
      : null,
    torpidity: fullStatsRaw[Torpidity]
      ? toSpeciesStat(fullStatsRaw[Torpidity])
      : null,
  } satisfies StatsIn);
}

function toSpeciesStat(row: StatsRow): SpeciesStat {
  return v.parse(SpeciesStatSchema, {
    baseValue: row[StatsRawIndexBase],
    incPerWildLevel: row[StatsRawIndexIncPerWildLevel],
  } satisfies SpeciesStatIn);
}
