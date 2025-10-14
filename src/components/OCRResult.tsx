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

  const handleBasicInfoChange = (
    field: keyof typeof formData.basicInfo,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value || null,
      },
    }));
  };

  const handleContactsChange = (field: string, value: string) => {
    if (field.startsWith("socialMedia.")) {
      const socialField = field.split(
        ".",
      )[1] as keyof typeof formData.contacts.socialMedia;
      setFormData((prev) => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          socialMedia: {
            ...prev.contacts.socialMedia,
            [socialField]: value || null,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          [field]: value || null,
        },
      }));
    }
  };

  const handleEventInfoChange = (
    field: keyof typeof formData.eventInfo,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      eventInfo: {
        ...prev.eventInfo,
        [field]: value || null,
      },
    }));
  };

  const handleBusinessInfoChange = (
    field: string,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value || null,
      },
    }));
  };

  const handleNotesChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: value || null,
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
        <div className="space-y-8">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              基本情報
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  姓 <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.basicInfo.lastName || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("lastName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.basicInfo.firstName || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("firstName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="nameKana"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  名前（カナ）
                </label>
                <input
                  id="nameKana"
                  type="text"
                  value={formData.basicInfo.nameKana || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("nameKana", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  value={formData.basicInfo.title || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="businessCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  業界・業種
                </label>
                <input
                  id="businessCategory"
                  type="text"
                  value={formData.basicInfo.businessCategory || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("businessCategory", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

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
                  value={formData.basicInfo.email || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("email", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  固定電話番号
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.basicInfo.phone || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("phone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  携帯電話番号
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={formData.basicInfo.mobile || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("mobile", e.target.value)
                  }
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
                <input
                  id="address"
                  type="text"
                  value={formData.basicInfo.address || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("address", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* 連絡先 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              連絡先
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  value={formData.contacts.website || ""}
                  onChange={(e) =>
                    handleContactsChange("website", e.target.value)
                  }
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
                  value={formData.contacts.socialMedia?.linkedin || ""}
                  onChange={(e) =>
                    handleContactsChange("socialMedia.linkedin", e.target.value)
                  }
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
                  value={formData.contacts.socialMedia?.twitter || ""}
                  onChange={(e) =>
                    handleContactsChange("socialMedia.twitter", e.target.value)
                  }
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
                  value={formData.contacts.socialMedia?.instagram || ""}
                  onChange={(e) =>
                    handleContactsChange(
                      "socialMedia.instagram",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="facebook"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Facebook
                </label>
                <input
                  id="facebook"
                  type="text"
                  value={formData.contacts.socialMedia?.facebook || ""}
                  onChange={(e) =>
                    handleContactsChange("socialMedia.facebook", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* イベント情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              イベント情報
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  イベント開催日
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={formData.eventInfo.eventDate || ""}
                  onChange={(e) =>
                    handleEventInfoChange("eventDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="eventName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  イベント名
                </label>
                <input
                  id="eventName"
                  type="text"
                  value={formData.eventInfo.eventName || ""}
                  onChange={(e) =>
                    handleEventInfoChange("eventName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  開催地
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.eventInfo.location || ""}
                  onChange={(e) =>
                    handleEventInfoChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* ビジネス情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              ビジネス情報
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="itStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  IT導入状況
                </label>
                <input
                  id="itStatus"
                  type="text"
                  value={formData.businessInfo.itAdoptionStatus || ""}
                  onChange={(e) =>
                    handleBusinessInfoChange("itAdoptionStatus", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="aiInterest"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  AI活用への関心度
                </label>
                <select
                  id="aiInterest"
                  value={formData.businessInfo.aiInterestLevel || ""}
                  onChange={(e) =>
                    handleBusinessInfoChange("aiInterestLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">選択してください</option>
                  <option value="高い">高い</option>
                  <option value="中程度">中程度</option>
                  <option value="低い">低い</option>
                  <option value="なし">なし</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="challenges"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  経営課題
                </label>
                <textarea
                  id="challenges"
                  value={formData.businessInfo.challenges || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      businessInfo: {
                        ...prev.businessInfo,
                        challenges: e.target.value || null,
                      },
                    }));
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* 備考 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              備考
            </h4>
            <textarea
              value={formData.notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="その他のメモを入力してください"
            />
          </div>
        </div>

        {/* 保存メッセージ */}
        {saveMessage && (
          <div
            className={`mt-6 p-3 rounded-lg ${
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
