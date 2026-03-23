/*
    このファイルは、ARKStatsExtractorr から種族値を抽出するためのツールです。
    指定したパスのjsonファイルを読み込み、必要な情報だけを抜き出し、values.ts を作成します。
*/

import fs from "node:fs";
import * as v from "valibot";
import { type Species, SpeciesSchema } from "../src/asb/types/index.js";

/**
 * この関数は、指定したパスのjsonファイルを読み込み、必要な情報だけを抜き出し、Species[] 型の配列を返します。
 * 読み込むjsonファイルには以下のような構造が必要です。
 * {
 *   "species": [
 *     {
 *       "name": "SpeciesName",
 *       "fullStatsRaw": [
 *         [0, 0, 0, 0, 0, 0],
 *         [0, 0, 0, 0, 0, 0],
 *         null,
 *         ...
 *       ]
 *     },
 *     ...
 *   ]
 * }
 * @param path jsonファイルのパス
 */
function extractValues(path: string): Species[] {
  // ファイルの読み込み
  const rawData = fs.readFileSync(path, "utf-8");
  const data = JSON.parse(rawData);

  // species フィールドから Species 配列を作成
  const speciesList = (data.species as [])
    .map((item) => {
      const result = v.safeParse(SpeciesSchema, item);
      return result.success ? result.output : null;
    })
    .filter((s) => s !== null);

  return speciesList;
}

/**
 * この関数は、Species[] 型の配列を受け取り、values.ts を作成します。
 * 作成される values.ts には、以下のような内容が含まれます。
 * export const species: Species[] = [
 *   {
 *     name: "SpeciesName",
 *     fullStatsRaw: [
 *       [0, 0, 0, 0, 0, 0],
 *       [0, 0, 0, 0, 0, 0],
 *       null,
 *       ...
 *     ]
 *   },
 *   ...
 * ] as const;
 * @param species 種族値の配列
 * @param outputPath 出力ファイルのパス
 */
function createConstTs(species: Species[], outputPath: string) {
  // values.ts の内容を作成
  const content = `
// このファイルは機械的に出力されました。

  import type { Species } from "../types/index.js";

  export const SPECIES: Species[] = [\n  ${species
    .map((s) => {
      const field = [];
      if (s.name) field.push(`name:"${s.name}"`);
      field.push(`blueprintPath:"${s.blueprintPath}"`);
      if (s.variants) field.push(`variants:${JSON.stringify(s.variants)}`);
      if (s.fullStatsRaw)
        field.push(`fullStatsRaw: ${JSON.stringify(s.fullStatsRaw)}`);
      if (s.mutationMult)
        field.push(`mutationMult: ${JSON.stringify(s.mutationMult)}`);

      return `{${field.join(",")}},`;
    })
    .join("\n")
    .trim()}\n] as const;
    `;

  // ファイルを出力
  fs.writeFileSync(outputPath, content, "utf-8");
}

function main() {
  const species = extractValues(
    "./ARKStatsExtractor/ARKBreedingStats/json/values/values.json",
  );
  createConstTs(species, "./src/asb/values/values.ts");

  const ASA_species = extractValues(
    "./ARKStatsExtractor/ARKBreedingStats/json/values/ASA-values.json",
  );
  createConstTs(ASA_species, "./src/asb/values/ASA-values.ts");
}

main();
