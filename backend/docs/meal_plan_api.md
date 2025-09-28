# 献立生成 API 仕様書

## 概要

選択された食材から献立を自動生成する Rails API です。将来的に OpenAI API と連携する予定ですが、現在はルールベースの献立生成を行います。

## エンドポイント

### POST /api/v1/meal_plans/generate

選択された食材から献立を生成します。

#### リクエスト

**URL:** `http://localhost:3000/api/v1/meal_plans/generate`

**メソッド:** `POST`

**Content-Type:** `application/json`

**リクエストボディ:**

```json
{
  "meal_plan": {
    "ingredients": [
      {
        "name": "牛肉",
        "category": "肉類"
      },
      {
        "name": "玉ねぎ",
        "category": "野菜類"
      },
      {
        "name": "にんじん",
        "category": "野菜類"
      }
    ],
    "preferences": {
      "cuisine_type": "和食",
      "meal_type": "夕食",
      "dietary_restrictions": []
    }
  }
}
```

**パラメータ詳細:**

| パラメータ                         | 型     | 必須 | 説明                                         |
| ---------------------------------- | ------ | ---- | -------------------------------------------- |
| `ingredients`                      | Array  | ✅   | 選択された食材の配列                         |
| `ingredients[].name`               | String | ✅   | 食材名                                       |
| `ingredients[].category`           | String | ✅   | 食材カテゴリ                                 |
| `preferences`                      | Object | ❌   | 献立の好み設定                               |
| `preferences.cuisine_type`         | String | ❌   | 料理の種類（和食、洋食、中華など）           |
| `preferences.meal_type`            | String | ❌   | 食事の種類（朝食、昼食、夕食）               |
| `preferences.dietary_restrictions` | Array  | ❌   | 食事制限（ベジタリアン、グルテンフリーなど） |

#### レスポンス

**成功時 (200 OK):**

```json
{
  "success": true,
  "data": {
    "meal_suggestions": [
      {
        "id": 1,
        "name": "牛肉と野菜の炒め物",
        "description": "ジューシーな牛肉と新鮮な野菜を炒めた栄養バランス抜群の一品",
        "category": "主菜",
        "ingredients": ["牛肉", "玉ねぎ", "にんじん", "醤油"],
        "cooking_time": 20,
        "difficulty": "普通",
        "instructions": [
          "牛肉を一口大に切る",
          "野菜を食べやすい大きさに切る",
          "フライパンを熱し、牛肉を炒める",
          "野菜を加えて炒め合わせる",
          "調味料で味を整える"
        ]
      },
      {
        "id": 2,
        "name": "玉ねぎとにんじんのサラダ",
        "description": "フレッシュな野菜をたっぷり使った彩り豊かなサラダ",
        "category": "副菜",
        "ingredients": ["玉ねぎ", "にんじん", "ドレッシング"],
        "cooking_time": 10,
        "difficulty": "簡単",
        "instructions": [
          "野菜をよく洗う",
          "食べやすい大きさに切る",
          "器に盛り付ける",
          "お好みのドレッシングをかける"
        ]
      }
    ],
    "total_suggestions": 2,
    "generated_at": "2025-09-25T10:30:00+09:00"
  },
  "message": "献立を正常に生成しました"
}
```

**エラー時 (400 Bad Request):**

```json
{
  "success": false,
  "data": {
    "meal_suggestions": [],
    "total_suggestions": 0,
    "generated_at": "2025-09-25T10:30:00+09:00"
  },
  "message": "必須パラメータが不足しています: ingredients"
}
```

**エラー時 (422 Unprocessable Entity):**

```json
{
  "success": false,
  "data": {
    "meal_suggestions": [],
    "total_suggestions": 0,
    "generated_at": "2025-09-25T10:30:00+09:00"
  },
  "message": "献立の生成に失敗しました"
}
```

**エラー時 (500 Internal Server Error):**

```json
{
  "success": false,
  "data": {
    "meal_suggestions": [],
    "total_suggestions": 0,
    "generated_at": "2025-09-25T10:30:00+09:00"
  },
  "message": "サーバーエラーが発生しました"
}
```

## フロントエンドとの連携

### モック API からの移行

現在フロントエンドで使用している `MockMealPlanAPI` のエンドポイントを以下のように変更してください：

```typescript
// Before (モック)
const response = await MockMealPlanAPI.generateMealPlan({
  ingredients: selectedItems,
  preferences: { ... }
});

// After (Rails API)
const response = await fetch('http://localhost:3000/api/v1/meal_plans/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    meal_plan: {
      ingredients: selectedItems,
      preferences: { ... }
    }
  })
});
```

### CORS 設定

開発環境では全てのオリジンからのアクセスを許可しています。本番環境では適切なドメインを設定してください。

## 開発・テスト用コマンド

### マイグレーション実行

```bash
cd backend
rails db:migrate
```

### サーバー起動

```bash
cd backend
rails server
```

### API テスト（curl）

```bash
curl -X POST http://localhost:3000/api/v1/meal_plans/generate \
  -H "Content-Type: application/json" \
  -d '{
    "meal_plan": {
      "ingredients": [
        {"name": "牛肉", "category": "肉類"},
        {"name": "玉ねぎ", "category": "野菜類"}
      ],
      "preferences": {
        "cuisine_type": "和食",
        "meal_type": "夕食"
      }
    }
  }'
```

## 今後の拡張予定

1. **OpenAI API 連携**

   - MealPlanService で OpenAI API を呼び出し
   - より自然で多様な献立生成

2. **ユーザー認証**

   - 献立履歴の保存
   - 個人の好み学習

3. **キャッシュ機能**

   - 同じ食材組み合わせの結果キャッシュ
   - レスポンス速度向上

4. **栄養情報連携**
   - カロリー計算
   - 栄養バランス分析

## 注意事項

- 現在はモック実装のため、実際の栄養計算やレシピデータベースとは連携していません
- OpenAI API 連携は別途実装が必要です
- 本番環境では CORS 設定を適切なドメインに限定してください
