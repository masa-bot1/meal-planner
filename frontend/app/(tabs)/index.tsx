import { StyleSheet } from 'react-native';
import {
  Button,
  Card,
} from 'react-native-paper';
import { router } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import MealPlannerHeaderImage from '@/components/MealPlannerHeaderImage';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';
import { MealPlanGenerator } from '@/components/MealPlanGenerator';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E8F5E8', dark: '#1B5E20' }}
      headerImage={<MealPlannerHeaderImage />}>

      {/* 選択中の食材表示 */}
      <SelectedItemsDisplay />

      {/* 食材カテゴリカード */}
      <Card style={styles.categoryCard}>
        <Card.Title
          title="食材カテゴリ"
          subtitle="食材を選択してください"
          titleStyle={styles.cardTitle}
        />
        <Card.Content style={styles.categoryContent}>

          <ThemedView style={styles.categoryButtons}>
            <Button
              mode="contained"
              icon="food-steak"
              style={[styles.categoryButton, styles.meatButton]}
              labelStyle={styles.categoryButtonLabel}
              onPress={() => {
                console.log('肉類カテゴリを選択');
                router.push('/categories/meat');
              }}
            >
              肉類
            </Button>

            <Button
              mode="contained"
              icon="carrot"
              style={[styles.categoryButton, styles.vegetableButton]}
              labelStyle={styles.categoryButtonLabel}
              onPress={() => {
                console.log('野菜類カテゴリを選択');
                router.push('/categories/vegetables');
              }}
            >
              野菜類
            </Button>

            <Button
              mode="contained"
              icon="bottle-tonic"
              style={[styles.categoryButton, styles.seasoningButton]}
              labelStyle={styles.categoryButtonLabel}
              onPress={() => {
                console.log('調味料・その他カテゴリを選択');
                router.push('/categories/seasoning');
              }}
            >
              調味料・その他
            </Button>
          </ThemedView>
        </Card.Content>
      </Card>

      {/* 献立作成機能 */}
      <MealPlanGenerator />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  card: {
    margin: 16,
    marginBottom: 16,
  },
  categoryCard: {
    margin: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  categoryContent: {
    paddingTop: 8,
  },
  categoryDescription: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  categoryButtons: {
    gap: 12,
  },
  categoryButton: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  categoryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  meatButton: {
    backgroundColor: '#FF5722', // オレンジ（肉類）
  },
  vegetableButton: {
    backgroundColor: '#4CAF50', // 緑（野菜類）
  },
  seasoningButton: {
    backgroundColor: '#673AB7', // 紫（調味料・その他）
  },
  textInput: {
    margin: 16,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  headerSection: {
    margin: 16,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  exampleTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  coloredHeader: {
    backgroundColor: '#6200ee',
  },
  mealPlannerHeader: {
    backgroundColor: '#4CAF50', // 緑色（食べ物・健康をイメージ）
  },
  shoppingListHeader: {
    backgroundColor: '#FF5722', // オレンジ色（アクション・緊急性をイメージ）
  },
  ingredientsHeader: {
    backgroundColor: '#2196F3', // 青色（管理・整理をイメージ）
  },
});
