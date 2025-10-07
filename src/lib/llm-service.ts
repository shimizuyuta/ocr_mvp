import OpenAI from "openai";
import { BusinessCardSchema, type BusinessCardData } from "@/lib/schema";

export class LLMService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private createPrompt(text: string): string {
    return `
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
${text}
    `;
  }

  async parseBusinessCard(text: string): Promise<BusinessCardData> {
    const prompt = this.createPrompt(text);

    const response = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const content = response.choices[0].message?.content ?? "{}";

    try {
      const parsedJSON = JSON.parse(content);
      const validated = BusinessCardSchema.safeParse(parsedJSON);

      if (!validated.success) {
        throw new Error(
          `Validation failed: ${JSON.stringify(validated.error.format())}`,
        );
      }

      return validated.data;
    } catch (error) {
      console.error("LLM parsing error:", error);
      console.error("Raw content:", content);
      throw new Error(
        `Failed to parse business card: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
