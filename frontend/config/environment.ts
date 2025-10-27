import { Platform } from 'react-native';

// 環境設定
export const ENV_CONFIG = {
  // 開発環境かどうか
  isDevelopment: __DEV__,

  // API設定
  api: {
    // Rails API ベースURL
    baseUrl: __DEV__
      ? 'http://localhost:3001/api/v1'  // 開発環境: ローカルのRailsサーバー
      : 'https://your-production-api.com/api/v1', // 本番環境

    // タイムアウト設定（ミリ秒）
    timeout: 30000,

    // リトライ設定
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // ログ設定
  logging: {
    // APIログを有効にするか
    enableApiLogging: __DEV__,

    // 詳細ログを有効にするか
    enableVerboseLogging: __DEV__,
  },

  // 機能フラグ
  features: {
    // モックAPIを使用するか（デバッグ用）
    useMockAPI: false,

    // オフライン機能を有効にするか
    enableOfflineMode: false,
  },
};

// プラットフォーム固有のURL調整
export const getPlatformSpecificApiUrl = (baseUrl: string): string => {
  if (!__DEV__) {
    return baseUrl; // 本番環境ではそのまま使用
  }

  // 開発環境でのプラットフォーム別URL調整
  switch (Platform.OS) {
    case 'android':
      // Android EmulatorではlocalhostではなくホストマシンのIPを使用
      return baseUrl.replace('localhost', '10.0.2.2');
    case 'ios':
      // iOS Simulatorではlocalhostがそのまま使える
      return baseUrl;
    case 'web':
      // Webではlocalhostがそのまま使える
      return baseUrl;
    default:
      return baseUrl;
  }
};