import * as v from "valibot";
import { calculateLevel } from "./asb/calculator.js";
import { getStats } from "./asb/stats.js";
import { type Levels, type ValuesIn, ValuesSchema } from "./asb/types/io.js";
import { searchNameFromDict } from "./asb/util.js";

export * from "./asb/calculator.js";
export * from "./asb/name-dict.js";
export * from "./asb/stats.js";
export * from "./asb/types/index.js";
export * from "./asb/util.js";

export function calcL(value: {
  name: string;
  health: number;
  stamina: number;
  oxygen: number;
  food: number;
  weight: number;
  meleeDamageMultiplier: number;
  torpidity: number;
}): Levels | null {
  const n = searchNameFromDict(value.name);
  if (!n) return null;
  const stats = getStats(n);
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
  const result = calculateLevel(stats, valuesParsed.output);
  return result;
}
