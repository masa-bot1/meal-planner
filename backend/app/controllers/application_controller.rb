class ApplicationController < ActionController::API
  # API用の例外クラス定義
  class BadRequest < StandardError; end
  class NotFound < StandardError; end
  class UnprocessableEntity < StandardError; end

  # 例外ハンドリング
  rescue_from BadRequest, with: :render_bad_request
  rescue_from NotFound, with: :render_not_found
  rescue_from UnprocessableEntity, with: :render_unprocessable_entity
  rescue_from StandardError, with: :render_internal_server_error

  private

  def render_bad_request(exception)
    render json: {
      success: false,
      message: exception.message,
      error_type: 'bad_request'
    }, status: :bad_request
  end

  def render_not_found(exception)
    render json: {
      success: false,
      message: exception.message,
      error_type: 'not_found'
    }, status: :not_found
  end

  def render_unprocessable_entity(exception)
    render json: {
      success: false,
      message: exception.message,
      error_type: 'unprocessable_entity'
    }, status: :unprocessable_entity
  end

  def render_internal_server_error(exception)
    Rails.logger.error "Internal Server Error: #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")

    render json: {
      success: false,
      message: Rails.env.production? ? 'サーバーエラーが発生しました' : exception.message,
      error_type: 'internal_server_error'
    }, status: :internal_server_error
  end
end
