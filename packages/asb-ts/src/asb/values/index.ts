import * as v from "valibot";
import type { ValueSpecies } from "./types.js";
import { VALUE_SPECIES as ASA_VALUE_SPECIES } from "./ASA-values.js";
import { VALUE_SPECIES as BASE_VALUE_SPECIES } from "./values.js";

export * from "./types.js";
export { BASE_VALUE_SPECIES };

export const ModNameSchema = v.picklist(["BASE", "ASA"]);
export type ModName = v.InferOutput<typeof ModNameSchema>;

export interface ModValueSpecies {
  mod: ModName;
  species: ValueSpecies[];
}

export const ModValueSpecies: ModValueSpecies[] = [
  { mod: "ASA", species: ASA_VALUE_SPECIES },
];
export const AllModSpecies: ModValueSpecies[] = [
  { mod: "BASE", species: BASE_VALUE_SPECIES },
  ...ModValueSpecies,
];

export type Name = v.InferOutput<typeof NameSchema>;
export const NameSchema = v.pipe(
  v.picklist(
    AllModSpecies.flatMap((ms) => ms.species.map((s) => s.name)).filter(
      (n) => n !== undefined && n !== null,
    ),
  ),
  v.brand("ValueSpecies/Name"),
);
