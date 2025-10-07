"use client";

import type { OCRErrorResponse } from "@/lib/schema";

interface ErrorDisplayProps {
  error: OCRErrorResponse;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center text-red-600 mb-4">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>エラー</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold">エラーが発生しました</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 mb-2">{error.error}</p>
          {error.details !== undefined && (
            <details className="mt-2">
              <summary className="cursor-pointer text-red-600 font-medium">
                詳細情報
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                {JSON.stringify(error.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
