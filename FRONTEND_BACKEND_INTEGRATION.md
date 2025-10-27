# Meal Planner - フロントエンドと Rails API の疎通設定

このドキュメントでは、React Native (Expo) フロントエンドと Rails + OpenAI API バックエンドの疎通設定と動作確認方法について説明します。

## 🏗️ アーキテクチャ概要

```
┌─────────────────┐    HTTP API    ┌──────────────────┐    OpenAI API    ┌─────────────┐
│  React Native   │   (JSON/REST)  │   Rails Backend  │                  │   OpenAI    │
│  (Expo) App     │ ◄──────────── │   + MySQL DB     │ ◄────────────► │    GPT      │
│                 │                │                  │                  │             │
└─────────────────┘                └──────────────────┘                  └─────────────┘
```

## 🚀 起動手順

### 1. バックエンド（Rails + MySQL）の起動

```bash
cd /Users/nakanomasaki/My_projects/meal-planner

# Docker Composeでバックエンドを起動
docker compose up --build

# 起動確認
curl http://localhost:3001/up
```

Rails API は以下のポートでアクセス可能になります：

- **API エンドポイント**: `http://localhost:3001/api/v1`
- **ヘルスチェック**: `http://localhost:3001/up`

### 2. フロントエンド（React Native/Expo）の起動

```bash
cd /Users/nakanomasaki/My_projects/meal-planner/frontend

# 依存関係をインストール
npm install

# Expoアプリを起動
npx expo start

# または特定のプラットフォームで起動
npx expo start --ios     # iOS Simulator
npx expo start --android # Android Emulator
npx expo start --web     # Webブラウザ
```

## 🔗 API 疎通テスト

### 1. アプリ内からの接続テスト

1. React Native アプリを起動
2. 「献立作成」セクションの「Rails API 接続テスト」ボタンをタップ
3. 接続状態が表示されることを確認

### 2. 献立生成のテスト

1. アプリで食材を選択（例：鶏肉、にんじん、玉ねぎ）
2. 「選択した食材で献立を作成」ボタンをタップ
3. Rails + OpenAI API から献立が生成されることを確認

### 3. 手動で API テスト（curl）

```bash
# ヘルスチェック
curl -X GET http://localhost:3001/up

# 献立生成API
curl -X POST http://localhost:3001/api/v1/meal_plans/generate \
  -H "Content-Type: application/json" \
  -d '{
    "meal_plan": {
      "ingredients": [
        {"name": "鶏肉", "category": "肉類"},
        {"name": "にんじん", "category": "野菜"}
      ],
      "preferences": {
        "meal_type": "夕食",
        "cuisine_type": "和食"
      }
    }
  }'
```

## 📱 プラットフォーム別 API 接続設定

### iOS Simulator

```
API URL: http://localhost:3001/api/v1
```

### Android Emulator

```
API URL: http://10.0.2.2:3001/api/v1
```

※ Android Emulator では localhost ではなくホストマシンの IP アドレスを使用

### Web（ブラウザ）

```
API URL: http://localhost:3001/api/v1
```

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### 1. 「Rails API に接続できませんでした」エラー

**確認項目:**

- Rails サーバーが起動しているか確認: `docker compose ps`
- ヘルスチェックエンドポイントが応答するか: `curl http://localhost:3001/up`
- ファイアウォールがポート 3001 をブロックしていないか

**解決方法:**

```bash
# Dockerコンテナを再起動
docker compose down
docker compose up --build
```

#### 2. 「リクエストがタイムアウトしました」エラー

- ネットワーク接続を確認
- Rails サーバーのログを確認: `docker compose logs backend`

#### 3. Android Emulator で接続できない

- API URL が `10.0.2.2:3001` になっているか確認
- エミュレータのネットワーク設定を確認

#### 4. CORS エラー

Rails の CORS 設定を確認:

```ruby
# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins Rails.env.development? ? "*" : ["your-frontend-domain.com"]
    resource "/api/*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## 📋 API 仕様

### 献立生成 API

**エンドポイント:** `POST /api/v1/meal_plans/generate`

**リクエスト:**

```json
{
  "meal_plan": {
    "ingredients": [
      { "name": "鶏肉", "category": "肉類" },
      { "name": "にんじん", "category": "野菜" }
    ],
    "preferences": {
      "meal_type": "夕食",
      "cuisine_type": "和食",
      "dietary_restrictions": []
    }
  }
}
```

**レスポンス（成功）:**

```json
{
  "success": true,
  "data": {
    "meal_suggestions": [
      {
        "id": 1,
        "name": "鶏肉とにんじんの煮物",
        "description": "優しい味わいの和風煮物",
        "category": "主菜",
        "ingredients": ["鶏肉", "にんじん", "しょうゆ", "みりん"],
        "cooking_time": 30,
        "difficulty": "簡単",
        "instructions": ["材料を切る", "煮込む", "完成"]
      }
    ],
    "total_suggestions": 1,
    "generated_at": "2024-12-19T12:00:00Z"
  },
  "message": "献立を正常に生成しました"
}
```

## 🔧 開発者向け設定

### デバッグログの有効化

`frontend/config/environment.ts` で設定:

```typescript
export const ENV_CONFIG = {
  logging: {
    enableApiLogging: true, // APIログを表示
    enableVerboseLogging: true, // 詳細ログを表示
  },
};
```

### モック API の使用

テスト時にモック API を使用したい場合:

```typescript
export const ENV_CONFIG = {
  features: {
    useMockAPI: true, // モックAPIを使用
  },
};
```

## 📞 サポート

問題が解決しない場合は、以下の情報とともにお知らせください：

1. エラーメッセージ
2. 使用プラットフォーム（iOS/Android/Web）
3. ブラウザの開発者ツールまたはアプリのログ
4. Rails サーバーのログ（`docker compose logs backend`）
