import Fuse from "fuse.js";
import * as v from "valibot";
import { NameDicts } from "./migration/name-dict/index.js";
import {
  AllModSpecies,
  type FullStatsRaw,
  type ModName,
  type StatsRow,
} from "./migration/values/index.js";
import type { Variant } from "./migration/variants/index.js";
import {
  type Settings,
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

// Index of the base value in fullStatsRaw.
const StatsRawIndexBase = 0;

// Index of the increase per wild level value in fullStatsRaw.
const StatsRawIndexIncPerWildLevel = 1;

// Index of the increase per dom level value in fullStatsRaw.
const StatsRawIndexIncPerDomLevel = 2;

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

export function getSpeciesList(settings: Settings): Species[] {
  const searchTarget = AllModSpecies.filter(
    (ms) => ms.mod === null || settings.mods.includes(ms.mod),
  );
  const tmpMap = new Map<
    string,
    {
      name: string;
      blueprintPath: string;
      variants: Variant[];
      mod: ModName | null;
      stats: FullStatsRaw | null;
    }
  >();
  searchTarget.forEach((ms) => {
    ms.species.forEach((s) => {
      const value = tmpMap.get(s.blueprintPath);
      if (value) {
        if (s.variants && s.variants.length > 0) value.variants = s.variants;
        value.mod = ms.mod;
        if (s.fullStatsRaw) value.stats = s.fullStatsRaw;
      } else {
        const nameEntry = NameDicts.ja.find((n) => n.source === s.name);
        if (!nameEntry) return;
        tmpMap.set(s.blueprintPath, {
          name: `${nameEntry.translation}(${nameEntry.source})`,
          blueprintPath: s.blueprintPath,
          variants: s.variants ?? [],
          mod: ms.mod,
          stats: s.fullStatsRaw ?? null,
        });
      }
    });
  });
  return Array.from(tmpMap.values())
    .filter(
      (s) => !s.variants.some((v) => settings.variantsUnselected.includes(v)),
    )
    .map((s) => {
      if (s.stats === null) return null;
      const result = v.safeParse(SpeciesSchema, {
        ...s,
        stats: toStats(s.stats),
      } satisfies SpeciesIn);
      return result.success ? result.output : null;
    })
    .filter((s) => s !== null)
    .sort((a, b) => a.name.localeCompare(b.name, "ja"));
}

export function searchSpecies(
  speciesList: Species[],
  name: string,
  settings: Settings,
): Species | null {
  const fuse = new Fuse(
    speciesList.map((s) => s.name),
    {
      threshold: 1,
    },
  );
  const hit = fuse.search(name).at(0)?.item;
  if (!hit) return null;
  const found = speciesList
    .filter((s) => s.name === hit)
    .sort((a, b) => a.variants.length - b.variants.length)
    .sort((a, b) => {
      const aHasVariant = settings.variants.some((v) => a.variants.includes(v));
      const bHasVariant = settings.variants.some((v) => b.variants.includes(v));
      if (aHasVariant && !bHasVariant) return -1;
      if (!aHasVariant && bHasVariant) return 1;
      return 0;
    });

  return found[0] || null;
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
    incPerDomLevel: row[StatsRawIndexIncPerDomLevel],
  } satisfies SpeciesStatIn);
}
