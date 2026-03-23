import * as v from "valibot";

export const PositiveValueSchema = v.pipe(v.number(), v.minValue(0));
export const PositiveNot0ValueSchema = v.pipe(
  PositiveValueSchema,
  v.notValue(0),
);
