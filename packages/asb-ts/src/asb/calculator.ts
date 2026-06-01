import * as v from "valibot";
import {
  BRED_TE,
  type CalculateLevelInputPack,
  type CalculateValueInputPack,
  DEFAULT_STAT_IMPRINT_MULTIPLIER,
  DEFAULT_TBHM,
  type Imprinting,
  type LevelDetail,
  type Levels,
  LevelsSchema,
  MAX_TE,
  MIN_TE,
  type Settings,
  type Species,
  type SpeciesStat,
  type StatMultiplierItem,
  type Stats,
  type TameEffectiveness,
  TameEffectivenessSchema,
  type Values,
  ValuesSchema,
} from "./types/index.js";
import { type StatsName, StatsNames } from "./types/stats-name.js";

export function calculateValueController(ip: CalculateValueInputPack): Values {
  let result: { [k: string]: number } | null = null;
  switch (ip.type) {
    case "wild": {
      result = calculateValueWild(ip);
      break;
    }
    case "dom":
    case "bred": {
      result = calculateValueDom(ip);
      break;
    }
  }
  return v.parse(
    v.message(
      ValuesSchema,
      `error in calculateValueController: result: ${JSON.stringify(result)}, ip: ${JSON.stringify(ip)}`,
    ),
    result,
  );
}

function calculateValueWild(
  ip: Extract<CalculateValueInputPack, { type: "wild" }>,
) {
  return Object.fromEntries(
    StatsNames.map((sn) => [
      sn,
      round(
        cVw(
          ip.levels[sn],
          ip.species.stats[sn],
          ip.settings.statMultipliers[sn],
        ),
        sn,
      ),
    ]),
  );
}

function calculateValueDom(
  ip: Exclude<CalculateValueInputPack, { type: "wild" }>,
) {
  return Object.fromEntries(
    StatsNames.map((sn) => [
      sn,
      round(
        cVpt(
          sn,
          ip.levels[sn],
          ip.tameEffectiveness,
          ip.imprinting,
          ip.species,
          ip.settings,
        ),
        sn,
      ),
    ]),
  );
}

const PRECISION_10 = 10;
const PRECISION_1000 = 1000; // 近接攻撃力は%で表示されるので小数点以下3桁まで表示する。
const PRECISION_1000_TARGET: StatsName[] = ["meleeDamageMultiplier"];

function round(num: number, sn: StatsName): number {
  const precision = PRECISION_1000_TARGET.includes(sn)
    ? PRECISION_1000
    : PRECISION_10;
  return Math.round(num * precision) / precision;
}

function cVw(
  ld: LevelDetail,
  stat: Stats[StatsName],
  smi: StatMultiplierItem,
): number {
  if (!stat) return 0;
  return stat.baseValue * (1 + ld.wild * stat.incPerWildLevel * smi.IwM);
}

function cVpt(
  sn: StatsName,
  ld: LevelDetail,
  te: TameEffectiveness,
  imprinting: Imprinting,
  species: Species,
  settings: Settings,
): number {
  const stat = species.stats[sn];
  if (!stat) return 0;
  const tbhm =
    sn === "health"
      ? (species.tamedBaseHealthMultiplier ?? DEFAULT_TBHM)
      : DEFAULT_TBHM;
  const statImprintMultiplier =
    species.statImprintMultiplier?.[sn] ?? DEFAULT_STAT_IMPRINT_MULTIPLIER[sn];
  const smi = settings.statMultipliers[sn];

  const vw = cVw(ld, stat, smi);
  const tmp1 =
    vw * tbhm * (1 + imprinting * statImprintMultiplier * settings.IBM);
  // テイム時の加算ボーナスがマイナスの時はTaM(サーバーの設定)を掛けない。
  // 公式の計算式にはないけどARKStatsExtractor/ARKBreedingStats/values/Values.cs:576行付近にコメントとして記述してある
  const addBounus =
    stat.additiveBonus > 0 ? stat.additiveBonus * smi.TaM : stat.additiveBonus;
  const tmp2 = addBounus;
  // テイム時の乗算ボーナスがマイナスの時はTmM(サーバーの設定)を掛けない。
  // 公式の計算式にはないけどARKStatsExtractor/ARKBreedingStats/values/Values.cs:580行付近にコメントとして記述してある
  const multiplicativeBonus =
    stat.multiplicativeBonus > 0
      ? stat.multiplicativeBonus * smi.TmM
      : stat.multiplicativeBonus;
  const tmp3 = 1 + te * multiplicativeBonus;
  return (tmp1 + tmp2) * tmp3;
}

export function calculateLevelController(
  ip: CalculateLevelInputPack,
): [Levels, TameEffectiveness] {
  let levels: { [k: string]: LevelDetail } | null = null;
  let te = NaN;
  switch (ip.type) {
    case "wild": {
      levels = calculateLevelWild(ip);
      te = 0;
      break;
    }
    case "dom": {
      [levels, te] = calculateLevelDom(ip);
      break;
    }
    case "bred": {
      levels = calculateLevelBred(ip);
      te = BRED_TE;
      break;
    }
  }

  return [
    v.parse(
      v.message(
        LevelsSchema,
        `error in calculateLevelController: levels: ${JSON.stringify(levels)}, ip: ${JSON.stringify(ip)}`,
      ),
      levels,
    ),
    v.parse(
      v.message(
        TameEffectivenessSchema,
        `error in calculateLevelController: te: ${te}, ip: ${JSON.stringify(ip)}`,
      ),
      te,
    ),
  ];
}

function calculateLevelWild(
  ip: Extract<CalculateLevelInputPack, { type: "wild" }>,
): { [k: string]: LevelDetail } {
  return Object.fromEntries(StatsNames.map((sn) => [sn, cLw(sn, ip)]));
}

function calculateLevelDom(
  ip: Extract<CalculateLevelInputPack, { type: "dom" }>,
): [{ [k: string]: LevelDetail }, number] {
  let bufError = Number.MAX_SAFE_INTEGER;
  let bufLevels: { [k: string]: LevelDetail } | null = null;
  let bufTe: number | null = null;
  for (let te = MIN_TE * 100; te <= MAX_TE * 100; te += 1) {
    const teParsent = te / 100;
    const tmp = calculateLevelDomCore(teParsent, ip);
    const error = Object.values(tmp).reduce(
      (acc, v) => acc + (v.error ?? 0),
      0,
    );
    if (error <= bufError) {
      bufError = error;
      bufLevels = tmp;
      bufTe = teParsent;
    }
  }
  if (!bufLevels || !bufTe) throw new Error("calculateLevelDomがなんかへん");
  return [bufLevels, bufTe];
}

function calculateLevelBred(
  ip: Extract<CalculateLevelInputPack, { type: "bred" }>,
): { [k: string]: LevelDetail } {
  return calculateLevelDomCore(BRED_TE, ip);
}

function calculateLevelDomCore(
  te: number,
  ip: Exclude<CalculateLevelInputPack, { type: "wild" }>,
): { [k: string]: LevelDetail } {
  return Object.fromEntries(StatsNames.map((sn) => [sn, cLpt(sn, te, ip)]));
}

const MAX_LEVEL = 500; // とりあえずレベル500まで計算する。これ以上は現実的に存在しないと思うので。

function cLw(
  sn: StatsName,
  ip: Extract<CalculateLevelInputPack, { type: "wild" }>,
): LevelDetail {
  const stat = ip.species.stats[sn];
  const value = ip.values[sn];
  if (!stat || stat.incPerWildLevel <= 0 || value <= 0)
    return { wild: 0, error: null };
  let bufVw = 0;
  for (let level = 0; level <= MAX_LEVEL; level++) {
    const tmpVw = round(
      cVw(
        { wild: level },
        ip.species.stats[sn],
        ip.settings.statMultipliers[sn],
      ),
      sn,
    );
    if (tmpVw === value) {
      return { wild: level, error: null };
    } else if (tmpVw > value) {
      const bufDiff = calculateError(value, bufVw, stat);
      const tmpDiff = calculateError(value, tmpVw, stat);
      if (bufDiff < tmpDiff) {
        return { wild: level - 1, error: bufDiff };
      } else {
        return { wild: level, error: tmpDiff };
      }
    }
    bufVw = tmpVw;
  }
  throw new Error(
    `error in cLw: species name: ${ip.species.name}, stats name: ${sn}`,
    { cause: ip },
  );
}

function cLpt(
  sn: StatsName,
  te: number,
  ip: Exclude<CalculateLevelInputPack, { type: "wild" }>,
): LevelDetail {
  const stat = ip.species.stats[sn];
  const value = ip.values[sn];
  if (!stat || stat.incPerWildLevel <= 0 || value <= 0)
    return { wild: 0, error: null };
  let bufVpt = 0;
  for (let level = 0; level <= MAX_LEVEL; level++) {
    const tmpVpt = round(
      cVpt(
        sn,
        { wild: level },
        te as TameEffectiveness,
        ip.imprinting,
        ip.species,
        ip.settings,
      ),
      sn,
    );
    if (tmpVpt === value) {
      return { wild: level, error: null };
    } else if (tmpVpt > value) {
      const bufDiff = calculateError(value, bufVpt, stat);
      const tmpDiff = calculateError(value, tmpVpt, stat);
      if (bufDiff < tmpDiff) {
        return { wild: level - 1, error: bufDiff };
      } else {
        return { wild: level, error: tmpDiff };
      }
    }
    bufVpt = tmpVpt;
  }
  throw new Error(
    `error in cLpt: species name: ${ip.species.name}, stats name: ${sn}`,
    { cause: ip },
  );
}

function calculateError(
  except: number,
  actual: number,
  stat: SpeciesStat,
): number {
  return Math.abs(except - actual) / stat.baseValue;
}
