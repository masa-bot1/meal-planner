# OpenAI API設定
Rails.application.configure do
  # OpenAI APIキーの設定
  # 本番環境では環境変数から取得
  # 開発環境では credentials.yml.enc から取得

  config.openai = OpenStruct.new(
    api_key: Rails.env.production? ?
             ENV['OPENAI_API_KEY'] :
             Rails.application.credentials.openai&.api_key || ENV['OPENAI_API_KEY'],

    # APIのデフォルト設定
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
    temperature: 0.7
  )
end

# OpenAI クライアントの初期化
if Rails.application.config.openai.api_key.present?
  OpenAI.configure do |config|
    config.access_token = Rails.application.config.openai.api_key
    config.log_errors = Rails.env.development?
  end
else
  Rails.logger.warn "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable or add to Rails credentials."
end