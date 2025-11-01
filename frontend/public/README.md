# 法的文書の配置について

このディレクトリには、アプリで使用される法的文書（利用規約とプライバシーポリシー）の HTML ファイルが含まれています。

## ファイル

- `terms.html` - 利用規約
- `privacy.html` - プライバシーポリシー

## 配置方法

これらの HTML ファイルを Web からアクセス可能にするには、以下のいずれかの方法を選択してください：

### オプション 1: GitHub Pages（開発・テスト用）

1. GitHub リポジトリの設定で GitHub Pages を有効化
2. `frontend/app/(tabs)/settings.tsx`の`getDocumentBaseUrl()`を更新：
   ```typescript
   return __DEV__
     ? "https://your-username.github.io/your-repo/public"
     : "https://your-domain.com";
   ```

### オプション 2: 独自ドメイン（本番環境推奨）

1. これらの HTML ファイルを Web サーバーにアップロード
2. `settings.tsx`の`getDocumentBaseUrl()`を更新：
   ```typescript
   return "https://your-domain.com";
   ```

### オプション 3: Netlify/Vercel（推奨）

1. Netlify または Vercel でこのディレクトリをホスティング
2. 自動デプロイを設定
3. 生成された URL を`settings.tsx`に設定

## 本番環境での設定

本番環境にデプロイする前に、以下を必ず更新してください：

1. **`settings.tsx`の URL**

   - `getDocumentBaseUrl()`関数内の本番 URL を実際のドメインに変更

2. **HTML ファイル内の情報**

   - 会社名・サービス名
   - お問い合わせ先メールアドレス
   - 管轄裁判所の所在地
   - その他の企業情報

3. **お問い合わせメールアドレス**
   - `settings.tsx`の`openContactEmail()`関数内のメールアドレスを変更

## 注意事項

- これらの文書は法的文書であるため、弁護士等の専門家によるレビューを受けることを推奨します
- ユーザーデータの取り扱いについて、実際の実装に合わせて内容を更新してください
- 法令の変更や事業内容の変更に応じて、定期的に見直しを行ってください
