import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, Alert } from 'react-native';
import { Button, Card, Text, Chip, ActivityIndicator, ProgressBar, IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems, CuisineGenre } from '@/contexts/SelectedItemsContext';
import { MealPlanAPI, ApiMealSuggestions } from '@/services/mealPlanAPI';
import { saveMealPlan, loadMealPlan, clearMealPlan } from '@/services/storageService';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export function MealPlanGenerator() {
  const { selectedItems, selectedGenre, setSelectedGenre } = useSelectedItems();
  const [mealSuggestions, setMealSuggestions] = useState<ApiMealSuggestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<'main_dish' | 'side_dish' | 'soup' | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const preferences = ['楽チン', 'ヘルシー', 'ボリューミー', '節約', '筋トレ'];

  // アプリ起動時に保存された献立を読み込む
  useEffect(() => {
    const loadSavedMealPlan = async () => {
      try {
        const savedData = await loadMealPlan();
        if (savedData && savedData.mealPlan) {
          // 献立データの構造を検証
          const mealPlan = savedData.mealPlan;
          if (mealPlan.main_dish && mealPlan.side_dish && mealPlan.soup) {
            setMealSuggestions(mealPlan);
            console.log('保存された献立を読み込みました:', savedData.createdAt);
          } else {
            console.warn('保存された献立のデータ構造が不正です。クリアします。');
            await clearMealPlan();
          }
        }
      } catch (error) {
        console.error('献立の読み込みエラー:', error);
      } finally {
        setIsLoadingFromStorage(false);
      }
    };

    loadSavedMealPlan();
  }, []);

  // ローディングアニメーション開始
  useEffect(() => {
    if (isGenerating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isGenerating, fadeAnim]);

  // 進捗メッセージの更新
  useEffect(() => {
    if (!isGenerating) return;

    const messages = [
      '食材を分析しています...',
      'AIが献立を考えています...',
      'レシピを検索しています...',
      '栄養バランスを確認しています...',
      '最終調整をしています...',
    ];

    let currentIndex = 0;
    setLoadingMessage(messages[0]);
    setLoadingProgress(0.2);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingMessage(messages[currentIndex]);
      setLoadingProgress(Math.min(0.9, 0.2 + (currentIndex * 0.15)));
    }, 3000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // 献立生成をキャンセル
  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setLoadingProgress(0);
    setLoadingMessage('');
    setError('献立の生成がキャンセルされました');
  };

  // 献立作成ロジック（モックAPI呼び出し）
  const generateMealPlan = async () => {
    if (selectedItems.length === 0) {
      setError('食材を選択してください');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setLoadingProgress(0.1);
    setLoadingMessage('準備中...');

    // AbortControllerを作成
    abortControllerRef.current = new AbortController();

    try {
      // Rails + OpenAI APIを呼び出し
      const response = await MealPlanAPI.generateMealPlan({
        ingredients: selectedItems,
        preferences: {
          preference: selectedPreference || undefined,
          meal_type: '夕食',
          cuisine_type: selectedGenre || undefined
        }
      });

      if (response.success) {
        // APIレスポンスから献立データを取得
        const suggestions: ApiMealSuggestions = response.data.meal_suggestions;
        setMealSuggestions(suggestions);
        setLoadingProgress(1);
        setLoadingMessage('完了しました！');
        console.log('献立生成成功:', response.data.total_suggestions, '件の献立を生成');

        // 生成した献立を自動保存
        try {
          const ingredientNames = selectedItems.map(item => item.name);
          await saveMealPlan(ingredientNames, suggestions);
          console.log('献立を自動保存しました');
        } catch (saveError) {
          console.error('献立の保存に失敗:', saveError);
          // 保存失敗してもエラー表示はしない（献立は表示されている）
        }
      } else {
        setError(response.message || '献立の生成に失敗しました');
      }
    } catch (err) {
      console.error('Rails API呼び出しエラー:', err);
      if (abortControllerRef.current?.signal.aborted) {
        // キャンセルされた場合は何もしない（既にエラー設定済み）
      } else {
        setError('Rails APIとの通信でエラーが発生しました');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      setTimeout(() => {
        setLoadingProgress(0);
        setLoadingMessage('');
      }, 1000);
    }
  };

  // 食材が選択されているかどうかをチェック
  const hasSelectedItems = selectedItems.length > 0;

  // 合計調理時間を計算する関数
  const calculateTotalCookingTime = (suggestions: ApiMealSuggestions): number => {
    const mainTime = parseInt(suggestions.main_dish.cooking_time) || 0;
    const sideTime = parseInt(suggestions.side_dish.cooking_time) || 0;
    const soupTime = parseInt(suggestions.soup.cooking_time) || 0;
    return mainTime + sideTime + soupTime;
  };

  // レシピリンクを開く関数
  const openRecipeLink = async (url: string, type: 'youtube' | 'website') => {
    try {
      // YouTube リンクの場合は可能であればアプリで開く
      if (type === 'youtube') {
        await Linking.openURL(url);
      } else {
        // Web サイトの場合はインアプリブラウザで開く
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (error) {
      console.error('リンクを開けませんでした:', error);
      // フォールバック: デフォルトブラウザで開く
      try {
        await Linking.openURL(url);
      } catch (fallbackError) {
        console.error('フォールバック失敗:', fallbackError);
      }
    }
  };

  // 献立を削除する関数
  const handleClearMealPlan = () => {
    Alert.alert(
      '献立を削除',
      '保存された献立を削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel'
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearMealPlan();
              setMealSuggestions(null);
              console.log('献立を削除しました');
            } catch (error) {
              console.error('献立の削除に失敗:', error);
              setError('献立の削除に失敗しました');
            }
          }
        }
      ]
    );
  };

  // 個別の料理を再生成
  const regenerateSingleDish = async (dishType: 'main_dish' | 'side_dish' | 'soup') => {
    if (!mealSuggestions) return;

    setIsRegenerating(dishType);
    setError(null);

    try {
      const dishNames = {
        main_dish: '主菜',
        side_dish: '副菜',
        soup: '汁物'
      };

      console.log(`${dishNames[dishType]}を再生成中...`);

      const response = await MealPlanAPI.regenerateDish({
        dishType,
        ingredients: selectedItems,
        currentDishes: {
          main_dish: mealSuggestions.main_dish.name,
          side_dish: mealSuggestions.side_dish.name,
          soup: mealSuggestions.soup.name
        },
        preferences: {
          meal_type: '夕食',
          cuisine_type: selectedGenre || undefined
        }
      });

      console.log('再生成API レスポンス:', response);

      if (!response.success) {
        setError(response.message || `${dishNames[dishType]}の再生成に失敗しました`);
        return;
      }

      if (!response.data) {
        console.error('レスポンスにdataが含まれていません:', response);
        setError(`${dishNames[dishType]}の再生成に失敗しました（レスポンスエラー）`);
        return;
      }

      if (!response.data.new_dish) {
        console.error('レスポンスのdataにnew_dishが含まれていません:', response.data);
        setError(`${dishNames[dishType]}の再生成に失敗しました（データエラー）`);
        return;
      }

      console.log('新しい料理:', response.data.new_dish);
        
      // 献立を更新（他の料理はそのまま）
      const updatedMealPlan = {
        ...mealSuggestions,
        [dishType]: response.data.new_dish
      };

      setMealSuggestions(updatedMealPlan);
      console.log(`${dishNames[dishType]}を再生成しました:`, response.data.new_dish.name);

      // 更新した献立を保存
      try {
        const ingredientNames = selectedItems.map(item => item.name);
        await saveMealPlan(ingredientNames, updatedMealPlan);
        console.log('更新した献立を保存しました');
      } catch (saveError) {
        console.error('献立の保存に失敗:', saveError);
      }
    } catch (err) {
      console.error('再生成エラー:', err);
      setError('料理の再生成中にエラーが発生しました');
    } finally {
      setIsRegenerating(null);
    }
  };

  // 初回読み込み中の表示
  if (isLoadingFromStorage) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title="🍽️ 献立作成"
        subtitle="選択した食材から献立を提案します"
        titleStyle={styles.cardTitle}
      />
      <Card.Content>
        {/* ジャンル選択 */}
        <ThemedView style={styles.preferenceSection}>
          <Text variant="titleSmall" style={styles.preferenceSectionTitle}>
            🌍 ジャンルを選択
          </Text>
          <ThemedView style={styles.preferenceChips}>
            {([
              { label: '和風' as CuisineGenre, icon: 'rice', color: '#8BC34A' },
              { label: '洋風' as CuisineGenre, icon: 'silverware-fork-knife', color: '#FF9800' },
              { label: '中華' as CuisineGenre, icon: 'bowl-mix', color: '#F44336' },
              { label: 'エスニック' as CuisineGenre, icon: 'chili-hot', color: '#FF5722' },
              { label: '多国籍' as CuisineGenre, icon: 'earth', color: '#2196F3' },
            ]).map((genre) => (
              <Chip
                key={genre.label}
                icon={genre.icon}
                selected={selectedGenre === genre.label}
                showSelectedCheck={false}
                onPress={() => setSelectedGenre(selectedGenre === genre.label ? null : genre.label)}
                style={[
                  styles.preferenceChip,
                  selectedGenre === genre.label && { backgroundColor: genre.color }
                ]}
                textStyle={selectedGenre === genre.label ? styles.preferenceChipTextSelected : undefined}
                mode={selectedGenre === genre.label ? 'flat' : 'outlined'}
              >
                {genre.label}
              </Chip>
            ))}
          </ThemedView>
        </ThemedView>

        {/* テーマ選択 */}
        <ThemedView style={styles.preferenceSection}>
          <Text variant="titleSmall" style={styles.preferenceSectionTitle}>
            🎯 テーマを選択
          </Text>
          <ThemedView style={styles.preferenceChips}>
            {preferences.map((pref) => (
              <Chip
                key={pref}
                selected={selectedPreference === pref}
                showSelectedCheck={false}
                onPress={() => setSelectedPreference(selectedPreference === pref ? null : pref)}
                style={[
                  styles.preferenceChip,
                  selectedPreference === pref && styles.preferenceChipSelected
                ]}
                textStyle={selectedPreference === pref ? styles.preferenceChipTextSelected : undefined}
                mode={selectedPreference === pref ? 'flat' : 'outlined'}
              >
                {pref}
              </Chip>
            ))}
          </ThemedView>
        </ThemedView>

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

          {/* ローディング中の詳細表示 */}
          {isGenerating && (
            <Animated.View style={[styles.loadingDetailsCard, { opacity: fadeAnim }]}>
              <Card style={styles.progressCard}>
                <Card.Content>
                  <ThemedView style={styles.progressContent}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text variant="titleMedium" style={styles.progressTitle}>
                      {loadingMessage}
                    </Text>
                    <ProgressBar
                      progress={loadingProgress}
                      color="#4CAF50"
                      style={styles.progressBar}
                    />
                    <Button
                      mode="outlined"
                      onPress={cancelGeneration}
                      style={styles.cancelButton}
                      textColor="#FF5252"
                    >
                      キャンセル
                    </Button>
                  </ThemedView>
                </Card.Content>
              </Card>
            </Animated.View>
          )}

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
              <ThemedView style={styles.errorContent}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <Button
                  mode="contained"
                  onPress={generateMealPlan}
                  style={styles.retryButton}
                  disabled={isGenerating || selectedItems.length === 0}
                >
                  もう一度試す
                </Button>
              </ThemedView>
            </Card.Content>
          </Card>
        )}

        {/* 空状態の表示 */}
        {!mealSuggestions && !isGenerating && !error && (
          <ThemedView style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {selectedItems.length === 0 ? '🍎' : '🍳'}
            </Text>
            <Text style={styles.emptyTitle}>
              {selectedItems.length === 0
                ? '食材を選択してください'
                : '献立を生成しましょう'}
            </Text>
            <Text style={styles.emptyDescription}>
              {selectedItems.length === 0
                ? '上部のタブから食材を選んで\n献立を作成できます'
                : '「選択した食材で献立を作成」ボタンを\nタップしてください'}
            </Text>
          </ThemedView>
        )}

        {mealSuggestions && mealSuggestions.main_dish && mealSuggestions.side_dish && mealSuggestions.soup && (
          <ThemedView style={styles.mealsContainer}>
            <ThemedView style={styles.mealsHeaderRow}>
              <Text variant="headlineSmall" style={styles.mealsTitle}>
                📋 提案された献立
              </Text>
              <IconButton
                icon="trash-can"
                iconColor="#E53935"
                size={24}
                onPress={handleClearMealPlan}
                style={styles.deleteMealButton}
              />
            </ThemedView>

            {/* 主菜 */}
            <Card style={styles.mealCard}>
              <Card.Content>
                <ThemedView style={styles.mealHeader}>
                  <Text variant="titleMedium" style={styles.mealName}>
                    🍖 主菜: {mealSuggestions.main_dish.name}
                  </Text>
                  <ThemedView style={styles.mealHeaderActions}>
                    <Chip
                      mode="outlined"
                      style={styles.categoryChip}
                      compact={false}
                    >
                      主菜
                    </Chip>
                    <IconButton
                      icon="refresh"
                      size={20}
                      iconColor="#FF9800"
                      onPress={() => regenerateSingleDish('main_dish')}
                      disabled={isRegenerating !== null}
                      style={styles.regenerateButton}
                    />
                  </ThemedView>
                </ThemedView>

                {isRegenerating === 'main_dish' && (
                  <ThemedView style={styles.regeneratingIndicator}>
                    <ActivityIndicator size="small" color="#FF9800" />
                    <Text style={styles.regeneratingText}>再生成中...</Text>
                  </ThemedView>
                )}

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

                {/* レシピリンクボタン */}
                {mealSuggestions.main_dish.recipe_links && (
                  <ThemedView style={styles.recipeLinksContainer}>
                    <Text variant="bodySmall" style={styles.recipeLinksLabel}>
                      📱 レシピ:
                    </Text>
                    <ThemedView style={styles.recipeLinksRow}>
                      {mealSuggestions.main_dish.recipe_links.youtube && (
                        <Button
                          mode="contained"
                          style={styles.youtubeButton}
                          onPress={() => openRecipeLink(mealSuggestions.main_dish.recipe_links!.youtube!, 'youtube')}
                          icon="play"
                          compact
                        >
                          YouTube
                        </Button>
                      )}
                      {mealSuggestions.main_dish.recipe_links.website && (
                        <Button
                          mode="contained"
                          style={styles.websiteButton}
                          onPress={() => openRecipeLink(mealSuggestions.main_dish.recipe_links!.website!, 'website')}
                          icon="web"
                          compact
                        >
                          Google
                        </Button>
                      )}
                    </ThemedView>
                  </ThemedView>
                )}

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
                  <ThemedView style={styles.mealHeaderActions}>
                    <Chip
                      mode="outlined"
                      style={styles.categoryChip}
                      compact={false}
                    >
                      副菜
                    </Chip>
                    <IconButton
                      icon="refresh"
                      size={20}
                      iconColor="#FF9800"
                      onPress={() => regenerateSingleDish('side_dish')}
                      disabled={isRegenerating !== null}
                      style={styles.regenerateButton}
                    />
                  </ThemedView>
                </ThemedView>

                {isRegenerating === 'side_dish' && (
                  <ThemedView style={styles.regeneratingIndicator}>
                    <ActivityIndicator size="small" color="#FF9800" />
                    <Text style={styles.regeneratingText}>再生成中...</Text>
                  </ThemedView>
                )}

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

                {/* レシピリンクボタン */}
                {mealSuggestions.side_dish.recipe_links && (
                  <ThemedView style={styles.recipeLinksContainer}>
                    <Text variant="bodySmall" style={styles.recipeLinksLabel}>
                      📱 レシピ:
                    </Text>
                    <ThemedView style={styles.recipeLinksRow}>
                      {mealSuggestions.side_dish.recipe_links.youtube && (
                        <Button
                          mode="contained"
                          style={styles.youtubeButton}
                          onPress={() => openRecipeLink(mealSuggestions.side_dish.recipe_links!.youtube!, 'youtube')}
                          icon="play"
                          compact
                        >
                          YouTube
                        </Button>
                      )}
                      {mealSuggestions.side_dish.recipe_links.website && (
                        <Button
                          mode="contained"
                          style={styles.websiteButton}
                          onPress={() => openRecipeLink(mealSuggestions.side_dish.recipe_links!.website!, 'website')}
                          icon="web"
                          compact
                        >
                          Google
                        </Button>
                      )}
                    </ThemedView>
                  </ThemedView>
                )}

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
                  <ThemedView style={styles.mealHeaderActions}>
                    <Chip
                      mode="outlined"
                      style={styles.categoryChip}
                      compact={false}
                    >
                      汁物
                    </Chip>
                    <IconButton
                      icon="refresh"
                      size={20}
                      iconColor="#FF9800"
                      onPress={() => regenerateSingleDish('soup')}
                      disabled={isRegenerating !== null}
                      style={styles.regenerateButton}
                    />
                  </ThemedView>
                </ThemedView>

                {isRegenerating === 'soup' && (
                  <ThemedView style={styles.regeneratingIndicator}>
                    <ActivityIndicator size="small" color="#FF9800" />
                    <Text style={styles.regeneratingText}>再生成中...</Text>
                  </ThemedView>
                )}

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

                {/* レシピリンクボタン */}
                {mealSuggestions.soup.recipe_links && (
                  <ThemedView style={styles.recipeLinksContainer}>
                    <Text variant="bodySmall" style={styles.recipeLinksLabel}>
                      📱 レシピ:
                    </Text>
                    <ThemedView style={styles.recipeLinksRow}>
                      {mealSuggestions.soup.recipe_links.youtube && (
                        <Button
                          mode="contained"
                          style={styles.youtubeButton}
                          onPress={() => openRecipeLink(mealSuggestions.soup.recipe_links!.youtube!, 'youtube')}
                          icon="play"
                          compact
                        >
                          YouTube
                        </Button>
                      )}
                      {mealSuggestions.soup.recipe_links.website && (
                        <Button
                          mode="contained"
                          style={styles.websiteButton}
                          onPress={() => openRecipeLink(mealSuggestions.soup.recipe_links!.website!, 'website')}
                          icon="web"
                          compact
                        >
                          Google
                        </Button>
                      )}
                    </ThemedView>
                  </ThemedView>
                )}

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
                  🔥 合計カロリー: {mealSuggestions.total_calories}kcal
                </Text>
                <Text variant="bodyLarge" style={styles.totalTime}>
                  ⏱️ 合計調理時間: {calculateTotalCookingTime(mealSuggestions)}分
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
  preferenceSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  preferenceSectionTitle: {
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 12,
  },
  preferenceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF9800',
  },
  preferenceChipSelected: {
    backgroundColor: '#FF9800',
  },
  preferenceChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  errorContent: {
    gap: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  retryButton: {
    backgroundColor: '#F57C00',
    marginTop: 8,
  },
  mealsContainer: {
    marginTop: 16,
  },
  mealsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealsTitle: {
    fontWeight: 'bold',
    color: '#E65100',
    flex: 1,
  },
  deleteMealButton: {
    borderColor: '#E53935',
    borderWidth: 1.5,
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
  mealHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  regenerateButton: {
    margin: 0,
  },
  regeneratingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  regeneratingText: {
    color: '#FF9800',
    fontSize: 12,
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
  totalTime: {
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  cookingTips: {
    color: '#424242',
    lineHeight: 20,
  },
  recipeLinksContainer: {
    marginTop: 10,
    marginBottom: 8,
  },
  recipeLinksLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#424242',
  },
  recipeLinksRow: {
    flexDirection: 'row',
    gap: 8,
  },
  youtubeButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    flex: 1,
  },
  websiteButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flex: 1,
  },
  loadingDetailsCard: {
    marginTop: 16,
    marginBottom: 8,
  },
  progressCard: {
    backgroundColor: '#F5F5F5',
    elevation: 3,
  },
  progressContent: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  progressTitle: {
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  cancelButton: {
    borderColor: '#FF5252',
    borderWidth: 1,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});