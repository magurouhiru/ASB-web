import Fuse from "fuse.js";
import * as v from "valibot";
import { NAME_DICT } from "./name-dict.js";
import { type Name, NameSchema } from "./values/index.js";

const fuse = new Fuse(
  NAME_DICT.flatMap((n) => Object.values(n)),
  {
    threshold: 1,
  },
);

export function searchNameFromDict(name: string): Name | null {
  const hits = fuse.search(name);
  const hit = hits.at(0)?.item;
  const found =
    NAME_DICT.find((d) => Object.values(d).some((n) => n === hit))?.en ??
    hit ??
    name;
  const result = v.safeParse(NameSchema, found);
  if (result.success) return result.output;
  else return null;
}
