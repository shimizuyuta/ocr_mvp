'use client';

import { OCRResponse } from '@/lib/schema';

interface OCRResultProps {
  result: OCRResponse;
}

export default function OCRResult({ result }: OCRResultProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <h3 className="text-2xl font-bold flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          解析完了
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">基本情報</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-20">名前:</span>
                <span className="text-gray-900">{result.structured.name}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-20">会社:</span>
                <span className="text-gray-900">{result.structured.company}</span>
              </div>
              {result.structured.title && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-20">役職:</span>
                  <span className="text-gray-900">{result.structured.title}</span>
                </div>
              )}
              {result.structured.department && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-20">部署:</span>
                  <span className="text-gray-900">{result.structured.department}</span>
                </div>
              )}
              {result.structured.address && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-20">住所:</span>
                  <span className="text-gray-900">{result.structured.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* 連絡先情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">連絡先</h4>
            <div className="space-y-3">
              {result.structured.email && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${result.structured.email}`} className="text-blue-600 hover:underline">
                    {result.structured.email}
                  </a>
                </div>
              )}
              {result.structured.phone && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${result.structured.phone}`} className="text-blue-600 hover:underline">
                    {result.structured.phone}
                  </a>
                </div>
              )}
              {result.structured.mobile && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <a href={`tel:${result.structured.mobile}`} className="text-blue-600 hover:underline">
                    {result.structured.mobile}
                  </a>
                </div>
              )}
              {result.structured.website && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  <a href={result.structured.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {result.structured.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 生テキスト */}
        <details className="mt-6">
          <summary className="cursor-pointer text-gray-600 font-medium hover:text-gray-800 transition-colors">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            抽出されたテキストを表示
          </summary>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-64">
              {result.text}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
