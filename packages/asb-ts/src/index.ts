import * as v from "valibot";
import { calculateLevel } from "./asb/calculator.js";
import { getSpecies } from "./asb/species.js";
import { type Levels, type ValuesIn, ValuesSchema } from "./asb/types/io.js";
import type { Species } from "./asb/types/species.js";
import { searchNameFromDict } from "./asb/util.js";

export * from "./asb/calculator.js";
export * from "./asb/name-dict.js";
export * from "./asb/species.js";
export * from "./asb/types/index.js";
export * from "./asb/util.js";
export * from "./asb/variants/index.js";

export function calcL(value: {
  name: string;
  health: number;
  stamina: number;
  oxygen: number;
  food: number;
  weight: number;
  meleeDamageMultiplier: number;
  torpidity: number;
}): { species: Species; result: Levels } | null {
  const n = searchNameFromDict(value.name);
  if (!n) return null;
  const species = getSpecies(n);
  const valuesParsed = v.safeParse(ValuesSchema, {
    health: value.health,
    stamina: value.stamina,
    oxygen: value.oxygen,
    food: value.food,
    water: 0,
    temperature: 0,
    weight: value.weight,
    meleeDamageMultiplier: value.meleeDamageMultiplier,
    speedMultiplier: 0,
    temperatureFortitude: 0,
    craftingSpeedMultiplier: 0,
    torpidity: value.torpidity,
  } satisfies ValuesIn);
  if (!valuesParsed.success) return null;
  const result = calculateLevel(species.stats, valuesParsed.output);
  return { species, result };
}
