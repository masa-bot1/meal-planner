import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { MockMealPlanAPI } from '@/services/mockMealPlanAPI';

interface MealSuggestion {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  category: string;
  cooking_time?: number;
  difficulty?: string;
  instructions?: string[];
}

export function MealPlanGenerator() {
  const { selectedItems } = useSelectedItems();
  const [generatedMeals, setGeneratedMeals] = useState<MealSuggestion[]>([]);
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
      // モックAPIを呼び出し（将来的にRails + OpenAI APIに置き換え）
      const response = await MockMealPlanAPI.generateMealPlan({
        ingredients: selectedItems,
        preferences: {
          meal_type: '夕食', // デフォルト設定
          cuisine_type: '和食' // デフォルト設定
        }
      });

      if (response.success) {
        // APIレスポンスから献立データを取得
        const meals: MealSuggestion[] = response.data.meal_suggestions.map(meal => ({
          id: meal.id,
          name: meal.name,
          description: meal.description,
          category: meal.category,
          ingredients: meal.ingredients,
          cooking_time: meal.cooking_time,
          difficulty: meal.difficulty,
          instructions: meal.instructions
        }));

        setGeneratedMeals(meals);
        console.log('献立生成成功:', response.data.total_suggestions, '件の献立を生成');
      } else {
        setError(response.message || '献立の生成に失敗しました');
      }
    } catch (err) {
      console.error('API呼び出しエラー:', err);
      setError('ネットワークエラーが発生しました');
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

        {generatedMeals.length > 0 && (
          <ThemedView style={styles.mealsContainer}>
            <Text variant="headlineSmall" style={styles.mealsTitle}>
              📋 提案された献立
            </Text>
            <Text variant="bodySmall" style={styles.mealsSubtitle}>
              Rails + OpenAI APIから生成された献立（モック）
            </Text>
            {generatedMeals.map((meal) => (
              <Card key={meal.id} style={styles.mealCard}>
                <Card.Content>
                  <ThemedView style={styles.mealHeader}>
                    <Text variant="titleMedium" style={styles.mealName}>
                      {meal.name}
                    </Text>
                    <Chip mode="outlined" style={styles.categoryChip}>
                      {meal.category}
                    </Chip>
                  </ThemedView>
                  <Text variant="bodyMedium" style={styles.mealDescription}>
                    {meal.description}
                  </Text>

                  {/* 調理時間と難易度 */}
                  {(meal.cooking_time || meal.difficulty) && (
                    <ThemedView style={styles.mealInfoRow}>
                      {meal.cooking_time && (
                        <Chip mode="flat" style={styles.infoChip}>
                          ⏱️ {meal.cooking_time}分
                        </Chip>
                      )}
                      {meal.difficulty && (
                        <Chip mode="flat" style={styles.infoChip}>
                          📊 {meal.difficulty}
                        </Chip>
                      )}
                    </ThemedView>
                  )}

                  <ThemedView style={styles.ingredientsContainer}>
                    <Text variant="bodySmall" style={styles.ingredientsLabel}>
                      使用食材:
                    </Text>
                    <ThemedView style={styles.ingredientChips}>
                      {meal.ingredients.map((ingredient, idx) => (
                        <Chip
                          key={idx}
                          mode="flat"
                          style={styles.ingredientChip}
                          textStyle={styles.ingredientChipText}
                        >
                          {ingredient}
                        </Chip>
                      ))}
                    </ThemedView>
                  </ThemedView>

                  {/* 調理手順 */}
                  {meal.instructions && meal.instructions.length > 0 && (
                    <ThemedView style={styles.instructionsContainer}>
                      <Text variant="bodySmall" style={styles.instructionsLabel}>
                        📝 調理手順:
                      </Text>
                      {meal.instructions.map((instruction, idx) => (
                        <Text key={idx} variant="bodySmall" style={styles.instructionText}>
                          {idx + 1}. {instruction}
                        </Text>
                      ))}
                    </ThemedView>
                  )}
                </Card.Content>
              </Card>
            ))}
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
  },
  mealDescription: {
    color: '#666',
    marginBottom: 12,
  },
  mealInfoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  infoChip: {
    backgroundColor: '#E3F2FD',
    height: 28,
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
    height: 28,
  },
  ingredientChipText: {
    fontSize: 12,
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
});