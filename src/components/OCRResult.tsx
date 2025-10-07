"use client";

import { useState } from "react";
import type { BusinessCardData, OCRResponse } from "@/lib/schema";

interface OCRResultProps {
  result: OCRResponse;
}

export default function OCRResult({ result }: OCRResultProps) {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessCardData>(result.structured);

  const handleSaveToSheets = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/save-to-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessCard: formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage("✅ スプレッドシートに保存しました！");
        if (data.spreadsheetUrl) {
          // 新しいタブでスプレッドシートを開く
          window.open(data.spreadsheetUrl, "_blank");
        }
      } else {
        setSaveMessage(`❌ 保存に失敗しました: ${data.message}`);
      }
    } catch (error) {
      console.error("Save to sheets error:", error);
      setSaveMessage("❌ 保存中にエラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof BusinessCardData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || null,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>解析完了</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            解析完了
          </h3>
          <button
            type="button"
            onClick={handleSaveToSheets}
            disabled={saving}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>保存中</title>
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
                保存中...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>スプレッドシートに保存</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                スプシに保存
              </>
            )}
          </button>
        </div>
      </div>

      <form className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              基本情報
            </h4>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  名前 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="name_kana"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  名前（カナ）
                </label>
                <input
                  id="name_kana"
                  type="text"
                  value={formData.name_kana || ""}
                  onChange={(e) => handleChange("name_kana", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  会社 <span className="text-red-500">*</span>
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company || ""}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  役職
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  部署
                </label>
                <input
                  id="department"
                  type="text"
                  value={formData.department || ""}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  住所
                </label>
                <textarea
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* 連絡先情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              連絡先
            </h4>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  電話番号
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  携帯電話
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={formData.mobile || ""}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="fax"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  FAX
                </label>
                <input
                  id="fax"
                  type="tel"
                  value={formData.fax || ""}
                  onChange={(e) => handleChange("fax", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  郵便番号
                </label>
                <input
                  id="zip"
                  type="text"
                  value={formData.zip || ""}
                  onChange={(e) => handleChange("zip", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ウェブサイト
                </label>
                <input
                  id="website"
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin || ""}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Twitter
                </label>
                <input
                  id="twitter"
                  type="text"
                  value={formData.twitter || ""}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="instagram"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Instagram
                </label>
                <input
                  id="instagram"
                  type="text"
                  value={formData.instagram || ""}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="qr_code_url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  QRコードURL
                </label>
                <input
                  id="qr_code_url"
                  type="url"
                  value={formData.qr_code_url || ""}
                  onChange={(e) => handleChange("qr_code_url", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  メモ
                </label>
                <textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 保存メッセージ */}
        {saveMessage && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              saveMessage.includes("✅")
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium">{saveMessage}</span>
            </div>
          </div>
        )}

        {/* 生テキスト */}
        <details className="mt-6">
          <summary className="cursor-pointer text-gray-600 font-medium hover:text-gray-800 transition-colors">
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>テキストを表示</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            抽出されたテキストを表示
          </summary>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-64">
              {result.text}
            </pre>
          </div>
        </details>
      </form>
    </div>
  );
}
