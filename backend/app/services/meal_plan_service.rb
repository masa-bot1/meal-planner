require 'cgi'
require 'uri'

class MealPlanService
  attr_reader :ingredients, :preferences, :servings

  def initialize(ingredients:, preferences: {}, servings: 2)
    @ingredients = ingredients
    @preferences = preferences
    @servings = servings
  end

  def generate
    begin
      # 入力データの検証
      return error_response('食材が指定されていません') if ingredients.blank?

      # OpenAI API を使用した献立生成
      if Rails.application.config.openai[:api_key].present?
        meal_suggestions = generate_with_openai
      else
        # APIキーが未設定の場合はモック版を使用
        Rails.logger.warn "OpenAI API key not configured, using mock generation"
        meal_suggestions = generate_meal_suggestions
      end

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

  # 特定の料理（主菜/副菜/汁物）のみを再生成
  def regenerate_single_dish(dish_type:, current_dishes:)
    begin
      return error_response('料理タイプが指定されていません') if dish_type.blank?
      return error_response('現在の献立が指定されていません') if current_dishes.blank?

      # OpenAI API を使用した料理再生成
      if Rails.application.config.openai[:api_key].present?
        new_dish = regenerate_dish_with_openai(dish_type, current_dishes)
      else
        Rails.logger.warn "OpenAI API key not configured, using mock regeneration"
        new_dish = generate_mock_dish(dish_type)
      end

      {
        success: true,
        new_dish: new_dish
      }
    rescue StandardError => e
      Rails.logger.error "Dish regeneration error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")

      error_response('料理の再生成中にエラーが発生しました')
    end
  end

  private

  def generate_with_openai
    # OpenAIクライアントの初期化（本番環境以外でlog_errorsを有効化）
    log_errors_enabled = true unless Rails.env.production?

    client = OpenAI::Client.new(
      access_token: Rails.application.config.openai[:api_key],
      log_errors: log_errors_enabled
    )

    # システムプロンプトの設定
    system_prompt = build_system_prompt
    user_prompt = build_user_prompt

    # OpenAI API呼び出し
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: user_prompt }
        ],
        temperature: 0.9
      }
    )

    # レスポンスの解析
    parse_openai_response(response)
  rescue OpenAI::Error => e
    Rails.logger.error "OpenAI API error: #{e.class.name} - #{e.message}"
    Rails.logger.error e.backtrace.first(5).join("\n")

    # エラーの種類に応じた処理
    error_message = case e
    when OpenAI::RateLimitError
      'APIの利用制限に達しました。しばらく待ってから再度お試しください。'
    when OpenAI::InvalidRequestError
      'リクエストに問題がありました。入力内容を確認してください。'
    when OpenAI::AuthenticationError
      'API認証エラーが発生しました。'
    when OpenAI::TimeoutError
      'API接続がタイムアウトしました。もう一度お試しください。'
    else
      'AI献立生成でエラーが発生しました。'
    end

    Rails.logger.warn "Falling back to mock generation due to: #{error_message}"
    # OpenAI APIエラーの場合はモック版にフォールバック
    generate_meal_suggestions
  rescue StandardError => e
    Rails.logger.error "Unexpected error in generate_with_openai: #{e.message}"
    Rails.logger.error e.backtrace.first(5).join("\n")
    generate_meal_suggestions
  end

  def build_system_prompt
    preference_text = build_preference_guidelines

    base_instruction = if preference_text.present?
      "あなたは日本の家庭料理に詳しい料理アシスタントです。\n指定されたテーマに厳密に従って献立を提案してください。テーマの条件を最優先し、必ず守ってください。"
    else
      "あなたは日本の家庭料理に詳しい料理アシスタントです。\n提供された食材を使って、バラエティ豊かな1日の献立（主菜、副菜、汁物）を提案してください。\n\n【調理法のバリエーション】\n揚げる、炒める、焼く、煮る、蒸す、グリル、生など、様々な調理法を積極的に使ってください。\n唐揚げ、天ぷら、とんかつ、コロッケなどの揚げ物も遠慮なく提案してください。"
    end

    <<~PROMPT
      #{base_instruction}

      #{preference_text}

      以下の形式でJSONレスポンスを返してください：
      {
        "main_dish": {
          "name": "料理名",
          "ingredients": ["食材1", "食材2"],
          "cooking_time": "調理時間（分）",
          "calories": "カロリー（kcal）"
        },
        "side_dish": {
          "name": "料理名",
          "ingredients": ["食材1", "食材2"],
          "cooking_time": "調理時間（分）",
          "calories": "カロリー（kcal）"
        },
        "soup": {
          "name": "料理名",
          "ingredients": ["食材1", "食材2"],
          "cooking_time": "調理時間（分）",
          "calories": "カロリー（kcal）"
        },
        "total_calories": "合計カロリー（kcal）",
        "cooking_tips": "調理のコツやポイント"
      }

      注意事項：
      - テーマが指定されている場合は、そのテーマの条件を最優先してください
      - 提供された食材を可能な限り使用してください
      - 一般的な調味料（醤油、みそ、塩など）は含めなくても構いません
      - 調理時間とカロリーは必ずテーマの条件に合わせてください
      - 料理名は検索しやすい一般的な名称を使用してください
    PROMPT
  end

  def build_preference_guidelines
    return "" if preferences.blank? || !preferences.is_a?(Hash)

    selected_preference = preferences[:preference] || preferences['preference']
    return "" if selected_preference.blank?

    guidelines = {
      '楽チン' => <<~GUIDELINE,
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        【最優先テーマ: 楽チン - 時短・簡単】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        《絶対に守るべき条件》
        ✓ 主菜: 10分以内、副菜: 5分以内、汁物: 5分以内（合計20分以内厳守）
        ✓ 包丁を使わない、または最小限（1-2回のみ）
        ✓ レンジ調理・混ぜるだけ・炒めるだけなど工程が少ない料理
        ✓ 下ごしらえ不要な食材を使用（カット野菜、缶詰、冷凍食品推奨）

        《推奨する調理法》
        ○ 電子レンジ調理、ワンパン調理、混ぜるだけ
        × 煮込み料理、下味をつける、複数の鍋を使う

        《料理例》
        主菜: サバ缶トマト煮、豚バラもやしレンジ蒸し、卵とじ丼
        副菜: カット野菜のサラダ、冷奴、きゅうりの塩もみ
        汁物: インスタント味噌汁、卵スープ、わかめスープ
      GUIDELINE

      'ヘルシー' => <<~GUIDELINE,
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        【最優先テーマ: ヘルシー - 低カロリー・健康志向】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        《絶対に守るべき条件》
        ✓ 合計カロリー: 500-550kcal（厳守）
        ✓ 主菜: 200-250kcal、副菜: 50-80kcal、汁物: 50-100kcal
        ✓ 油は一切使わない（ノンオイル調理）
        ✓ 野菜を250g以上使用（生野菜換算）

        《推奨する調理法と食材》
        ○ 蒸す、茹でる、グリル、生（サラダ）
        ○ 鶏ささみ、白身魚、豆腐、こんにゃく、きのこ類、葉物野菜
        × 揚げる、炒める（油使用）、マヨネーズ、クリーム系
        × 豚バラ肉、牛肉、加工肉、チーズ

        《料理例》
        主菜: 鶏ささみの蒸し鶏、白身魚のグリル、豆腐ステーキ
        副菜: 温野菜サラダ、ほうれん草のお浸し、きのこのマリネ
        汁物: 野菜たっぷり味噌汁、わかめスープ、けんちん汁
      GUIDELINE

      'ボリューミー' => <<~GUIDELINE,
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        【最優先テーマ: ボリューミー - 満足感・大盛り】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        《絶対に守るべき条件》
        ✓ 合計カロリー: 900-1100kcal（高カロリー厳守）
        ✓ 主菜: 肉250g以上使用、600kcal以上
        ✓ 副菜: 芋類・マカロニなど炭水化物ベース、200kcal以上
        ✓ 汁物: 具だくさん、150kcal以上
        ✓ 【重要】油や鶏もも肉がある場合は揚げ物を最優先で提案してください

        《推奨する調理法と食材》
        ◎ 揚げ物を最優先！（唐揚げ、とんかつ、天ぷら、コロッケ、フライ）
        ○ 炒め物、濃厚なソース・タレ、マヨネーズたっぷり
        ○ 豚バラ肉、鶏もも肉（皮付き）、牛肉、じゃがいも、卵
        × あっさり系、蒸し料理、薄味、ノンオイル調理

        《料理例》
        主菜: 鶏の唐揚げ（300g）、とんかつ、エビフライ、豚の生姜焼き（肉250g）、ハンバーグ
        副菜: ポテトサラダ（マヨネーズたっぷり）、マカロニサラダ、かぼちゃコロッケ
        汁物: 豚汁（具だくさん）、クリームスープ、カレースープ
        
        ※鶏肉と油がある場合は必ず唐揚げを提案してください！
      GUIDELINE

      '節約' => <<~GUIDELINE,
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        【最優先テーマ: 節約 - 超低コスト】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        《絶対に守るべき条件》
        ✓ 1食250円以内（厳守）
        ✓ もやし、豆腐、卵、鶏むね肉、納豆のみ使用
        ✓ 100円以上の食材は絶対に使わない
        ✓ 少ない種類の食材で3品を作る

        《使用OK食材（1品50円以下）》
        ○ もやし、豆腐、厚揚げ、油揚げ、卵、鶏むね肉、納豆
        ○ キャベツ、玉ねぎ、人参、もやし、きのこ（えのき）
        × 牛肉、豚ロース、刺身、ブランド野菜、輸入食材
        × パプリカ、アボカド、ブロッコリー、トマト

        《料理例》
        主菜: 鶏むね肉のソテー、厚揚げの煮物、卵焼き
        副菜: もやしのナムル、きゃべつの浅漬け、納豆
        汁物: 卵スープ、豆腐とわかめの味噌汁、もやしスープ
      GUIDELINE

      '筋トレ' => <<~GUIDELINE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        【最優先テーマ: 筋トレ - 高タンパク質・低脂質】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        《絶対に守るべき条件》
        ✓ タンパク質: 合計50g以上（主菜35g、副菜10g、汁物5g）
        ✓ 脂質: 合計20g以下（低脂質厳守）
        ✓ 油を使わない調理法のみ（グリル、蒸す、茹でる）
        ✓ 主菜は鶏むね肉200g以上、またはささみ、白身魚

        《推奨する食材》
        ○ 鶏むね肉（皮なし）、ささみ、鮭、マグロ、白身魚
        ○ 卵白、ギリシャヨーグルト、プロテイン、豆腐、納豆
        ○ ブロッコリー、アスパラガス、枝豆、オートミール
        × 豚バラ肉、鶏もも肉（皮付き）、揚げ物、炒め物
        × マヨネーズ、バター、クリーム、チーズ

        《料理例》
        主菜: 鶏むね肉のグリル（P:35g）、鮭のホイル焼き（P:30g）
        副菜: ブロッコリーのサラダ（P:5g）、豆腐サラダ（P:8g）
        汁物: わかめと卵白のスープ（P:5g）、鶏ささみスープ（P:10g）
      GUIDELINE
    }

    guidelines[selected_preference] || ""
  end

  def build_user_prompt
    ingredient_names = ingredients.map { |ing| ing.is_a?(Hash) ? ing[:name] || ing['name'] : ing.to_s }
    ingredient_list = ingredient_names.join(', ')
    serving_text = servings > 1 ? "#{servings}人分" : "1人分"

    prompt = "以下の食材を使って#{serving_text}の献立を作成してください：\n#{ingredient_list}"
    
    # 油がある場合の追加指示
    has_oil = ingredient_names.any? { |name| name.include?('油') || name.include?('オイル') }
    has_chicken = ingredient_names.any? { |name| name.include?('鶏') || name.include?('チキン') }
    
    if has_oil && has_chicken
      prompt += "\n\n【重要】油と鶏肉があるので、唐揚げなどの揚げ物を積極的に提案してください。"
    elsif has_oil
      prompt += "\n\n【重要】油があるので、揚げ物や炒め物を積極的に提案してください。"
    end

    if preferences.present? && preferences.is_a?(Hash)
      selected_preference = preferences[:preference] || preferences['preference']
      if selected_preference.present?
        prompt += "\n\nテーマ: #{selected_preference}"
      end

      cuisine_type = preferences[:cuisine_type] || preferences['cuisine_type']
      dietary_restrictions = preferences[:dietary_restrictions] || preferences['dietary_restrictions']

      if cuisine_type.present?
        prompt += "\n\n料理の種類: #{cuisine_type}"
      end

      if dietary_restrictions.present? && dietary_restrictions.any?
        prompt += "\n\n食事制限: #{dietary_restrictions.join(', ')}"
      end
    end

    prompt
  end

  def parse_openai_response(response)
    content = response.dig("choices", 0, "message", "content")

    # JSONの抽出（```json で囲まれている場合の処理）
    json_match = content.match(/```json\n(.*?)\n```/m)
    json_content = json_match ? json_match[1] : content

    parsed_data = JSON.parse(json_content)

    {
      main_dish: format_dish(parsed_data["main_dish"]),
      side_dish: format_dish(parsed_data["side_dish"]),
      soup: format_dish(parsed_data["soup"]),
      total_calories: parsed_data["total_calories"],
      cooking_tips: parsed_data["cooking_tips"]
    }
  rescue JSON::ParserError => e
    Rails.logger.error "Failed to parse OpenAI response: #{e.message}"
    Rails.logger.error "Response content: #{content}"
    # JSONパースエラーの場合はモック版にフォールバック
    generate_meal_suggestions
  end

  def format_dish(dish_data)
    return nil unless dish_data.is_a?(Hash)

    dish_name = dish_data["name"]

    formatted_dish = {
      name: dish_name,
      ingredients: dish_data["ingredients"] || [],
      cooking_time: dish_data["cooking_time"],
      calories: dish_data["calories"]
    }

    # 料理名から検索ベースのレシピリンクを生成
    if dish_name.present?
      formatted_dish[:recipe_links] = generate_search_links(dish_name)
    end

    formatted_dish
  end

  # 料理名から検索ベースのリンクを生成
  def generate_search_links(dish_name)
    # 検索クエリを構築（スペース区切り）
    youtube_query = "#{dish_name} レシピ"
    google_query = "#{dish_name} レシピ クックパッド"

    # URL用にエンコード（日本語対応）
    encoded_youtube = URI.encode_www_form_component(youtube_query)
    encoded_google = URI.encode_www_form_component(google_query)

    {
      youtube: "https://www.youtube.com/results?search_query=#{encoded_youtube}",
      website: "https://www.google.com/search?q=#{encoded_google}"
    }
  end

  def regenerate_dish_with_openai(dish_type, current_dishes)
    client = OpenAI::Client.new(
      access_token: Rails.application.config.openai[:api_key],
      log_errors: !Rails.env.production?
    )

    system_prompt = build_regenerate_system_prompt(dish_type)
    user_prompt = build_regenerate_user_prompt(dish_type, current_dishes)

    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: user_prompt }
        ],
        temperature: 0.9
      }
    )

    parse_single_dish_response(response, dish_type)
  rescue OpenAI::Error => e
    Rails.logger.error "OpenAI API error during regeneration: #{e.message}"
    generate_mock_dish(dish_type)
  rescue StandardError => e
    Rails.logger.error "Unexpected error in regenerate_dish_with_openai: #{e.message}"
    generate_mock_dish(dish_type)
  end

  def build_regenerate_system_prompt(dish_type)
    dish_definitions = {
      'main_dish' => {
        name: '主菜',
        description: 'メインとなるタンパク質源の料理（肉、魚、卵、豆腐などを使った料理）',
        examples: '生姜焼き、鶏の唐揚げ、鮭の塩焼き、麻婆豆腐、ハンバーグなど'
      },
      'side_dish' => {
        name: '副菜',
        description: '野菜を中心とした料理やサブのおかず',
        examples: 'ほうれん草のおひたし、きんぴらごぼう、野菜サラダ、切り干し大根、ひじきの煮物など'
      },
      'soup' => {
        name: '汁物',
        description: '汁やスープ類の料理',
        examples: '味噌汁、豚汁、すまし汁、けんちん汁、わかめスープ、コンソメスープなど'
      }
    }

    dish_info = dish_definitions[dish_type]

    <<~PROMPT
      あなたは日本の家庭料理に詳しい料理アシスタントです。
      現在の献立の#{dish_info[:name]}だけを別の料理に変更してください。

      #{dish_info[:name]}の定義:
      #{dish_info[:description]}
      例: #{dish_info[:examples]}

      必ず#{dish_info[:name]}に該当する料理を提案してください。
      他の料理とのバランスを考慮してください。

      以下の形式でJSONレスポンスを返してください：
      {
        "name": "料理名",
        "ingredients": ["食材1", "食材2"],
        "cooking_time": "調理時間（分）",
        "calories": "カロリー（kcal）"
      }

      注意事項：
      - #{dish_info[:name]}に該当する料理のみを提案してください
      - 提供された食材を可能な限り使用してください
      - 他の料理と重複しない料理を提案してください
      - 栄養バランスを考慮してください
      - 料理名は検索しやすい一般的な名称を使用してください
    PROMPT
  end

  def build_regenerate_user_prompt(dish_type, current_dishes)
    ingredient_names = ingredients.map { |ing| ing.is_a?(Hash) ? ing[:name] || ing['name'] : ing.to_s }
    ingredient_list = ingredient_names.join(', ')

    dish_names = {
      'main_dish' => '主菜',
      'side_dish' => '副菜',
      'soup' => '汁物'
    }

    current_main = current_dishes[:main_dish] || current_dishes['main_dish']
    current_side = current_dishes[:side_dish] || current_dishes['side_dish']
    current_soup = current_dishes[:soup] || current_dishes['soup']

    <<~PROMPT
      現在の献立:
      - 主菜: #{current_main}
      - 副菜: #{current_side}
      - 汁物: #{current_soup}

      #{dish_names[dish_type]}だけを別の料理に変更してください。
      使用食材: #{ingredient_list}
    PROMPT
  end

  def parse_single_dish_response(response, dish_type)
    content = response.dig("choices", 0, "message", "content")

    json_match = content.match(/```json\n(.*?)\n```/m)
    json_content = json_match ? json_match[1] : content

    parsed_data = JSON.parse(json_content)
    format_dish(parsed_data)
  rescue JSON::ParserError => e
    Rails.logger.error "Failed to parse dish regeneration response: #{e.message}"
    generate_mock_dish(dish_type)
  end

  def generate_mock_dish(dish_type)
    ingredient_name = ingredients.first.is_a?(Hash) ?
      (ingredients.first[:name] || ingredients.first['name']) :
      ingredients.first.to_s

    dishes = {
      'main_dish' => {
        name: "#{ingredient_name}のグリル",
        ingredients: [ingredient_name, "オリーブオイル", "ハーブ"],
        cooking_time: "20分",
        calories: "250kcal"
      },
      'side_dish' => {
        name: "季節野菜のサラダ",
        ingredients: ["レタス", "トマト", ingredient_name],
        cooking_time: "10分",
        calories: "80kcal"
      },
      'soup' => {
        name: "#{ingredient_name}のスープ",
        ingredients: [ingredient_name, "玉ねぎ", "コンソメ"],
        cooking_time: "15分",
        calories: "100kcal"
      }
    }

    dish = dishes[dish_type] || dishes['main_dish']
    format_dish(dish)
  end

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