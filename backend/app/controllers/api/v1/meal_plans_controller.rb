class Api::V1::MealPlansController < ApplicationController
  # JSON形式でのレスポンスを前提
  before_action :set_json_format, only: [:generate, :regenerate_dish]  # 献立生成エンドポイント
  # POST /api/v1/meal_plans/generate
  def generate
    begin
      # リクエストパラメータの検証
      validate_generate_params

      # 献立生成サービスの呼び出し
      meal_plan_service = MealPlanService.new(
        ingredients: meal_plan_params[:ingredients],
        preferences: meal_plan_params[:preferences] || {}
      )

      result = meal_plan_service.generate

      if result[:success]
        render json: {
          success: true,
          data: {
            meal_suggestions: result[:meal_suggestions],
            total_suggestions: result[:meal_suggestions].length,
            generated_at: Time.current.iso8601
          },
          message: '献立を正常に生成しました'
        }, status: :ok
      else
        render json: {
          success: false,
          data: {
            meal_suggestions: [],
            total_suggestions: 0,
            generated_at: Time.current.iso8601
          },
          message: result[:error] || '献立の生成に失敗しました'
        }, status: :unprocessable_entity
      end

    rescue ActionController::ParameterMissing => e
      render json: {
        success: false,
        data: {
          meal_suggestions: [],
          total_suggestions: 0,
          generated_at: Time.current.iso8601
        },
        message: "必須パラメータが不足しています: #{e.param}"
      }, status: :bad_request

    rescue StandardError => e
      Rails.logger.error "MealPlan generation error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")

      render json: {
        success: false,
        data: {
          meal_suggestions: [],
          total_suggestions: 0,
          generated_at: Time.current.iso8601
        },
        message: 'サーバーエラーが発生しました'
      }, status: :internal_server_error
    end
  end

  # POST /api/v1/meal_plans/regenerate_dish
  # 特定の料理（主菜/副菜/汁物）のみを再生成
  def regenerate_dish
    begin
      validate_regenerate_params

      meal_plan_service = MealPlanService.new(
        ingredients: regenerate_params[:ingredients],
        preferences: regenerate_params[:preferences] || {}
      )

      result = meal_plan_service.regenerate_single_dish(
        dish_type: regenerate_params[:dish_type],
        current_dishes: regenerate_params[:current_dishes]
      )

      if result[:success]
        render json: {
          success: true,
          data: {
            dish_type: regenerate_params[:dish_type],
            new_dish: result[:new_dish],
            generated_at: Time.current.iso8601
          },
          message: '料理を正常に再生成しました'
        }, status: :ok
      else
        render json: {
          success: false,
          message: result[:error] || '料理の再生成に失敗しました'
        }, status: :unprocessable_entity
      end

    rescue ActionController::ParameterMissing => e
      render json: {
        success: false,
        message: "必須パラメータが不足しています: #{e.param}"
      }, status: :bad_request

    rescue StandardError => e
      Rails.logger.error "Dish regeneration error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")

      render json: {
        success: false,
        message: 'サーバーエラーが発生しました'
      }, status: :internal_server_error
    end
  end

  private

  def meal_plan_params
    params.require(:meal_plan).permit(
      ingredients: [:name, :category],
      preferences: [:cuisine_type, :meal_type, dietary_restrictions: []]
    )
  end

  def regenerate_params
    params.require(:regenerate).permit(
      :dish_type,
      ingredients: [:name, :category],
      current_dishes: [:main_dish, :side_dish, :soup],
      preferences: [:cuisine_type, :meal_type, dietary_restrictions: []]
    )
  end

  def validate_regenerate_params
    unless regenerate_params[:dish_type].present?
      raise ActionController::ParameterMissing.new(:dish_type)
    end

    unless ['main_dish', 'side_dish', 'soup'].include?(regenerate_params[:dish_type])
      raise ActionController::BadRequest.new('dish_typeは main_dish, side_dish, soup のいずれかである必要があります')
    end

    if regenerate_params[:ingredients].blank?
      raise ActionController::ParameterMissing.new(:ingredients)
    end

    if regenerate_params[:current_dishes].blank?
      raise ActionController::ParameterMissing.new(:current_dishes)
    end
  end

  def validate_generate_params
    # 食材が提供されているかチェック
    if meal_plan_params[:ingredients].blank?
      raise ActionController::ParameterMissing.new(:ingredients)
    end

    # 食材の形式チェック
    meal_plan_params[:ingredients].each do |ingredient|
      unless ingredient[:name].present? && ingredient[:category].present?
        raise ActionController::BadRequest.new('食材の名前とカテゴリは必須です')
      end
    end
  end

  def set_json_format
    request.format = :json
  end
end