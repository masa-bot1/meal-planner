import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function FruitVegetableDetailScreen() {
  const { addItem, removeItem, isSelected } = useSelectedItems();

  const handleItemPress = (itemName: string) => {
    if (isSelected(itemName)) {
      removeItem(itemName);
    } else {
      addItem({ name: itemName, category: '野菜類' });
    }
  };
  const fruitVegetables = [
    {
      id: 1,
      name: 'トマト',
      description: 'リコピンが豊富で抗酸化作用が高い',
      icon: 'fruit-cherries'
    },
    {
      id: 2,
      name: 'きゅうり',
      description: '水分豊富でカリウムを含む',
      icon: 'food-variant'
    },
    {
      id: 3,
      name: 'なす',
      description: 'ナスニンが豊富で紫色の抗酸化物質',
      icon: 'eggplant'
    },
    {
      id: 4,
      name: 'ピーマン',
      description: 'ビタミンCが豊富で免疫力向上',
      icon: 'bell-outline'
    },
    {
      id: 5,
      name: 'パプリカ',
      description: 'カラフルでビタミンA・Cが豊富',
      icon: 'bell'
    },
    {
      id: 6,
      name: 'かぼちゃ',
      description: 'βカロテンとビタミンEが豊富',
      icon: 'pumpkin'
    },
    {
      id: 7,
      name: 'オクラ',
      description: 'ネバネバ成分で腸内環境改善',
      icon: 'food-variant'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="果菜類" subtitle="種類別詳細情報" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.categoryCard}>
          <Card.Title
            title="🍅 果菜類"
            subtitle="実を食べる栄養豊富な野菜"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              果菜類は植物の実の部分を食べる野菜で、ビタミンや抗酸化物質が豊富です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>リコピン</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>βカロテン</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンC</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>カリウム</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <SelectedItemsDisplay />

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {fruitVegetables.map((vegetable) => (
            <Card key={vegetable.id} style={styles.vegetableCard}>
              <List.Item
                title={vegetable.name}
                description={vegetable.description}
                left={(props) => <List.Icon {...props} icon={vegetable.icon} />}
                onPress={() => handleItemPress(vegetable.name)}
                style={[
                  styles.listItem,
                  isSelected(vegetable.name) && styles.selectedItem
                ]}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい果菜を追加')}
            >
              カスタム果菜を追加
            </Button>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoryCard: {
    margin: 16,
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
    color: '#E91E63',
  },
  description: {
    textAlign: 'left',
    color: '#666',
    marginBottom: 16,
  },
  nutritionInfo: {
    marginTop: 8,
  },
  nutritionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipText: {
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  vegetableCard: {
    marginBottom: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  actionContainer: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#E91E63',
  },
  selectedItem: {
    backgroundColor: '#E8F5E8',
  },
});