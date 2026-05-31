export type StatsName = (typeof StatsNames)[number];
export const StatsNames = [
  "health",
  "stamina",
  "oxygen",
  "food",

  "water",
  "temperature",
  "weight",
  "meleeDamageMultiplier",

  "speedMultiplier",
  "temperatureFortitude",
  "craftingSpeedMultiplier",
  "torpidity",
] as const;
