import type { auth } from "googleapis";
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
  credentials: auth.JWTInput,
  spreadsheetId: string,
  businessCard: BusinessCardData,
): Promise<void> {
  const { google } = await import("googleapis");

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const values = [
    [
      businessCard.name || "",
      businessCard.name_kana || "",
      businessCard.company || "",
      businessCard.department || "",
      businessCard.title || "",
      businessCard.email || "",
      businessCard.phone || "",
      businessCard.mobile || "",
      businessCard.fax || "",
      businessCard.zip || "",
      businessCard.address || "",
      businessCard.website || "",
      businessCard.linkedin || "",
      businessCard.twitter || "",
      businessCard.instagram || "",
      businessCard.qr_code_url || "",
      businessCard.notes || "",
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "A:Q",
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });
}
