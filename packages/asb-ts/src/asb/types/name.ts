import * as v from "valibot";

export const Name = v.pipe(v.string(), v.brand("Name"));
