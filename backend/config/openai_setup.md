# OpenAI API 設定例

# 以下の環境変数を設定してください

# 開発環境用

OPENAI_API_KEY=sk-your-openai-api-key-here

# 本番環境用（Docker コンテナで使用）

# docker-compose.yml の environment セクションに追加:

# environment:

# - OPENAI_API_KEY=sk-your-openai-api-key-here

# または Rails credentials を使用する場合:

# rails credentials:edit で以下を追加:

# openai:

# api_key: sk-your-openai-api-key-here

# 使用方法：

# 1. OpenAI のウェブサイトで API キーを取得

# 2. .env ファイルまたは環境変数に設定

# 3. Rails サーバーを再起動
