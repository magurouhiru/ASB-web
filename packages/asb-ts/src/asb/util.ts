import * as v from "valibot";
import { DICT } from "./names.js";
import { type Name, NameSchema } from "./types.js";

export function getName(name: string): Name | null {
  const target = DICT.find((d) => d.ja === name)?.en ?? name;
  const result = v.safeParse(NameSchema, target);
  if (result.success) return result.output;
  else return null;
}
