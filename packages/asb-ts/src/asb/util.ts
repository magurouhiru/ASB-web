import * as v from "valibot";
import { DICT, NAMES } from "./names.js";
import { type Name, NameSchema } from "./types.js";

function deleteDuplicate(list: typeof DICT) {
  const tmpList = Array.from(
    new Map(list.map((obj) => [obj.en, obj])).values(),
  );
  return Array.from(new Map(tmpList.map((obj) => [obj.ja, obj])).values());
}

export const SAFE_DICT = deleteDuplicate(DICT.filter((d) => NAMES.has(d.en)));

export function getName(name: string): Name | null {
  const target = SAFE_DICT.find((d) => d.ja === name)?.en ?? name;
  const result = v.safeParse(NameSchema, target);
  if (result.success) return result.output;
  else return null;
}
