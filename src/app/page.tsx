"use client";

import { useState } from "react";
import type { OCRResponse, OCRErrorResponse } from "@/lib/schema";
import FileUpload from "@/components/FileUpload";
import OCRResult from "@/components/OCRResult";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<OCRResponse | OCRErrorResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: OCRResponse | OCRErrorResponse = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Upload error:", error);
      const errorResponse: OCRErrorResponse = {
        error: error instanceof Error ? error.message : "Unknown error",
      };
      setResult(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              名刺OCR解析
            </h1>
            <p className="text-gray-600">
              名刺の画像をアップロードして、自動で情報を抽出します
            </p>
          </div>

          {/* アップロードエリア */}
          <FileUpload
            onFileSelect={setFile}
            onUpload={handleUpload}
            loading={loading}
            file={file}
          />

          {/* 結果表示エリア */}
          {result &&
            ("error" in result ? (
              <ErrorDisplay error={result} />
            ) : (
              <OCRResult result={result} />
            ))}
        </div>
      </div>
    </div>
  );
}
