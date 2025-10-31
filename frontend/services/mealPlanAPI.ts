// Rails API接続サービス
import { Platform } from 'react-native';
import { ENV_CONFIG, getPlatformSpecificApiUrl } from '@/config/environment';

// エラータイプの定義
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',           // ネットワークエラー
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',           // タイムアウト
  SERVER_ERROR = 'SERVER_ERROR',             // サーバーエラー（5xx）
  CLIENT_ERROR = 'CLIENT_ERROR',             // クライアントエラー（4xx）
  PARSE_ERROR = 'PARSE_ERROR',               // レスポンスパースエラー
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'            // 不明なエラー
}

// エラー情報の型定義
export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  retryable: boolean;  // リトライ可能かどうか
  details?: any;
}

// 献立生成のリクエスト型定義
interface MealPlanRequest {
  meal_plan: {
    ingredients: {
      name: string;
      category: string;
    }[];
    preferences?: {
      cuisine_type?: string; // 和食、洋食、中華など
      dietary_restrictions?: string[]; // ベジタリアン、グルテンフリーなど
      meal_type?: string; // 朝食、昼食、夕食
    };
  };
}

// レシピリンクの型定義
export interface RecipeLinks {
  youtube?: string;    // YouTube動画URL
  website?: string;    // 料理サイトURL (クックパッド等)
}

// Rails APIから返される個別の料理データの型定義
export interface ApiDishSuggestion {
  name: string;
  ingredients: string[];
  cooking_time: string;
  calories: string;
  recipe_links?: RecipeLinks;  // レシピリンク（オプショナル）
}

// Rails APIから返される献立データの型定義
export interface ApiMealSuggestions {
  main_dish: ApiDishSuggestion;
  side_dish: ApiDishSuggestion;
  soup: ApiDishSuggestion;
  total_calories: string;
  cooking_tips: string;
}

// 献立レスポンスの型定義（Rails + OpenAI APIのレスポンス）
export interface MealPlanResponse {
  success: boolean;
  data: {
    meal_suggestions: ApiMealSuggestions;
    total_suggestions: number;
    generated_at: string;
  };
  message?: string;
}

// API接続の設定
const API_CONFIG = {
  // プラットフォーム固有のベースURLを取得
  baseUrl: getPlatformSpecificApiUrl(ENV_CONFIG.api.baseUrl),
  timeout: ENV_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// デバッグログ用のヘルパー関数
const logAPI = (level: 'info' | 'error' | 'warn', message: string, data?: any) => {
  if (ENV_CONFIG.logging.enableApiLogging) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] MealPlanAPI ${level.toUpperCase()}: ${message}`;

    if (level === 'error') {
      console.error(logMessage, ENV_CONFIG.logging.enableVerboseLogging ? data : '');
    } else if (level === 'warn') {
      console.warn(logMessage, ENV_CONFIG.logging.enableVerboseLogging ? data : '');
    } else {
      console.log(logMessage, ENV_CONFIG.logging.enableVerboseLogging ? data : '');
    }
  }
};

// エラー分類ヘルパー関数
const classifyError = (error: any, statusCode?: number): ApiError => {
  // タイムアウトエラー
  if (error?.name === 'AbortError') {
    return {
      type: ApiErrorType.TIMEOUT_ERROR,
      message: 'リクエストがタイムアウトしました。もう一度お試しください。',
      retryable: true
    };
  }

  // ネットワークエラー
  if (error?.message?.includes('Network request failed') ||
      error?.message?.includes('Failed to fetch')) {
    return {
      type: ApiErrorType.NETWORK_ERROR,
      message: 'ネットワーク接続を確認してください。',
      retryable: true
    };
  }

  // HTTPステータスコードによる分類
  if (statusCode) {
    // サーバーエラー（5xx）
    if (statusCode >= 500) {
      return {
        type: ApiErrorType.SERVER_ERROR,
        message: 'サーバーで問題が発生しました。しばらく待ってから再度お試しください。',
        statusCode,
        retryable: true
      };
    }

    // クライアントエラー（4xx）
    if (statusCode >= 400) {
      let message = 'リクエストに問題がありました。';
      if (statusCode === 400) {
        message = '入力内容を確認してください。';
      } else if (statusCode === 404) {
        message = 'APIエンドポイントが見つかりません。';
      } else if (statusCode === 429) {
        message = 'リクエストが多すぎます。しばらく待ってから再度お試しください。';
      }

      return {
        type: ApiErrorType.CLIENT_ERROR,
        message,
        statusCode,
        retryable: statusCode === 429  // レート制限の場合のみリトライ可能
      };
    }
  }

  // JSONパースエラー
  if (error instanceof SyntaxError) {
    return {
      type: ApiErrorType.PARSE_ERROR,
      message: 'レスポンスの処理に失敗しました。',
      retryable: false,
      details: error.message
    };
  }

  // 不明なエラー
  return {
    type: ApiErrorType.UNKNOWN_ERROR,
    message: '予期しないエラーが発生しました。',
    retryable: false,
    details: error
  };
};

// Rails API接続クラス
export class MealPlanAPI {

  /**
   * リトライ付きfetch実行
   * @param url リクエストURL
   * @param options fetchオプション
   * @param maxRetries 最大リトライ回数
   * @returns レスポンス
   */
  private static async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries: number = 2
  ): Promise<Response> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        logAPI('info', `API呼び出し試行 ${attempt + 1}/${maxRetries + 1}`, { url });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;

      } catch (error) {
        lastError = error;

        // タイムアウトまたはネットワークエラーの場合のみリトライ
        const errorInfo = classifyError(error);

        if (!errorInfo.retryable || attempt === maxRetries) {
          throw error;
        }

        // リトライ前に待機（指数バックオフ）
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        logAPI('warn', `リトライまで${waitTime}ms待機`, { attempt: attempt + 1 });
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }

  /**
   * 献立生成API呼び出し
   * @param request 献立生成リクエスト
   * @returns 献立生成レスポンス
   */
  static async generateMealPlan(request: {
    ingredients: { name: string; category: string }[];
    preferences?: {
      cuisine_type?: string;
      dietary_restrictions?: string[];
      meal_type?: string;
    };
  }): Promise<MealPlanResponse> {
    try {
      logAPI('info', 'Rails API呼び出し開始', { baseUrl: API_CONFIG.baseUrl, platform: Platform.OS });
      logAPI('info', 'リクエストパラメータ', request);

      // Rails APIの期待する形式に変換
      const requestBody: MealPlanRequest = {
        meal_plan: {
          ingredients: request.ingredients,
          preferences: request.preferences || {}
        }
      };

      logAPI('info', 'Rails API送信データ', requestBody);

      const response = await this.fetchWithRetry(
        `${API_CONFIG.baseUrl}/meal_plans/generate`,
        {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify(requestBody),
        },
        2  // 最大2回リトライ
      );

      logAPI('info', 'Rails APIレスポンス状態', { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        const errorText = await response.text();
        logAPI('error', 'Rails APIエラーレスポンス', { status: response.status, errorText });

        // エラー分類
        const errorInfo = classifyError(new Error(errorText), response.status);

        // エラーレスポンスの内容をパース
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorInfo.message };
        }

        return {
          success: false,
          data: {
            meal_suggestions: {
              main_dish: { name: '', ingredients: [], cooking_time: '', calories: '' },
              side_dish: { name: '', ingredients: [], cooking_time: '', calories: '' },
              soup: { name: '', ingredients: [], cooking_time: '', calories: '' },
              total_calories: '',
              cooking_tips: ''
            },
            total_suggestions: 0,
            generated_at: new Date().toISOString()
          },
          message: errorData.message || errorInfo.message
        };
      }

      const responseData = await response.json();
      logAPI('info', 'Rails API成功レスポンス', responseData);

      return responseData;

    } catch (error) {
      logAPI('error', 'Rails API呼び出し例外', error);

      // エラー分類
      const errorInfo = classifyError(error);

      return {
        success: false,
        data: {
          meal_suggestions: {
            main_dish: { name: '', ingredients: [], cooking_time: '', calories: '' },
            side_dish: { name: '', ingredients: [], cooking_time: '', calories: '' },
            soup: { name: '', ingredients: [], cooking_time: '', calories: '' },
            total_calories: '',
            cooking_tips: ''
          },
          total_suggestions: 0,
          generated_at: new Date().toISOString()
        },
        message: errorInfo.message
      };
    }
  }

  /**
   * API接続テスト
   * @returns 接続状態
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const healthCheckUrl = `${API_CONFIG.baseUrl.replace('/api/v1', '')}/up`;
      logAPI('info', 'Rails API接続テスト開始', { url: healthCheckUrl, platform: Platform.OS });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(healthCheckUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        logAPI('info', 'Rails API接続テスト成功', { status: response.status });
        return { success: true, message: 'Rails APIに正常に接続できました' };
      } else {
        logAPI('error', 'Rails API接続テスト失敗', { status: response.status, statusText: response.statusText });
        return { success: false, message: `Rails API接続エラー: ${response.status}` };
      }
    } catch (error) {
      logAPI('error', 'Rails API接続テストエラー', error);
      return { success: false, message: 'Rails APIに接続できませんでした' };
    }
  }
}