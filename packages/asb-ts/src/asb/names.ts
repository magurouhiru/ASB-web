import { SPECIES as ASA_SPECIES } from "./ASA-values.js";
import { SPECIES } from "./values.js";

export const NAMES = new Set(
  [SPECIES, ASA_SPECIES]
    .flat()
    .map((s) => s.name)
    .filter((n) => n !== undefined),
);
