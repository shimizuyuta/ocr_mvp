import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import OpenAI from 'openai';
import { GoogleAuth } from 'google-auth-library';
import { BusinessCardSchema, OCRResponse, OCRErrorResponse } from '@/lib/schema';

export const runtime = 'nodejs';

// OpenAI クライアント
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json<OCRErrorResponse>({ error: 'ファイルがアップロードされていません' }, { status: 400 });
    }

    // ファイル → Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // MIME Type 推定
    let mimeType = file.type;
    if (!mimeType || mimeType === '') {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (fileName.endsWith('.png')) mimeType = 'image/png';
      else if (fileName.endsWith('.pdf')) mimeType = 'application/pdf';
      else mimeType = 'application/octet-stream';
    }

    // 🔑 Google 認証
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string);
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // 📄 Document AI OCR
    const client = new DocumentProcessorServiceClient({ auth });
    const name = `projects/${credentials.project_id}/locations/${process.env.DOC_AI_LOCATION}/processors/${process.env.DOC_AI_PROCESSOR_ID}`;
    const request = {
      name,
      rawDocument: {
        content: buffer.toString('base64'),
        mimeType,
      },
    };

    const [result] = await client.processDocument(request);
    const document = result.document;

    const extractedText = document?.text || '';
    if (!extractedText) {
      return NextResponse.json<OCRErrorResponse>({ error: 'OCR結果が空です' }, { status: 400 });
    }

    // 🤖 LLM で名刺情報を構造化
    const prompt = `
    以下の名刺テキストを解析して、次のJSONフォーマットで返してください。
    値が無い場合は null を設定してください。
    JSON以外は出力しないでください。
    「Mobile」は携帯番号、「Phone」は会社の代表電話を入れてください。
    QRコードURLが名刺上にある場合は "qr_code_url" に記入してください。
    
    フォーマット:
    {
      "name": "",
      "name_kana": "",
      "company": "",
      "department": "",
      "title": "",
      "email": "",
      "phone": "",
      "mobile": "",
      "fax": "",
      "zip": "",
      "address": "",
      "website": "",
      "linkedin": "",
      "twitter": "",
      "instagram": "",
      "qr_code_url": "",
      "notes": ""
    }
    
    テキスト:
    ${extractedText}
    `;

    const llmResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    });

    let parsedJSON: any = {};
    let content;
    try {
       content = llmResponse.choices[0].message?.content ?? '{}';
       // JSONパースを試行
       parsedJSON = JSON.parse(content);
    } catch (e) {
      console.error('JSON parse error', e);
      console.error('Raw content:', content);
      return NextResponse.json<OCRErrorResponse>({ 
        error: 'LLMからの応答をJSONとして解析できませんでした', 
        details: { rawContent: content, parseError: e instanceof Error ? e.message : 'Unknown error' }
      }, { status: 400 });
    }

    // Zodでバリデーション
    const parsed = BusinessCardSchema.safeParse(parsedJSON);
        if (!parsed.success) {
          console.error('Zod error:', parsed.error);
          return NextResponse.json<OCRErrorResponse>({ error: '構造化データの形式が不正です', details: parsed.error.format() }, { status: 400 });
        }

    return NextResponse.json<OCRResponse>({
      text: extractedText,
      structured: parsed.data,
    });

  } catch (error) {
    console.error('[DocAI+LLM Error]', error);
    return NextResponse.json<OCRErrorResponse>({ error: '処理中にエラーが発生しました' }, { status: 500 });
  }
}
