import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { MealPlanAPI, ApiMealSuggestions } from '@/services/mealPlanAPI';

export function MealPlanGenerator() {
  const { selectedItems } = useSelectedItems();
  const [mealSuggestions, setMealSuggestions] = useState<ApiMealSuggestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 献立作成ロジック（モックAPI呼び出し）
  const generateMealPlan = async () => {
    if (selectedItems.length === 0) {
      setError('食材を選択してください');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Rails + OpenAI APIを呼び出し
      const response = await MealPlanAPI.generateMealPlan({
        ingredients: selectedItems,
        preferences: {
          meal_type: '夕食', // デフォルト設定
          cuisine_type: '和食' // デフォルト設定
        }
      });

      if (response.success) {
        // APIレスポンスから献立データを取得
        const suggestions: ApiMealSuggestions = response.data.meal_suggestions;
        setMealSuggestions(suggestions);
        console.log('献立生成成功:', response.data.total_suggestions, '件の献立を生成');
      } else {
        setError(response.message || '献立の生成に失敗しました');
      }
    } catch (err) {
      console.error('Rails API呼び出しエラー:', err);
      setError('Rails APIとの通信でエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // 食材が選択されているかどうかをチェック
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <Card style={styles.card}>
      <Card.Title
        title="🍽️ 献立作成"
        subtitle="選択した食材から献立を提案します"
        titleStyle={styles.cardTitle}
      />
      <Card.Content>
        <ThemedView style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={generateMealPlan}
            disabled={!hasSelectedItems || isGenerating}
            icon={isGenerating ? undefined : "chef-hat"}
            style={[
              styles.generateButton,
              !hasSelectedItems && styles.disabledButton
            ]}
          >
            {isGenerating ? (
              <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.loadingText}>献立を作成中...</Text>
              </ThemedView>
            ) : (
              '選択した食材で献立を作成'
            )}
          </Button>

          {/* 食材未選択時のヒントメッセージ */}
          {!hasSelectedItems && (
            <Text variant="bodySmall" style={styles.hintText}>
              食材カテゴリから食材を選択してください
            </Text>
          )}
        </ThemedView>

        {/* エラー表示 */}
        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </Card.Content>
          </Card>
        )}

        {mealSuggestions && (
          <ThemedView style={styles.mealsContainer}>
            <Text variant="headlineSmall" style={styles.mealsTitle}>
              📋 提案された献立
            </Text>

            {/* 主菜 */}
            <Card style={styles.mealCard}>
              <Card.Content>
                <ThemedView style={styles.mealHeader}>
                  <Text variant="titleMedium" style={styles.mealName}>
                    🍖 主菜: {mealSuggestions.main_dish.name}
                  </Text>
                  <Chip 
                    mode="outlined" 
                    style={styles.categoryChip}
                    compact={false}
                  >
                    主菜
                  </Chip>
                </ThemedView>

                <ThemedView style={styles.mealInfoRow}>
                  <Chip 
                    mode="flat" 
                    style={styles.infoChip}
                    textStyle={styles.infoChipText}
                    compact={false}
                  >
                    ⏱️ {mealSuggestions.main_dish.cooking_time}分
                  </Chip>
                  <Chip 
                    mode="flat" 
                    style={styles.infoChip}
                    textStyle={styles.infoChipText}
                    compact={false}
                  >
                    🔥 {mealSuggestions.main_dish.calories}kcal
                  </Chip>
                </ThemedView>

                <ThemedView style={styles.ingredientsContainer}>
                  <Text variant="bodySmall" style={styles.ingredientsLabel}>
                    使用食材:
                  </Text>
                  <ThemedView style={styles.ingredientChips}>
                    {mealSuggestions.main_dish.ingredients.map((ingredient, idx) => (
                      <Chip
                        key={idx}
                        mode="flat"
                        style={styles.ingredientChip}
                        textStyle={styles.ingredientChipText}
                        compact={false}
                      >
                        {ingredient}
                      </Chip>
                    ))}
                  </ThemedView>
                </ThemedView>
              </Card.Content>
            </Card>

            {/* 副菜 */}
            <Card style={styles.mealCard}>
              <Card.Content>
                <ThemedView style={styles.mealHeader}>
                  <Text variant="titleMedium" style={styles.mealName}>
                    🥗 副菜: {mealSuggestions.side_dish.name}
                  </Text>
                  <Chip 
                    mode="outlined" 
                    style={styles.categoryChip}
                    compact={false}
                  >
                    副菜
                  </Chip>
                </ThemedView>

                <ThemedView style={styles.mealInfoRow}>
                  <Chip 
                    mode="flat" 
                    style={styles.infoChip}
                    textStyle={styles.infoChipText}
                    compact={false}
                  >
                    ⏱️ {mealSuggestions.side_dish.cooking_time}分
                  </Chip>
                  <Chip 
                    mode="flat" 
                    style={styles.infoChip}
                    textStyle={styles.infoChipText}
                    compact={false}
                  >
                    🔥 {mealSuggestions.side_dish.calories}kcal
                  </Chip>
                </ThemedView>

                <ThemedView style={styles.ingredientsContainer}>
                  <Text variant="bodySmall" style={styles.ingredientsLabel}>
                    使用食材:
                  </Text>
                  <ThemedView style={styles.ingredientChips}>
                    {mealSuggestions.side_dish.ingredients.map((ingredient, idx) => (
                      <Chip
                        key={idx}
                        mode="flat"
                        style={styles.ingredientChip}
                        textStyle={styles.ingredientChipText}
                        compact={false}
                      >
                        {ingredient}
                      </Chip>
                    ))}
                  </ThemedView>
                </ThemedView>
              </Card.Content>
            </Card>

            {/* 汁物 */}
            <Card style={styles.mealCard}>
              <Card.Content>
                <ThemedView style={styles.mealHeader}>
                  <Text variant="titleMedium" style={styles.mealName}>
                    🍲 汁物: {mealSuggestions.soup.name}
                  </Text>
                  <Chip 
                    mode="outlined" 
                    style={styles.categoryChip}
                    compact={false}
                  >
                    汁物
                  </Chip>
                </ThemedView>

                <ThemedView style={styles.mealInfoRow}>
                  <Chip 
                    mode="flat" 
                    style={styles.infoChip}
                    textStyle={styles.infoChipText}
                    compact={false}
                  >
                    ⏱️ {mealSuggestions.soup.cooking_time}分
                  </Chip>
                  <Chip 
                    mode="flat" 
                    style={styles.infoChip}
                    textStyle={styles.infoChipText}
                    compact={false}
                  >
                    🔥 {mealSuggestions.soup.calories}kcal
                  </Chip>
                </ThemedView>

                <ThemedView style={styles.ingredientsContainer}>
                  <Text variant="bodySmall" style={styles.ingredientsLabel}>
                    使用食材:
                  </Text>
                  <ThemedView style={styles.ingredientChips}>
                    {mealSuggestions.soup.ingredients.map((ingredient, idx) => (
                      <Chip
                        key={idx}
                        mode="flat"
                        style={styles.ingredientChip}
                        textStyle={styles.ingredientChipText}
                        compact={false}
                      >
                        {ingredient}
                      </Chip>
                    ))}
                  </ThemedView>
                </ThemedView>
              </Card.Content>
            </Card>

            {/* 合計カロリーと料理のコツ */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.summaryTitle}>
                  📊 献立サマリー
                </Text>
                <Text variant="bodyLarge" style={styles.totalCalories}>
                  合計カロリー: {mealSuggestions.total_calories}kcal
                </Text>
                <Text variant="bodyMedium" style={styles.cookingTips}>
                  💡 料理のコツ: {mealSuggestions.cooking_tips}
                </Text>
              </Card.Content>
            </Card>
          </ThemedView>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
    backgroundColor: '#FFF8E1',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: '#FF9800',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    marginBottom: 16,
    elevation: 2,
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  mealsContainer: {
    marginTop: 16,
  },
  mealsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#E65100',
  },
  mealsSubtitle: {
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  mealCard: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
  },
  categoryChip: {
    backgroundColor: '#E8F5E8',
    minHeight: 32,
    paddingVertical: 4,
  },
  mealDescription: {
    color: '#666',
    marginBottom: 12,
  },
  mealInfoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoChip: {
    backgroundColor: '#E3F2FD',
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  infoChipText: {
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 2,
  },
  ingredientsContainer: {
    marginTop: 8,
  },
  ingredientsLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#424242',
  },
  ingredientChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientChip: {
    backgroundColor: '#F3E5F5',
    minHeight: 32,
    paddingVertical: 4,
  },
  ingredientChipText: {
    fontSize: 12,
    lineHeight: 16,
  },
  instructionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  instructionsLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#424242',
  },
  instructionText: {
    color: '#555',
    marginBottom: 4,
    paddingLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  hintText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#F3E5F5',
    elevation: 3,
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 12,
  },
  totalCalories: {
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 12,
  },
  cookingTips: {
    color: '#424242',
    lineHeight: 20,
  },
});