import * as v from "valibot";
import {
  type Species,
  type SpeciesIn,
  SpeciesSchema,
  type SpeciesStat,
  type SpeciesStatIn,
  SpeciesStatSchema,
  type Stats,
  type StatsIn,
  StatsSchema,
} from "./types/index.js";
import {
  AllModSpecies,
  type Name,
  type StatsRow,
  type FullStatsRaw,
  type ModName,
} from "./values/index.js";
import { VARIANT_DEFAULT_UNSELECTED, type Variant } from "./variants/index.js";

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

export function getStats(
  name: Name,
  options: {
    targetVariants: Variant[];
    variantsUnselected: Variant[];
    mods: ModName[];
  } = {
    targetVariants: [],
    variantsUnselected: VARIANT_DEFAULT_UNSELECTED,
    mods: ["BASE", "ASA"],
  },
): Species {
  const searchTarget = AllModSpecies.filter((ms) =>
    options.mods.includes(ms.mod),
  );

  const foundList = searchTarget.map((ms) =>
    ms.species
      .filter((s) => s.name === name)
      .filter(
        (s) =>
          !(s.variants ?? []).some((v) =>
            options.variantsUnselected.includes(v),
          ),
      ),
  );
  const lastBP = foundList
    .flatMap((ms) => ms.map((s) => s.blueprintPath))
    .at(-1);
  if (!lastBP) throw new Error(`${name}が見つからなんだ`);

  const tmp = searchTarget
    .flatMap((ms) =>
      ms.species
        .filter((s) => s.blueprintPath === lastBP)
        .map((s) => ({
          name: s.name,
          blueprintPath: s.blueprintPath,
          variants: s.variants ?? [],
          mod: ms.mod,
          stats:
            s.fullStatsRaw !== undefined && s.fullStatsRaw !== null
              ? toStats(s.fullStatsRaw)
              : null,
        })),
    )
    .reduce(
      (acc, current) => {
        acc.variants = current.variants;
        acc.mod = current.mod;
        if (current.stats !== null) acc.stats = current.stats;
        return acc;
      },
      {
        name,
        blueprintPath: lastBP,
        variants: [],
        mod: "BASE",
        stats: null,
      },
    );
  return v.parse(SpeciesSchema, tmp);
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
