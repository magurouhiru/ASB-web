import Tesseract, { createWorker, PSM, type WorkerParams } from "tesseract.js";

export interface OcrTaskConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  whitelist: string;
}

export class OcrQueueManager {
  private worker: Tesseract.Worker | null = null;
  private queue: Promise<any> = Promise.resolve();

  // 💡 初期化処理そのものを Promise として保持し、重複実行を防ぐ
  private initPromise: Promise<void> | null = null;

  /**
   * 💡 内部専用の初期化関数（外部から呼ぶ必要はありません）
   */
  private ensureInitialized(): Promise<void> {
    // すでに初期化中、または初期化済みの場合はその Promise をそのまま返す
    if (this.initPromise) {
      return this.initPromise;
    }

    // 最初の1回目だけ、新しく初期化の Promise を作成して保持する
    this.initPromise = (async () => {
      console.log("Tesseract.js Worker を遅延初期化しています...");
      this.worker = await createWorker("jpn");
      console.log("Worker の準備が完了しました。");
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
    await this.ensureInitialized();

    // 2. 列の最後尾に自分を並ばせる
    this.queue = this.queue.then(async () => {
      return await this.executeOcr(imageSrc, params);
    });

    return this.queue;
  }

  // 実際にOCRを処理する内部関数
  private async executeOcr(
    imageSrc: string,
    params: Partial<WorkerParams>,
  ): Promise<string> {
    if (!this.worker) throw new Error();
    const img = await this.loadImage(imageSrc);

    await this.worker.setParameters(params);

    const response = await this.worker.recognize(img);
    return response.data.text.trim();
  }

  // アプリ終了時などに明示的に破棄したい場合のみ使用
  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
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

  private cropAndScale(
    img: HTMLImageElement,
    config: OcrTaskConfig,
    scale: number = 2,
  ): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    canvas.width = config.w * scale;
    canvas.height = config.h * scale;
    ctx.drawImage(
      img,
      config.x,
      config.y,
      config.w,
      config.h,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    return canvas.toDataURL("image/png");
  }
}

// 共通インスタンスを export
export const ocrQueue = new OcrQueueManager();
