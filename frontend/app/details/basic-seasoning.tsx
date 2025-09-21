import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function BasicSeasoningDetailScreen() {
  const { addItem, removeItem, isSelected } = useSelectedItems();

  const handleItemPress = (itemName: string) => {
    if (isSelected(itemName)) {
      removeItem(itemName);
    } else {
      addItem({ name: itemName, category: '調味料' });
    }
  };
  const basicSeasonings = [
    {
      id: 1,
      name: '塩',
      description: '料理の基本、ミネラル豊富',
      icon: 'shaker-outline'
    },
    {
      id: 2,
      name: '砂糖',
      description: '甘味付けとエネルギー源',
      icon: 'cube-outline'
    },
    {
      id: 3,
      name: '醤油',
      description: '日本料理に欠かせない発酵調味料',
      icon: 'bottle-tonic'
    },
    {
      id: 4,
      name: '味噌',
      description: '大豆発酵で栄養価が高い',
      icon: 'bowl-mix'
    },
    {
      id: 5,
      name: '酢',
      description: '酸味と防腐効果があり健康的',
      icon: 'bottle-wine'
    },
    {
      id: 6,
      name: 'みりん',
      description: '甘味とコクを与える日本の調味料',
      icon: 'bottle-wine'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="基本調味料" subtitle="種類別詳細情報" />
        <Appbar.Action icon="heart-outline" onPress={() => console.log('お気に入り')} />
        <Appbar.Action icon="shopping" onPress={() => console.log('買い物リストに追加')} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.categoryCard}>
          <Card.Title
            title="🧂 基本調味料"
            subtitle="料理の基礎となる調味料"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              基本調味料は「さしすせそ」とも呼ばれ、日本料理の基本となる重要な調味料です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な特徴
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>塩分調整</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>発酵食品</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>保存性</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>旨味成分</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <SelectedItemsDisplay />

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {basicSeasonings.map((seasoning) => (
            <Card key={seasoning.id} style={styles.seasoningCard}>
              <List.Item
                title={seasoning.name}
                description={seasoning.description}
                left={(props) => <List.Icon {...props} icon={seasoning.icon} />}
                onPress={() => handleItemPress(seasoning.name)}
                style={[
                  styles.listItem,
                  isSelected(seasoning.name) && styles.selectedItem
                ]}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい基本調味料を追加')}
            >
              カスタム調味料を追加
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
    color: '#673AB7',
  },
  description: {
    textAlign: 'center',
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
  seasoningCard: {
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
    backgroundColor: '#673AB7',
  },
  selectedItem: {
    backgroundColor: '#E8F5E8',
  },
});