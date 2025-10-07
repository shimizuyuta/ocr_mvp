"use client";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onUpload: () => void;
  loading: boolean;
  file: File | null;
}

export default function FileUpload({
  onFileSelect,
  onUpload,
  loading,
  file,
}: FileUploadProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>ファイルを選択</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {file ? file.name : "名刺の画像を選択してください"}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, JPEG形式をサポート
            </p>
          </div>
        </label>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onUpload}
          disabled={loading || !file}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>読み込み中</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              解析中...
            </>
          ) : (
            "名刺を解析"
          )}
        </button>
      </div>
    </div>
  );
}
