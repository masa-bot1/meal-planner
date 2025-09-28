class MealPlanService
  attr_reader :ingredients, :preferences

  def initialize(ingredients:, preferences: {})
    @ingredients = ingredients
    @preferences = preferences
  end

  def generate
    begin
      # 入力データの検証
      return error_response('食材が指定されていません') if ingredients.blank?

      # 献立生成ロジック（現在はモック、将来的にOpenAI API連携）
      meal_suggestions = generate_meal_suggestions

      {
        success: true,
        meal_suggestions: meal_suggestions
      }
    rescue StandardError => e
      Rails.logger.error "MealPlanService error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")

      error_response('献立生成中にエラーが発生しました')
    end
  end

  private

  def generate_meal_suggestions
    # 食材を分類
    meat_items = filter_ingredients_by_category(['肉', '魚'])
    vegetable_items = filter_ingredients_by_category(['野菜', 'きのこ', '豆'])
    seasoning_items = filter_ingredients_by_category(['調味料', 'スパイス', '油'])

    suggestions = []
    suggestion_id = 1

    # 主菜の生成
    if meat_items.any?
      main_dish = generate_main_dish(meat_items.first, vegetable_items, seasoning_items, suggestion_id)
      suggestions << main_dish if main_dish
      suggestion_id += 1
    end

    # 副菜の生成
    if vegetable_items.length >= 2
      side_dish = generate_side_dish(vegetable_items, seasoning_items, suggestion_id)
      suggestions << side_dish if side_dish
      suggestion_id += 1
    end

    # 汁物の生成
    if vegetable_items.any?
      soup = generate_soup(vegetable_items, suggestion_id)
      suggestions << soup if soup
      suggestion_id += 1
    end

    suggestions
  end

  def generate_main_dish(main_ingredient, vegetables, seasonings, id)
    # 利用可能な野菜と調味料を取得
    available_vegetables = vegetables.first(2).map { |v| v[:name] }
    available_seasonings = seasonings.first(2).map { |s| s[:name] }

    # 主食材に基づいて料理を決定
    dish_info = determine_main_dish(main_ingredient[:name])

    {
      id: id,
      name: dish_info[:name],
      description: dish_info[:description],
      category: '主菜',
      ingredients: [main_ingredient[:name]] + available_vegetables + available_seasonings,
      cooking_time: dish_info[:cooking_time],
      difficulty: dish_info[:difficulty],
      instructions: dish_info[:instructions]
    }
  end

  def generate_side_dish(vegetables, seasonings, id)
    veggie1 = vegetables[0][:name]
    veggie2 = vegetables[1][:name]
    seasoning = seasonings.first&.dig(:name) || 'ドレッシング'

    {
      id: id,
      name: "#{veggie1}と#{veggie2}のサラダ",
      description: 'フレッシュな野菜をたっぷり使った彩り豊かなサラダ',
      category: '副菜',
      ingredients: [veggie1, veggie2, seasoning],
      cooking_time: 10,
      difficulty: '簡単',
      instructions: [
        '野菜をよく洗う',
        '食べやすい大きさに切る',
        '器に盛り付ける',
        'お好みのドレッシングをかける'
      ]
    }
  end

  def generate_soup(vegetables, id)
    soup_vegetables = vegetables.first(3).map { |v| v[:name] }

    {
      id: id,
      name: '野菜たっぷり味噌汁',
      description: '栄養満点の野菜がたっぷり入った温かい味噌汁',
      category: '汁物',
      ingredients: soup_vegetables + ['味噌', 'だし'],
      cooking_time: 15,
      difficulty: '簡単',
      instructions: [
        'だし汁を温める',
        '硬い野菜から順に加えて煮る',
        '味噌を溶き入れる',
        '仕上げにネギを散らして完成'
      ]
    }
  end

  def determine_main_dish(ingredient_name)
    case ingredient_name
    when /牛肉|赤身/
      {
        name: '牛肉と野菜の炒め物',
        description: 'ジューシーな牛肉と新鮮な野菜を炒めた栄養バランス抜群の一品',
        cooking_time: 20,
        difficulty: '普通',
        instructions: [
          '牛肉を一口大に切る',
          '野菜を食べやすい大きさに切る',
          'フライパンを熱し、牛肉を炒める',
          '野菜を加えて炒め合わせる',
          '調味料で味を整える'
        ]
      }
    when /豚肉|ロース/
      {
        name: '豚肉の生姜焼き',
        description: 'ご飯がすすむ定番の生姜焼き。甘辛いタレが食欲をそそります',
        cooking_time: 15,
        difficulty: '簡単',
        instructions: [
          '豚肉に下味をつける',
          '玉ねぎをスライスする',
          'フライパンで豚肉を焼く',
          '玉ねぎを加えて炒める',
          '生姜だれを絡める'
        ]
      }
    when /鶏肉|むね肉|もも肉/
      {
        name: '鶏肉のヘルシーソテー',
        description: '高タンパク・低脂肪でダイエットにも最適な鶏肉料理',
        cooking_time: 25,
        difficulty: '普通',
        instructions: [
          '鶏肉に塩コショウで下味をつける',
          'フライパンで皮目から焼く',
          '裏返して中まで火を通す',
          'レモンとハーブで仕上げる'
        ]
      }
    else
      {
        name: "#{ingredient_name}の煮付け",
        description: '和風だしで優しく煮込んだほっとする味の一品',
        cooking_time: 30,
        difficulty: '普通',
        instructions: [
          '主材料を下処理する',
          'だし汁を温める',
          '材料を加えて煮込む',
          '調味料で味を整える'
        ]
      }
    end
  end

  def filter_ingredients_by_category(categories)
    ingredients.select do |ingredient|
      categories.any? { |cat| ingredient[:category].include?(cat) }
    end
  end

  def error_response(message)
    {
      success: false,
      error: message
    }
  end
end