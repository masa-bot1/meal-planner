class CreateMealPlans < ActiveRecord::Migration[7.1]
  def change
    create_table :meal_plans do |t|
      t.json :meal_suggestions, null: false
      t.json :preferences
      t.integer :total_suggestions, null: false, default: 0
      t.text :original_ingredients
      t.datetime :generated_at

      # インデックス
      t.index :generated_at
      t.index :total_suggestions

      t.timestamps
    end
  end
end