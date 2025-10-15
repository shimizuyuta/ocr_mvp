import { type NextRequest, NextResponse } from "next/server";
import { DocumentAIService } from "@/lib/document-ai-service";
import { fileToBase64, getMimeType } from "@/lib/file-utils";
import { LLMService } from "@/lib/llm-service";
import { getRandomMockData } from "@/lib/mock-data";
import type { OCRErrorResponse, OCRResponse } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // モックモードのチェック
    // ローカル開発環境では自動的にモックを使用
    const isLocalDev = process.env.NODE_ENV === "development";
    const isMockEnabled = process.env.OCR_MOCK_MODE === "true";
    const isMockDisabled = process.env.OCR_MOCK_MODE === "false";

    // ローカル開発環境でモックが明示的に無効化されていない場合はモックを使用
    const shouldUseMock = (isLocalDev && !isMockDisabled) || isMockEnabled;

    if (shouldUseMock) {
      console.log("🔧 Mock mode enabled - returning mock data");
      // モックデータを返す
      const mockData = getRandomMockData();
      return NextResponse.json<OCRResponse>(mockData);
    }

    // ファイル取得
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json<OCRErrorResponse>(
        { error: "ファイルがアップロードされていません" },
        { status: 400 },
      );
    }

    // ファイル処理
    const buffer = await fileToBase64(file);
    const mimeType = getMimeType(file);

    // Document AI でテキスト抽出
    const documentAI = new DocumentAIService();
    const extractedText = await documentAI.extractText(buffer, mimeType);

    if (!extractedText) {
      return NextResponse.json<OCRErrorResponse>(
        { error: "OCR結果が空です" },
        { status: 400 },
      );
    }

    // LLM で構造化
    const llmService = new LLMService();
    const llmData = await llmService.parseBusinessCard(extractedText);
    // 欠損フィールドを既定値で正規化
    const structuredData = {
      ...llmData,
      eventInfo: { eventDate: null, eventName: null, location: null },
      businessInfo: {
        challenges: null,
        itAdoptionStatus: null,
        aiInterestLevel: null,
      },
      notes: null,
    };

    return NextResponse.json<OCRResponse>({
      text: extractedText,
      structured: structuredData,
    });
  } catch (error) {
    console.error("[OCR Processing Error]", error);

    // エラーの種類に応じて適切なレスポンスを返す
    if (error instanceof Error) {
      return NextResponse.json<OCRErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json<OCRErrorResponse>(
      { error: "処理中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
