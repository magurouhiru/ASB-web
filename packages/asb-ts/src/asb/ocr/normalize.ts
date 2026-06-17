import * as R from "remeda";
import * as v from "valibot";
import {
  DISPLAY_STAT_NAME_LABELS,
  DISPLAY_STAT_NAME_RECORD,
  ImprintingSchema,
  type LogDetail,
  type NormalizeResult,
  type NormalizeType,
  type NormalizeTypeLabel,
  OCR_LABELS,
  OCR_STAT_NAME_LABELS,
  OCR_STAT_VALUE_LABELS,
  type OcrExtractedTextRecord,
  type OcrLabel,
  type OcrNormalizedTextRecord,
  type OcrNormalizeLogRecord,
  type OcrStatNameLabel,
  type OcrStatValueLabel,
  PositiveValueSchema,
  STATS_POSITION_NAME_COMBINATIONS,
  type StatsPositionCombinationValue,
  TotalLevelSchema,
  type Type,
} from "../types/index.js";
import * as c from "./normalize.core.js";

export function normalizeTexts(ocrTexts: OcrExtractedTextRecord): {
  normalizedTexts: OcrNormalizedTextRecord;
  logs: OcrNormalizeLogRecord;
} {
  const logs: OcrNormalizeLogRecord = R.fromKeys(OCR_LABELS, () => []);

  const name = normalizeText(
    ocrTexts.name,
    logs.name,
    "name",
    v.pipe(
      c.PreProcessSchema(c.preRemoveSpace, logs.name),
      c.ToSelectInputSchema,
      c.SelectProcessSchema(c.selectIfSameString, logs.name),
      c.SelectProcessSchema(c.selectFallback, logs.name),
      c.ToNormalizeInputSchema,
      c.ToStringSchema,
    ),
  );

  const level = normalizeText(
    ocrTexts.level,
    logs.level,
    "level",
    v.pipe(
      c.PreProcessSchema(c.preRemoveSpace, logs.level),
      c.ToSelectInputSchema,
      c.SelectProcessSchema(c.selectTextIfMatchTotalLevelRegExp, logs.level),
      c.ToNormalizeInputSchema,
      c.NormalizeProcessSchema(c.normalizeRemoveLevel, logs.level),
      c.ToStringSchema,
      v.nonEmpty(),
      v.toNumber(),
      TotalLevelSchema,
    ),
  );

  const ocrStatNames = R.fromKeys(OCR_STAT_NAME_LABELS, (label) =>
    normalizeText(
      ocrTexts[label],
      logs[label],
      "stat_name",
      v.pipe(
        c.PreProcessSchema(c.preRemoveSpace, logs[label]),
        c.ToSelectInputSchema,
        c.SelectProcessSchema(c.selectTextIfExactMatchStatName, logs[label]),
        c.SelectProcessSchema(c.selectTextIfPpartialMatchStatName, logs[label]),
        c.ToNormalizeInputSchema,
        c.ToStringSchema,
        v.transform(
          (input) =>
            R.pipe(
              DISPLAY_STAT_NAME_RECORD,
              R.entries(),
              R.filter(([_, names]) => names.some((name) => name === input)),
            )[0]?.[0],
        ),
        v.picklist(DISPLAY_STAT_NAME_LABELS),
      ),
    ),
  );

  const { comb } = selectStatsPositionCombinationName(ocrStatNames);

  const ocrStatValues = R.fromKeys(OCR_STAT_VALUE_LABELS, (label) => {
    const nt = comb[label];
    return nt === null
      ? normalizeText(ocrTexts[label], logs[label], nt, v.null())
      : nt === "imprinting"
        ? normalizeText(
            ocrTexts[label],
            logs[label],
            nt,
            v.pipe(
              c.PreProcessSchema(c.preRemoveSplitChar, logs[label]),
              c.PreProcessSchema(c.preRemoveSpace, logs[label]),
              c.ToSelectInputSchema,
              c.SelectProcessSchema(c.selectIf_nn_dot_n_parcent, logs[label]),
              c.SelectProcessSchema(c.selectIf_nn_parcent, logs[label]),
              c.SelectProcessSchema(c.selectIfSameString, logs[label]),
              c.SelectProcessSchema(c.selectFallback, logs[label]),
              c.ToNormalizeInputSchema,
              c.NormalizeProcessSchema(c.normalizeRemoveParcet, logs[label]),
              c.ToStringSchema,
              v.toNumber(),
              ImprintingSchema,
            ),
          )
        : nt === "meleeDamageMultiplier"
          ? normalizeText(
              ocrTexts[label],
              logs[label],
              nt,
              v.pipe(
                c.PreProcessSchema(c.preRemoveSplitChar, logs[label]),
                c.PreProcessSchema(c.preRemoveSpace, logs[label]),
                c.ToSelectInputSchema,
                c.SelectProcessSchema(c.selectIf_nn_dot_n_parcent, logs[label]),
                c.SelectProcessSchema(c.selectIf_nn_parcent, logs[label]),
                c.SelectProcessSchema(c.selectIfSameString, logs[label]),
                c.SelectProcessSchema(c.selectFallback, logs[label]),
                c.ToNormalizeInputSchema,
                c.NormalizeProcessSchema(c.normalizeRemoveParcet, logs[label]),
                c.NormalizeProcessSchema(
                  c.normalizeAddDotIfNotExistDot,
                  logs[label],
                ),
                c.ToStringSchema,
                v.toNumber(),
                PositiveValueSchema,
              ),
            )
          : normalizeText(
              ocrTexts[label],
              logs[label],
              nt,
              v.pipe(
                c.PreProcessSchema(c.preRemoveSplitChar, logs[label]),
                c.PreProcessSchema(c.preRemoveSpace, logs[label]),
                c.ToSelectInputSchema,
                c.SelectProcessSchema(
                  c.selectIf_nn_dot_n_slash_nn_dot_n,
                  logs[label],
                ),
                c.SelectProcessSchema(
                  c.selectIf_nn_dot_n_7_nn_dot_n,
                  logs[label],
                ),
                c.SelectProcessSchema(c.selectIfSameString, logs[label]),
                c.SelectProcessSchema(c.selectFallback, logs[label]),
                c.ToNormalizeInputSchema,
                c.NormalizeProcessSchema(
                  c.normalizeSplitIf_nn_dot_n_slash_nn_dot_n,
                  logs[label],
                ),
                c.NormalizeProcessSchema(
                  c.normalizeSplitIf_nn_dot_n_7_nn_dot_n,
                  logs[label],
                ),
                c.NormalizeProcessSchema(
                  c.normalizeSplitIf_nn_dot_n_7_nn,
                  logs[label],
                ),
                c.NormalizeProcessSchema(
                  c.normalizeAddDotIfNotExistDot,
                  logs[label],
                ),
                c.ToStringSchema,
                v.toNumber(),
                PositiveValueSchema,
              ),
            );
  });

  return {
    normalizedTexts: {
      name,
      level,

      ...ocrStatNames,
      ...ocrStatValues,
    },
    logs,
  };
}

function normalizeText<T extends NormalizeTypeLabel>(
  texts: OcrExtractedTextRecord[OcrLabel],
  log: LogDetail[],
  type: T,
  schema: v.GenericSchema<unknown, NormalizeType<T>, v.GenericIssue>,
): NormalizeResult<T> {
  const result = v.safeParse<typeof schema>(schema, { texts });
  if (result.success) {
    return { type, text: result.output };
  } else {
    const flatError = v.flatten(result.issues);
    log.push({
      isValibotError: true,
      action: "valibot safeParse",
      flatError,
    });
    return { type, text: null };
  }
}

function selectStatsPositionCombinationName(
  ocrStatNames: Pick<OcrNormalizedTextRecord, OcrStatNameLabel>,
): StatsPositionCombinationValue {
  const found = STATS_POSITION_NAME_COMBINATIONS.find(({ comb }) =>
    R.pipe(
      comb,
      R.entries(),
      R.map(
        ([ol, dl]) =>
          ocrStatNames[ol].text === dl || ocrStatNames[ol].text === null,
      ),
      R.reduce((acc, v) => acc && v, true),
    ),
  );
  if (!found) throw new Error("miss match type");
  return {
    type: found.type,
    hasOxygen: found.hasOxygen,
    comb: R.fromKeys(
      OCR_STAT_VALUE_LABELS,
      (label) => found.comb[toStatNameLabel(label)],
    ),
  };
}

function toStatNameLabel(label: OcrStatValueLabel): OcrStatNameLabel {
  switch (label) {
    case "stat_value_0":
      return "stat_name_0";
    case "stat_value_1":
      return "stat_name_1";
    case "stat_value_2":
      return "stat_name_2";
    case "stat_value_3":
      return "stat_name_3";
    case "stat_value_4":
      return "stat_name_4";
    case "stat_value_5":
      return "stat_name_5";
    case "stat_value_6":
      return "stat_name_6";
    case "stat_value_7":
      return "stat_name_7";
    case "stat_value_8":
      return "stat_name_8";
    case "stat_value_9":
      return "stat_name_9";
  }
}
