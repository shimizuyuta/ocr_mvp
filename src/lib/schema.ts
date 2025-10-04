import { z } from 'zod';

export const BusinessCardSchema = z.object({
  name: z.string().min(1),
  name_kana: z.string().nullable().optional(),
  company: z.string().min(1),
  department: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),          // 会社電話
  mobile: z.string().nullable().optional(),         // 携帯
  fax: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  website: z.string().nullable().optional().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Invalid URL format"
  }),
  linkedin: z.string().nullable().optional().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Invalid URL format"
  }),
  twitter: z.string().nullable().optional().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Invalid URL format"
  }),
  instagram: z.string().nullable().optional().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Invalid URL format"
  }),
  qr_code_url: z.string().nullable().optional().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: "Invalid URL format"
  }), // 名刺のQRコードなど
  notes: z.string().nullable().optional()              // その他メモ欄
});

export type BusinessCardData = z.infer<typeof BusinessCardSchema>;

// OCR API レスポンス型
export interface OCRResponse {
  text: string;
  structured: BusinessCardData;
}

export interface OCRErrorResponse {
  error: string;
  details?: any;
}
