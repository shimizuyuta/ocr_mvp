import { NextRequest, NextResponse } from 'next/server';
import { OCRResponse, OCRErrorResponse } from '@/lib/schema';
import { getMimeType, fileToBase64 } from '@/lib/file-utils';
import { DocumentAIService } from '@/lib/document-ai-service';
import { LLMService } from '@/lib/llm-service';

export const runtime = 'nodejs';


export async function POST(req: NextRequest) {
  try {
    // ファイル取得
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json<OCRErrorResponse>(
        { error: 'ファイルがアップロードされていません' }, 
        { status: 400 }
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
        { error: 'OCR結果が空です' }, 
        { status: 400 }
      );
    }

    // LLM で構造化
    const llmService = new LLMService();
    const structuredData = await llmService.parseBusinessCard(extractedText);

    return NextResponse.json<OCRResponse>({
      text: extractedText,
      structured: structuredData,
    });

  } catch (error) {
    console.error('[OCR Processing Error]', error);
    
    // エラーの種類に応じて適切なレスポンスを返す
    if (error instanceof Error) {
      return NextResponse.json<OCRErrorResponse>(
        { error: error.message }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json<OCRErrorResponse>(
      { error: '処理中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}
