# 名刺OCR解析アプリ

Google Cloud Document AI と OpenAI GPT-4 を使用した名刺情報自動抽出アプリケーションです。


## イメージ
<img width="1382" height="944" alt="image" src="https://github.com/user-attachments/assets/455e8a3e-3f66-438f-b082-6cb55fad6714" />


## 機能

- 📄 **名刺画像のOCR**: Google Cloud Document AI で高精度なテキスト抽出
- 🤖 **AI構造化**: OpenAI GPT-4 で名刺情報を構造化データに変換
- 🎨 **美しいUI**: モダンで使いやすいインターフェース
- 📱 **レスポンシブ**: モバイル・デスクトップ対応
- 🔗 **クリック可能**: メール、電話、ウェブサイトへの直接アクセス

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **OCR**: Google Cloud Document AI
- **AI**: OpenAI GPT-4
- **型安全性**: Zod バリデーション

## セットアップ

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

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
```

### 3. Google Cloud の設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. Document AI API を有効化
3. Document AI プロセッサを作成
4. サービスアカウントキーを作成して JSON を環境変数に設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## プロジェクト構成

```
src/
├── app/
│   ├── api/ocr/route.ts    # OCR API エンドポイント
│   ├── page.tsx            # メインページ
│   └── layout.tsx          # レイアウト
├── components/
│   ├── FileUpload.tsx      # ファイルアップロード
│   ├── OCRResult.tsx       # 結果表示
│   └── ErrorDisplay.tsx    # エラー表示
└── lib/
    └── schema.ts           # Zod スキーマ定義
```

## 使用方法

1. 名刺の画像をアップロード
2. 「名刺を解析」ボタンをクリック
3. 抽出された情報を確認
4. メールや電話番号をクリックして直接連絡

## 対応画像形式

- PNG
- JPEG/JPG
- PDF

## ライセンス

MIT License
