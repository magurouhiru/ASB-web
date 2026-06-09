import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";

export const Route = createFileRoute("/ocr")({
  component: OcrComponent,
});

function OcrComponent() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [status, setStatus] = useState<string>("初期化中...");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 📊 進捗率（パーセント）を管理するステート（0 から 100）
  const [progress, setProgress] = useState<number>(0);

  const workerRef = useRef<any>(null);

  useEffect(() => {
    async function loadWorker() {
      try {
        // 💡 ポイント: オプションオブジェクトに logger を指定する
        const worker = await createWorker("jpn", 1, {
          logger: (m) => {
            // m.status には 'loading tesseract core' や 'recognizing text' などが入ります
            if (m.status === "recognizing text") {
              // m.progress は 0.0 〜 1.0 の小数点なので、100倍して丸める
              setProgress(Math.round(m.progress * 100));
            }
          },
        });
        workerRef.current = worker;
        setStatus("準備完了");
      } catch (error) {
        console.error(error);
        setStatus("初期化失敗");
      }
    }
    loadWorker();

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageSrc(URL.createObjectURL(files[0]));
      setOcrText("");
      setProgress(0); // 💡 新しい画像が選ばれたら進捗をリセット
    }
  };

  const handleOcrRun = async () => {
    if (!imageSrc || !workerRef.current) return;

    setIsProcessing(true);
    setStatus("文字を認識中...");
    setProgress(0); // スタート時は 0％

    try {
      const {
        data: { text },
      } = await workerRef.current.recognize(imageSrc);
      setOcrText(text);
      setStatus("認識完了！");
    } catch (error) {
      console.error(error);
      setStatus("失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>プログレスバー付き OCR</h2>
      <p>状態: {status}</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isProcessing}
      />
      <button
        type="button"
        onClick={handleOcrRun}
        disabled={!imageSrc || isProcessing || !workerRef.current}
      >
        実行
      </button>

      {/* 💡 処理中にプログレスバーと％の数字を表示する */}
      {isProcessing && (
        <div style={{ marginTop: "15px", maxWidth: "300px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span>解析進捗:</span>
            <span>{progress}%</span>
          </div>
          {/* HTML標準の進捗バータグ。maxに100、valueに進捗ステートを渡すだけ */}
          <progress
            value={progress}
            max="100"
            style={{ width: "100%", height: "10px" }}
          />
        </div>
      )}

      {/* プレビューと結果の表示領域 */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* 左側：選択した画像 */}
        {imageSrc && (
          <div style={{ flex: 1 }}>
            <h3>選択された画像:</h3>
            <img
              src={imageSrc}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        {/* 右側：OCRの認識結果 */}
        {ocrText && (
          <div style={{ flex: 1 }}>
            <h3>認識結果（テキスト）:</h3>
            <pre
              style={{
                background: "#f5f5f5",
                padding: "15px",
                border: "1px solid #ddd",
                whiteSpace: "pre-wrap", // 改行をそのまま表示
                wordBreak: "break-all",
              }}
            >
              {ocrText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
