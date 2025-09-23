// モックAPIサーバー（将来的にRails + OpenAI APIに置き換え予定）
// Express.jsを使用してRails風のAPIエンドポイントを模擬

// 献立生成のリクエスト型定義
interface MealPlanRequest {
  ingredients: {
    name: string;
    category: string;
  }[];
  preferences?: {
    cuisine_type?: string; // 和食、洋食、中華など
    dietary_restrictions?: string[]; // ベジタリアン、グルテンフリーなど
    meal_type?: string; // 朝食、昼食、夕食
  };
}

// 献立レスポンスの型定義（Rails + OpenAI APIの想定レスポンス）
interface MealPlanResponse {
  success: boolean;
  data: {
    meal_suggestions: {
      id: number;
      name: string;
      description: string;
      category: string; // 主菜、副菜、汁物など
      ingredients: string[];
      cooking_time?: number; // 調理時間（分）
      difficulty?: string; // 簡単、普通、難しい
      instructions?: string[]; // 調理手順
    }[];
    total_suggestions: number;
    generated_at: string;
  };
  message?: string;
}

// モックAPIの実装
export class MockMealPlanAPI {
  private static baseUrl = 'http://localhost:3000/api/v1'; // 将来のRails API URL

  // モック用の献立データベース
  private static mealDatabase = {
    meat_dishes: [
      {
        name: '牛肉と野菜の炒め物',
        description: 'ジューシーな牛肉と新鮮な野菜を炒めた栄養バランス抜群の一品',
        category: '主菜',
        ingredients_required: ['牛肉'],
        optional_ingredients: ['玉ねぎ', 'ピーマン', 'にんじん'],
        cooking_time: 20,
        difficulty: '普通',
        instructions: [
          '牛肉を一口大に切る',
          '野菜を食べやすい大きさに切る',
          'フライパンを熱し、牛肉を炒める',
          '野菜を加えて炒め合わせる',
          '調味料で味を整える'
        ]
      },
      {
        name: '豚肉の生姜焼き',
        description: 'ご飯がすすむ定番の生姜焼き。甘辛いタレが食欲をそそります',
        category: '主菜',
        ingredients_required: ['豚肉'],
        optional_ingredients: ['玉ねぎ', '生姜', '醤油', 'みりん'],
        cooking_time: 15,
        difficulty: '簡単',
        instructions: [
          '豚肉に下味をつける',
          '玉ねぎをスライスする',
          'フライパンで豚肉を焼く',
          '玉ねぎを加えて炒める',
          '生姜だれを絡める'
        ]
      },
      {
        name: '鶏肉のヘルシーソテー',
        description: '高タンパク・低脂肪でダイエットにも最適な鶏肉料理',
        category: '主菜',
        ingredients_required: ['鶏肉'],
        optional_ingredients: ['レモン', 'ハーブ', 'オリーブオイル'],
        cooking_time: 25,
        difficulty: '普通',
        instructions: [
          '鶏肉に塩コショウで下味をつける',
          'フライパンで皮目から焼く',
          '裏返して中まで火を通す',
          'レモンとハーブで仕上げる'
        ]
      }
    ],
    vegetable_dishes: [
      {
        name: '野菜サラダ',
        description: 'フレッシュな野菜をたっぷり使った彩り豊かなサラダ',
        category: '副菜',
        ingredients_required: ['レタス', 'トマト'],
        optional_ingredients: ['きゅうり', 'にんじん', 'ドレッシング'],
        cooking_time: 10,
        difficulty: '簡単',
        instructions: [
          '野菜をよく洗う',
          '食べやすい大きさに切る',
          '器に盛り付ける',
          'ドレッシングをかける'
        ]
      },
      {
        name: '野菜の煮物',
        description: '和風だしで優しく煮込んだほっとする味の煮物',
        category: '副菜',
        ingredients_required: ['大根', 'にんじん'],
        optional_ingredients: ['こんにゃく', 'だし', '醤油', 'みりん'],
        cooking_time: 30,
        difficulty: '普通',
        instructions: [
          '野菜を乱切りにする',
          'だし汁を沸騰させる',
          '野菜を加えて煮込む',
          '調味料で味を整える'
        ]
      }
    ],
    soup_dishes: [
      {
        name: '野菜たっぷり味噌汁',
        description: '栄養満点の野菜がたっぷり入った温かい味噌汁',
        category: '汁物',
        ingredients_required: ['味噌'],
        optional_ingredients: ['豆腐', 'わかめ', 'ねぎ', 'だし'],
        cooking_time: 15,
        difficulty: '簡単',
        instructions: [
          'だし汁を温める',
          '野菜を加えて煮る',
          '味噌を溶き入れる',
          '豆腐とわかめを加える',
          'ねぎを散らして完成'
        ]
      }
    ]
  };

  // 献立生成API（モック）
  static async generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse> {
    // 実際のRails APIを叩く代わりに、モックレスポンスを返す
    return new Promise((resolve) => {
      // API呼び出しの遅延をシミュレート（Rails + OpenAI API のレスポンス時間を想定）
      setTimeout(() => {
        try {
          const suggestions = this.createMealSuggestions(request.ingredients);

          const response: MealPlanResponse = {
            success: true,
            data: {
              meal_suggestions: suggestions,
              total_suggestions: suggestions.length,
              generated_at: new Date().toISOString()
            },
            message: 'Meal plan generated successfully'
          };

          resolve(response);
        } catch {
          resolve({
            success: false,
            data: {
              meal_suggestions: [],
              total_suggestions: 0,
              generated_at: new Date().toISOString()
            },
            message: 'Failed to generate meal plan'
          });
        }
      }, 2000); // 2秒の遅延でリアルなAPI応答時間をシミュレート
    });
  }

  // 選択された食材から献立を生成するロジック（OpenAI風の処理をシミュレート）
  private static createMealSuggestions(ingredients: {name: string; category: string}[]) {
    const suggestions: {
      id: number;
      name: string;
      description: string;
      category: string;
      ingredients: string[];
      cooking_time?: number;
      difficulty?: string;
      instructions?: string[];
    }[] = [];

    let suggestionId = 1;

    // 肉類の食材から主菜を提案
    const meatItems = ingredients.filter(item =>
      item.category.includes('肉') || item.category === '魚類'
    );

    const vegetableItems = ingredients.filter(item =>
      item.category.includes('野菜') ||
      item.category.includes('きのこ') ||
      item.category === '豆類'
    );

    const seasoningItems = ingredients.filter(item =>
      item.category.includes('調味料') ||
      item.category.includes('スパイス') ||
      item.category.includes('油')
    );

    // 主菜の生成
    if (meatItems.length > 0) {
      const meatItem = meatItems[0];
      const availableVegetables = vegetableItems.slice(0, 3).map(item => item.name);
      const availableSeasonings = seasoningItems.slice(0, 2).map(item => item.name);

      for (const dish of this.mealDatabase.meat_dishes) {
        if (dish.ingredients_required.some(req =>
          meatItem.name.includes(req) || req.includes(meatItem.name)
        )) {
          const dishIngredients = [
            meatItem.name,
            ...availableVegetables,
            ...availableSeasonings
          ].filter((item, index, arr) => arr.indexOf(item) === index); // 重複除去

          suggestions.push({
            id: suggestionId++,
            name: dish.name,
            description: dish.description,
            category: dish.category,
            ingredients: dishIngredients,
            cooking_time: dish.cooking_time,
            difficulty: dish.difficulty,
            instructions: dish.instructions
          });
          break; // 1つ見つかったら次へ
        }
      }
    }

    // 副菜の生成
    if (vegetableItems.length >= 2) {
      const mainVegetables = vegetableItems.slice(0, 2).map(item => item.name);
      const availableSeasonings = seasoningItems.slice(0, 1).map(item => item.name);

      for (const dish of this.mealDatabase.vegetable_dishes) {
        if (dish.ingredients_required.some(req =>
          vegetableItems.some(veggie => veggie.name.includes(req) || req.includes(veggie.name))
        )) {
          const dishIngredients = [
            ...mainVegetables,
            ...availableSeasonings
          ].filter((item, index, arr) => arr.indexOf(item) === index);

          suggestions.push({
            id: suggestionId++,
            name: dish.name,
            description: dish.description,
            category: dish.category,
            ingredients: dishIngredients,
            cooking_time: dish.cooking_time,
            difficulty: dish.difficulty,
            instructions: dish.instructions
          });
          break;
        }
      }
    }

    // 汁物の生成
    if (vegetableItems.length > 0 || seasoningItems.some(item => item.name.includes('味噌'))) {
      const soupVegetables = vegetableItems.slice(0, 3).map(item => item.name);

      for (const dish of this.mealDatabase.soup_dishes) {
        const dishIngredients = [
          ...soupVegetables,
          '味噌',
          'だし'
        ].filter((item, index, arr) => arr.indexOf(item) === index);

        suggestions.push({
          id: suggestionId++,
          name: dish.name,
          description: dish.description,
          category: dish.category,
          ingredients: dishIngredients,
          cooking_time: dish.cooking_time,
          difficulty: dish.difficulty,
          instructions: dish.instructions
        });
        break;
      }
    }

    return suggestions;
  }
}

// タイプエクスポート
export type { MealPlanRequest, MealPlanResponse };