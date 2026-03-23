import * as v from "valibot";
import type { Species } from "../types/index.js";
import { SPECIES as ASA_SPECIES } from "./ASA-values.js";
import { SPECIES } from "./values.js";

export const ALL_SPECIES: Species[] = [SPECIES, ASA_SPECIES].flat();
export type Name = v.InferOutput<typeof NameSchema>;
export const NameSchema = v.pipe(
  v.picklist(
    ALL_SPECIES.map((s) => s.name).filter((n) => n !== undefined && n !== null),
  ),
  v.brand("Species/Name"),
);
