import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiMealSuggestions } from './mealPlanAPI';

const STORAGE_KEY = '@meal_planner:latest_meal_plan';

export interface StoredMealPlan {
  id: string;
  createdAt: string;
  selectedIngredients: string[];
  mealPlan: ApiMealSuggestions;
}

/**
 * 最新の献立を保存
 */
export async function saveMealPlan(
  selectedIngredients: string[],
  mealPlan: ApiMealSuggestions
): Promise<void> {
  try {
    const data: StoredMealPlan = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      selectedIngredients,
      mealPlan,
    };
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('献立を保存しました');
  } catch (error) {
    console.error('献立の保存に失敗しました:', error);
    throw error;
  }
}

/**
 * 最新の献立を読み込み
 */
export async function loadMealPlan(): Promise<StoredMealPlan | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (data === null) {
      console.log('保存された献立がありません');
      return null;
    }
    
    const parsed = JSON.parse(data) as StoredMealPlan;
    console.log('献立を読み込みました');
    return parsed;
  } catch (error) {
    console.error('献立の読み込みに失敗しました:', error);
    return null;
  }
}

/**
 * 保存された献立を削除
 */
export async function clearMealPlan(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('献立を削除しました');
  } catch (error) {
    console.error('献立の削除に失敗しました:', error);
    throw error;
  }
}

/**
 * 献立が保存されているか確認
 */
export async function hasSavedMealPlan(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data !== null;
  } catch (error) {
    console.error('献立の確認に失敗しました:', error);
    return false;
  }
}
