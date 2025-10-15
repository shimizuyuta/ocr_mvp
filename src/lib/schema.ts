import { z } from "zod";

export const BusinessCardSchema = z.object({
  basicInfo: z.object({
    lastName: z.string().min(1), // 姓
    firstName: z.string().min(1), // 名
    nameKana: z.string().nullable().optional(), // 名前（カナ）
    title: z.string().nullable().optional(), // 役職
    email: z
      .union([z.string().email(), z.literal("")])
      .nullable()
      .optional(), // メールアドレス（空文字許容）
    phone: z.string().nullable().optional(), // 固定電話番号
    mobile: z.string().nullable().optional(), // 携帯電話番号
    businessCategory: z.string().nullable().optional(), // 業界・業種
    address: z.string().nullable().optional(), // 住所
  }),
  contacts: z.object({
    website: z.string().nullable().optional(), // ウェブサイト
    socialMedia: z
      .object({
        linkedin: z.string().nullable().optional(), // LinkedIn
        twitter: z.string().nullable().optional(), // Twitter
        instagram: z.string().nullable().optional(), // Instagram
        facebook: z.string().nullable().optional(), // Facebook
      })
      .optional(),
  }),
  eventInfo: z.object({
    eventDate: z.string().nullable().optional(), // イベント開催日
    eventName: z.string().nullable().optional(), // イベント名
    location: z.string().nullable().optional(), // 開催地
  }),
  businessInfo: z.object({
    // UIは単一のテキスト入力のみのため文字列に簡素化
    challenges: z.string().nullable().optional(), // 経営課題
    itAdoptionStatus: z.string().nullable().optional(), // IT導入状況
    aiInterestLevel: z
      .enum(["高い", "中程度", "低い", "なし"])
      .nullable()
      .optional(), // AI活用への関心度
  }),
  notes: z.string().nullable().optional(), // 備考
});

export type BusinessCardData = z.infer<typeof BusinessCardSchema>; // 完全形

export type BusinessCardLLMOutput = Pick<
  BusinessCardData,
  "basicInfo" | "contacts"
>;

// LLM出力用のスキーマ（既存スキーマから抽出）
export const BusinessCardLLMSchema = BusinessCardSchema.pick({
  basicInfo: true,
  contacts: true,
});

export type BusinessCardDraft = DeepPartial<BusinessCardData>;

// DeepPartial型の定義
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// OCR API レスポンス型
export interface OCRResponse {
  text: string;
  structured: BusinessCardData;
}

export interface OCRErrorResponse {
  error: string;
  details?: unknown;
}
