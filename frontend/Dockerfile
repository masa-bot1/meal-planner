# ベースイメージとして最新のLTS Node.jsを使用
FROM node:lts

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# Expo CLIをグローバルインストール
RUN npm install -g expo-cli

# アプリケーションコードをコピー
COPY . .

# Expo開発サーバーを起動
CMD ["npx", "expo", "start", "--tunnel"]