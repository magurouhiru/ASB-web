import { createWorker, type Worker, type WorkerParams } from "tesseract.js";

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
    imageSrc: string,
    params: Partial<WorkerParams>,
  ): Promise<string> {
    // 1. 🔥 最初に「初期化が確実に完了していること」を保証する
    const worker = await this.ensureInitialized();

    // 2. 列の最後尾に自分を並ばせる
    this.queue = this.queue
      .then(async () => {
        return await this.executeOcr(worker, imageSrc, params);
      })
      .catch((error) => {
        throw error;
      });

    return this.queue;
  }

  // 実際にOCRを処理する内部関数
  private async executeOcr(
    worker: Worker,
    imageSrc: string,
    params: Partial<WorkerParams>,
  ): Promise<string> {
    const img = await this.loadImage(imageSrc);

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

  // --- ヘルパー関数群 ---
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  }
}
