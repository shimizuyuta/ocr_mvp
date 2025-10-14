import type { Auth } from "googleapis";
import { type NextRequest, NextResponse } from "next/server";
import type { BusinessCardData } from "@/lib/schema";

export const runtime = "nodejs";

interface SaveToSheetsRequest {
  businessCard: BusinessCardData;
  spreadsheetId?: string;
}

interface SaveToSheetsResponse {
  success: boolean;
  spreadsheetUrl?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { businessCard, spreadsheetId }: SaveToSheetsRequest =
      await req.json();

    if (!businessCard) {
      return NextResponse.json<SaveToSheetsResponse>(
        { success: false, message: "名刺データが提供されていません" },
        { status: 400 },
      );
    }

    // Google Sheets API の認証情報を取得
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string,
    );

    // 既存のスプレッドシートIDを使用
    const targetSpreadsheetId = spreadsheetId || process.env.GOOGLE_SHEETS_ID;

    if (!targetSpreadsheetId) {
      return NextResponse.json<SaveToSheetsResponse>(
        { success: false, message: "スプレッドシートIDが設定されていません" },
        { status: 400 },
      );
    }

    // データをスプレッドシートに追加
    await appendToSpreadsheet(credentials, targetSpreadsheetId, businessCard);

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}`;

    return NextResponse.json<SaveToSheetsResponse>({
      success: true,
      spreadsheetUrl,
      message: "名刺情報をスプレッドシートに保存しました",
    });
  } catch (error) {
    console.error("[Save to Sheets Error]", error);

    return NextResponse.json<SaveToSheetsResponse>(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "スプレッドシートへの保存中にエラーが発生しました",
      },
      { status: 500 },
    );
  }
}

async function appendToSpreadsheet(
  credentials: Auth.JWTInput,
  spreadsheetId: string,
  businessCard: BusinessCardData,
): Promise<void> {
  const { google } = await import("googleapis");

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // データを安全にエスケープする関数
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    // 改行文字をスペースに置換し、その他の制御文字を除去
    return str.replace(/[\r\n\t]/g, " ").replace(/[\x00-\x1F\x7F]/g, "");
  };

  const values = [
    [
      // 基本情報
      safeString(
        `${businessCard.basicInfo.lastName} ${businessCard.basicInfo.firstName}`,
      ),
      safeString(businessCard.basicInfo.nameKana),
      safeString(businessCard.basicInfo.title),
      safeString(businessCard.basicInfo.email),
      safeString(businessCard.basicInfo.phone),
      safeString(businessCard.basicInfo.mobile),
      safeString(businessCard.basicInfo.businessCategory),
      safeString(businessCard.basicInfo.address),
      // 連絡先
      safeString(businessCard.contacts.website),
      safeString(businessCard.contacts.socialMedia?.linkedin),
      safeString(businessCard.contacts.socialMedia?.twitter),
      safeString(businessCard.contacts.socialMedia?.instagram),
      safeString(businessCard.contacts.socialMedia?.facebook),
      // イベント情報
      safeString(businessCard.eventInfo.eventDate),
      safeString(businessCard.eventInfo.eventName),
      safeString(businessCard.eventInfo.location),
      // ビジネス情報
      safeString(businessCard.businessInfo.challenges),
      safeString(businessCard.businessInfo.itAdoptionStatus),
      safeString(businessCard.businessInfo.aiInterestLevel),
      // 備考
      safeString(businessCard.notes),
    ],
  ];

  try {
    // まず既存のデータを取得して、次の行番号を決定
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A:A", // A列のデータを取得
    });

    // 次の行番号を計算（既存データの行数 + 1）
    const nextRow = (existingData.data.values?.length || 0) + 1;
    const range = `A${nextRow}:AE${nextRow}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    console.error("Data being sent:", JSON.stringify(values, null, 2));
    throw new Error(
      `Google Sheets API error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
