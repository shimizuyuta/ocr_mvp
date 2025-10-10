# 名刺OCR解析アプリ

Google Cloud Document AI と OpenAI GPT-4 を使用した名刺情報自動抽出アプリケーションです。  
Google Sheets への自動保存機能と編集機能も搭載しています。

## イメージ
<img width="1382" height="944" alt="image" src="https://github.com/user-attachments/assets/455e8a3e-3f66-438f-b082-6cb55fad6714" />

## 機能

- 📄 **名刺画像のOCR**: Google Cloud Document AI で高精度なテキスト抽出
- 🤖 **AI構造化**: OpenAI GPT-4 で名刺情報を構造化データに変換
- ✏️ **リアルタイム編集**: 抽出結果を直接編集可能
- 📊 **Google Sheets連携**: 編集した名刺情報を自動でスプレッドシートに保存
- 🎨 **美しいUI**: モダンで使いやすいインターフェース
- 📱 **レスポンシブ**: モバイル・デスクトップ対応
- 🔗 **クリック可能**: メール、電話、ウェブサイトへの直接アクセス
- 🔐 **Basic認証**: セキュアなアクセス制御
- 🔧 **モック機能**: 開発時のテストデータ対応

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **OCR**: Google Cloud Document AI
- **AI**: OpenAI GPT-4
- **データベース**: Google Sheets API
- **認証**: Basic認証 (middleware)
- **型安全性**: Zod バリデーション
- **開発ツール**: Biome (lint/format), Husky (pre-commit)

## クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# Google Cloud Document AI
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
DOC_AI_LOCATION=us
DOC_AI_PROCESSOR_ID=your-processor-id

# Google Sheets
GOOGLE_SHEETS_ID=your-spreadsheet-id

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini

# Basic認証
BASIC_AUTH_USER=your-username
BASIC_AUTH_PASS=your-password

# モックモード（開発用）
# ローカル開発環境では自動的にモックが有効になります
# 本番環境でモックを使用したい場合: OCR_MOCK_MODE=true
# ローカルでモックを無効にしたい場合: OCR_MOCK_MODE=false
OCR_MOCK_MODE=true
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## 使用方法

1. **名刺の画像をアップロード**
2. **「名刺を解析」ボタンをクリック**
3. **抽出された情報を直接編集**（必要に応じて）
4. **「スプシに保存」ボタンで Google Sheets に保存**
5. **メールや電話番号をクリックして直接連絡**

## 開発

### モックモード

開発時に実際のOCR APIを呼ばずにテストデータを使用できます：

#### **自動モック（推奨）**
ローカル開発環境（`npm run dev`）では自動的にモックが有効になります。

#### **手動制御**
```bash
# 本番環境でモックを使用
OCR_MOCK_MODE=true

# ローカルでモックを無効にして実際のAPIを使用
OCR_MOCK_MODE=false
```

#### **モックデータ**
ランダムに選択されたテストデータが返されます：
- 田中太郎（営業部長）
- 佐藤花子（CTO）
- 山田次郎（フリーランスデザイナー）

### コード品質管理

- **Biome**: lint と format の自動化
- **Husky**: pre-commit フックでコード品質を保証
- **GitHub Actions**: CI/CD パイプライン

### 利用可能なスクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run start    # 本番サーバー起動
npm run lint     # lint チェック
npm run format   # コード整形
```

## プロジェクト構成

```
src/
├── app/
│   ├── api/
│   │   ├── ocr/route.ts           # OCR API エンドポイント
│   │   └── save-to-sheets/route.ts # Google Sheets 保存 API
│   ├── page.tsx                   # メインページ
│   └── layout.tsx                 # レイアウト
├── components/
│   ├── FileUpload.tsx             # ファイルアップロード
│   ├── OCRResult.tsx              # 結果表示・編集
│   └── ErrorDisplay.tsx           # エラー表示
├── lib/
│   ├── schema.ts                  # Zod スキーマ定義
│   ├── document-ai-service.ts     # Document AI サービス
│   ├── llm-service.ts             # LLM サービス
│   ├── file-utils.ts              # ファイルユーティリティ
│   └── mock-data.ts               # モックデータ
└── middleware.ts                   # Basic認証 middleware
```

## Google Cloud の設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. Document AI API を有効化
3. Document AI プロセッサを作成
4. Google Sheets API を有効化
5. サービスアカウントキーを作成して JSON を環境変数に設定
6. スプレッドシートを作成し、ID を環境変数に設定

## 対応画像形式

- PNG
- JPEG/JPG
- PDF

## ライセンス

MIT License