import { createContext, useContext, useEffect, useRef } from "react";
import { OcrQueueManager } from "@/utils/ocrQueueManager";

const OcrContext = createContext<OcrQueueManager | null>(null);

export function OcrProvider({ children }: { children: React.ReactNode }) {
  // useRef を使って、Reactの再描画でもインスタンスが絶対に1つに保たれるようにする
  const ocrQueueRef = useRef(new OcrQueueManager());

  useEffect(() => {
    return () => {
      ocrQueueRef.current.terminate();
    }; // 終了時にクリーンアップ
  }, []);

  return (
    <OcrContext.Provider value={ocrQueueRef.current}>
      {children}
    </OcrContext.Provider>
  );
}

// 呼び出しを簡単にするカスタムHook
export const useOcrQueue = () => {
  const context = useContext(OcrContext);
  if (!context) throw new Error("OcrProvider の中で使用してください");
  return context;
};
