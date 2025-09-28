class MealPlan < ApplicationRecord
  # 献立に使用された食材の関連
  has_many :meal_plan_ingredients, dependent: :destroy
  has_many :ingredients, through: :meal_plan_ingredients

  # 献立の詳細情報（JSON形式で保存）
  # Rails 8ではJSON型カラムは自動的に配列・ハッシュとして扱われるため、serializeは不要

  # デフォルト値の設定
  after_initialize :set_default_preferences

  # バリデーション
  validates :meal_suggestions, presence: true
  validates :total_suggestions, presence: true, numericality: { greater_than: 0 }

  # スコープ
  scope :recent, -> { order(created_at: :desc) }
  scope :by_cuisine_type, ->(type) { where("preferences ->> 'cuisine_type' = ?", type) }

  # 献立の生成日時を日本語形式で取得
  def generated_at_japanese
    created_at.strftime('%Y年%m月%d日 %H:%M')
  end

  # 使用された食材名の一覧を取得
  def ingredient_names
    meal_suggestions.flat_map { |suggestion| suggestion['ingredients'] }.uniq
  end

  # カテゴリ別の献立を取得
  def main_dishes
    meal_suggestions.select { |s| s['category'] == '主菜' }
  end

  def side_dishes
    meal_suggestions.select { |s| s['category'] == '副菜' }
  end

  def soups
    meal_suggestions.select { |s| s['category'] == '汁物' }
  end

  # 平均調理時間を計算
  def average_cooking_time
    times = meal_suggestions.filter_map { |s| s['cooking_time'] }
    return 0 if times.empty?

    (times.sum.to_f / times.length).round
  end

  private

  # デフォルト値を設定
  def set_default_preferences
    self.preferences ||= {}
  end
end