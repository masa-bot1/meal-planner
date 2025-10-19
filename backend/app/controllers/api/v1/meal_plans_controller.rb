class Api::V1::MealPlansController < ApplicationController
  # JSON形式でのレスポンスを前提
  before_action :set_json_format, only: [:generate]  # 献立生成エンドポイント
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

  private

  def meal_plan_params
    params.require(:meal_plan).permit(
      ingredients: [:name, :category],
      preferences: [:cuisine_type, :meal_type, dietary_restrictions: []]
    )
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