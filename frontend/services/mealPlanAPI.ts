// Rails API接続サービス
import { Platform } from 'react-native';
import { ENV_CONFIG, getPlatformSpecificApiUrl } from '@/config/environment';

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

// Rails API接続クラス
export class MealPlanAPI {

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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      const response = await fetch(`${API_CONFIG.baseUrl}/meal_plans/generate`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      logAPI('info', 'Rails APIレスポンス状態', { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        const errorText = await response.text();
        logAPI('error', 'Rails APIエラーレスポンス', { status: response.status, errorText });

        // エラーレスポンスの内容をパース
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'API呼び出しに失敗しました' };
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
          message: errorData.message || `APIエラー: ${response.status}`
        };
      }

      const responseData = await response.json();
      logAPI('info', 'Rails API成功レスポンス', responseData);

      return responseData;

    } catch (error) {
      logAPI('error', 'Rails API呼び出し例外', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
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
            message: 'リクエストがタイムアウトしました'
          };
        }
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
        message: 'ネットワークエラーが発生しました'
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