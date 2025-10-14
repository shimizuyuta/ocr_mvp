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
      basicInfo: {
        lastName: "田中",
        firstName: "太郎",
        nameKana: "タナカ タロウ",
        title: "部長",
        email: "tanaka@sample.co.jp",
        phone: "03-1234-5678",
        mobile: "090-1234-5678",
        businessCategory: "営業部",
        address: "〒100-0001 東京都千代田区千代田1-1-1",
      },
      contacts: {
        website: "https://www.sample.co.jp",
        socialMedia: {
          linkedin: null,
          twitter: null,
          instagram: null,
          facebook: null,
        },
      },
      eventInfo: {
        eventDate: "2025-10-11",
        eventName: "異業種交流会 東京",
        location: "東京",
      },
      businessInfo: {
        challenges: "営業効率化の検討中",
        itAdoptionStatus: "既存システム導入",
        aiInterestLevel: "中程度",
      },
      notes: "とても話しやすい",
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
      basicInfo: {
        lastName: "佐藤",
        firstName: "花子",
        nameKana: "サトウ ハナコ",
        title: "CTO",
        email: "sato@tech.co.jp",
        phone: "03-9876-5432",
        mobile: "080-9876-5432",
        businessCategory: null,
        address: "〒150-0002 東京都渋谷区渋谷2-2-2",
      },
      contacts: {
        website: "https://www.tech.co.jp",
        socialMedia: {
          linkedin: "https://linkedin.com/in/sato-hanako",
          twitter: "@sato_hanako",
          instagram: null,
          facebook: null,
        },
      },
      eventInfo: {
        eventDate: "2025-10-11",
        eventName: "異業種交流会 東京",
        location: "東京",
      },
      businessInfo: {
        challenges: "AI導入による業務効率化を検討中",
        itAdoptionStatus: "クラウド利用",
        aiInterestLevel: "高い",
      },
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
      basicInfo: {
        lastName: "山田",
        firstName: "次郎",
        nameKana: "ヤマダ ジロウ",
        title: "フリーランスデザイナー",
        email: "yamada@design.jp",
        phone: "06-1111-2222",
        mobile: "070-1111-2222",
        businessCategory: null,
        address: "〒530-0001 大阪府大阪市北区梅田3-3-3",
      },
      contacts: {
        website: "https://www.yamada-design.jp",
        socialMedia: {
          linkedin: null,
          twitter: null,
          instagram: "@yamada_design",
          facebook: null,
        },
      },
      eventInfo: {
        eventDate: "2025-10-11",
        eventName: "異業種交流会 大阪",
        location: "大阪",
      },
      businessInfo: {
        challenges: "クライアント管理システムの導入を検討",
        itAdoptionStatus: "Excel・アナログ",
        aiInterestLevel: "中程度",
      },
      notes: "とても話しやすく、ビジネスに繋がりそう",
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
