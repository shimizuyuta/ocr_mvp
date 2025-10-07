import type { OCRResponse } from "@/lib/schema";

// モック用のテストデータ
export const mockOCRData: OCRResponse[] = [
  {
    text: `田中 太郎
株式会社サンプル
営業部 部長
〒100-0001
東京都千代田区千代田1-1-1
TEL: 03-1234-5678
FAX: 03-1234-5679
Email: tanaka@sample.co.jp
Mobile: 090-1234-5678
Website: https://www.sample.co.jp`,
    structured: {
      name: "田中 太郎",
      name_kana: "タナカ タロウ",
      company: "株式会社サンプル",
      department: "営業部",
      title: "部長",
      email: "tanaka@sample.co.jp",
      phone: "03-1234-5678",
      mobile: "090-1234-5678",
      fax: "03-1234-5679",
      address: "〒100-0001 東京都千代田区千代田1-1-1",
      website: "https://www.sample.co.jp",
      linkedin: null,
      twitter: null,
      instagram: null,
      qr_code_url: null,
      notes: null,
    },
  },
  {
    text: `佐藤 花子
テクノロジー株式会社
CTO
〒150-0002
東京都渋谷区渋谷2-2-2
TEL: 03-9876-5432
Email: sato@tech.co.jp
Mobile: 080-9876-5432
LinkedIn: https://linkedin.com/in/sato-hanako
Twitter: @sato_hanako
Website: https://www.tech.co.jp`,
    structured: {
      name: "佐藤 花子",
      name_kana: "サトウ ハナコ",
      company: "テクノロジー株式会社",
      department: null,
      title: "CTO",
      email: "sato@tech.co.jp",
      phone: "03-9876-5432",
      mobile: "080-9876-5432",
      fax: null,
      address: "〒150-0002 東京都渋谷区渋谷2-2-2",
      website: "https://www.tech.co.jp",
      linkedin: "https://linkedin.com/in/sato-hanako",
      twitter: "@sato_hanako",
      instagram: null,
      qr_code_url: null,
      notes: null,
    },
  },
  {
    text: `山田 次郎
デザインスタジオ
フリーランスデザイナー
〒530-0001
大阪府大阪市北区梅田3-3-3
TEL: 06-1111-2222
Email: yamada@design.jp
Mobile: 070-1111-2222
Instagram: @yamada_design
Website: https://www.yamada-design.jp
Portfolio: https://portfolio.yamada-design.jp`,
    structured: {
      name: "山田 次郎",
      name_kana: "ヤマダ ジロウ",
      company: "デザインスタジオ",
      department: null,
      title: "フリーランスデザイナー",
      email: "yamada@design.jp",
      phone: "06-1111-2222",
      mobile: "070-1111-2222",
      fax: null,
      address: "〒530-0001 大阪府大阪市北区梅田3-3-3",
      website: "https://www.yamada-design.jp",
      linkedin: null,
      twitter: null,
      instagram: "@yamada_design",
      qr_code_url: null,
      notes: "Portfolio: https://portfolio.yamada-design.jp",
    },
  },
];

// ランダムにモックデータを返す関数
export function getRandomMockData(): OCRResponse {
  const randomIndex = Math.floor(Math.random() * mockOCRData.length);
  return mockOCRData[randomIndex];
}

// 特定のインデックスのモックデータを返す関数
export function getMockDataByIndex(index: number): OCRResponse {
  const safeIndex = Math.max(0, Math.min(index, mockOCRData.length - 1));
  return mockOCRData[safeIndex];
}
