# OpenStruct を明示的に読み込み（Rails 8対応）
require 'ostruct'

# OpenAI API設定
Rails.application.configure do
  # OpenAI APIキーの設定
  config.openai = {
    api_key: ENV['OPENAI_API_KEY']
  }
end