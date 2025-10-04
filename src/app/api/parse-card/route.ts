// app/api/parse-card/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const prompt = `
以下の名刺テキストを解析してJSONを返してください。
フォーマット:
{
  "name": "",
  "name_kana": "",
  "title": "",
  "company": "",
  "email": "",
  "phone": "",
  "address": "",
  "website": ""
}

テキスト:
${text}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  });

  const jsonText = response.choices[0].message?.content ?? '{}';
  const data = JSON.parse(jsonText);

  return NextResponse.json(data);
}
