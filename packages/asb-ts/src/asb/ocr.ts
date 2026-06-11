import {
  createWorker,
  type ImageLike,
  type Worker,
  type WorkerParams,
} from "tesseract.js";

export class OcrQueueManager {
  private queue: Promise<string> = Promise.resolve("");

  // 💡 初期化処理そのものを Promise として保持し、重複実行を防ぐ
  private initPromise: Promise<Worker> | null = null;

  /**
   * 💡 内部専用の初期化関数（外部から呼ぶ必要はありません）
   */
  private ensureInitialized(): Promise<Worker> {
    // すでに初期化中、または初期化済みの場合はその Promise をそのまま返す
    if (this.initPromise) {
      return this.initPromise;
    }

    // 最初の1回目だけ、新しく初期化の Promise を作成して保持する
    this.initPromise = (async () => {
      return await createWorker("jpn");
    })();

    return this.initPromise;
  }

  /**
   * 💡 呼び出し側は、いつでも・初期化を気にせず、ただ呼ぶだけでOK！
   */
  async process(
    img: ImageLike,
    params: Partial<WorkerParams>,
  ): Promise<string> {
    // 1. 🔥 最初に「初期化が確実に完了していること」を保証する
    const worker = await this.ensureInitialized();

    // 2. 列の最後尾に自分を並ばせる
    this.queue = this.queue
      .then(async () => {
        return await this.executeOcr(worker, img, params);
      })
      .catch((error) => {
        throw error;
      });

    return this.queue;
  }

  // 実際にOCRを処理する内部関数
  private async executeOcr(
    worker: Worker,
    img: ImageLike,
    params: Partial<WorkerParams>,
  ): Promise<string> {
    await worker.setParameters(params);
    const response = await worker.recognize(img);
    return response.data.text.trim();
  }

  // アプリ終了時などに明示的に破棄したい場合のみ使用
  async terminate() {
    if (this.initPromise) {
      const worker = await this.initPromise;
      await worker.terminate();
      this.initPromise = null;
    }
  }
}

interface Region {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getCropRegions(
  width: number,
  height: number,
  nameLevelYM: number,
  nameLevelDwM: number,
  nameLevelDhM: number,
  statYM: number,
  statDwM: number,
  statDhM: number,
): Region[] {
  const regions: Region[] = [];

  const nameLevelY = height * nameLevelYM;
  const nameLevelDw = height * nameLevelDwM;
  const nameLevelDh = height * nameLevelDhM;
  regions.push({
    name: "name",
    x: (width - nameLevelDw) / 2,
    y: nameLevelY,
    width: nameLevelDw,
    height: nameLevelDh,
  });
  regions.push({
    name: "level",
    x: (width - nameLevelDw) / 2,
    y: nameLevelY + nameLevelDh,
    width: nameLevelDw,
    height: nameLevelDh,
  });

  const statY = height * statYM;
  const statDw = height * statDwM;
  const statDh = height * statDhM;
  Array.from({ length: 8 }, (_, i) => i).forEach((i) => {
    regions.push({
      name: `stat_value_${i}`,
      x: width / 2,
      y: statY + statDh * i,
      width: statDw / 2,
      height: statDh,
    });
  });
  return regions;
}
