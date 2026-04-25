import Fuse from "fuse.js";
import * as v from "valibot";
import { NameDicts } from "./migration/name-dict/index.js";
import { type Name, NameSchema } from "./migration/values/index.js";

const fuse = new Fuse(
  NameDicts.ja.flatMap((n) => Object.values(n)),
  {
    threshold: 1,
  },
);

export function searchNameFromDict(name: string): Name | null {
  const hits = fuse.search(name);
  const hit = hits.at(0)?.item;
  const found =
    NameDicts.ja.find((d) => Object.values(d).some((n) => n === hit))?.source ??
    hit ??
    name;
  const result = v.safeParse(NameSchema, found);
  if (result.success) return result.output;
  else return null;
}
