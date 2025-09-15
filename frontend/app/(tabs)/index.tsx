import { StyleSheet } from 'react-native';
import {
  Button,
  Card,
  Text,
  FAB,
  Chip,
  Switch,
  TextInput,
  Appbar
} from 'react-native-paper';
import { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import MealPlannerHeaderImage from '@/components/MealPlannerHeaderImage';

export default function HomeScreen() {
  const [switchValue, setSwitchValue] = useState(false);
  const [textInput, setTextInput] = useState('');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E8F5E8', dark: '#1B5E20' }}
      headerImage={<MealPlannerHeaderImage />}>

      {/* Card Example */}
      <Card style={styles.card}>
        <Card.Title title="Card タイトル" subtitle="Card サブタイトル" />
        <Card.Content>
          <Text variant="bodyMedium">
            これはReact Native Paperのカードコンポーネントです。Material Design 3に基づいたデザインです。
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => console.log('キャンセル')}>キャンセル</Button>
          <Button onPress={() => console.log('OK')}>OK</Button>
        </Card.Actions>
      </Card>

      {/* Text Input Example */}
      <TextInput
        label="テキスト入力"
        value={textInput}
        onChangeText={setTextInput}
        mode="outlined"
        style={styles.textInput}
      />

      {/* Switch Example */}
      <ThemedView style={styles.switchContainer}>
        <Text variant="bodyMedium">通知を有効にする</Text>
        <Switch value={switchValue} onValueChange={setSwitchValue} />
      </ThemedView>

      {/* Chips Example */}
      <ThemedView style={styles.chipContainer}>
        <Chip icon="star" onPress={() => console.log('お気に入り')}>
          お気に入り
        </Chip>
        <Chip mode="outlined" onPress={() => console.log('フィルター')}>
          フィルター
        </Chip>
      </ThemedView>

      {/* Buttons Example */}
      <ThemedView style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => console.log('Contained button')}>
          Contained Button
        </Button>
        <Button mode="outlined" onPress={() => console.log('Outlined button')}>
          Outlined Button
        </Button>
        <Button mode="text" onPress={() => console.log('Text button')}>
          Text Button
        </Button>
      </ThemedView>

      {/* FAB (Floating Action Button) */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('FAB pressed')}
      />
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
