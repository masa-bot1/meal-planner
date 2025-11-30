import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function OtherIngredientsDetailScreen() {
  const { addItem, removeItem, isSelected } = useSelectedItems();

  const handleItemPress = (itemName: string) => {
    if (isSelected(itemName)) {
      removeItem(itemName);
    } else {
      addItem({ name: itemName, category: 'その他食材' });
    }
  };
  const otherIngredients = [
    {
      id: 1,
      name: '小麦粉',
      description: 'パンやお菓子作りに欠かせない',
      icon: 'sack'
    },
    {
      id: 2,
      name: '片栗粉',
      description: 'とろみ付けや揚げ物の衣に',
      icon: 'sack'
    },
    {
      id: 3,
      name: 'パン粉',
      description: 'フライや揚げ物の衣に',
      icon: 'package-variant'
    },
    {
      id: 4,
      name: 'ベーキングパウダー',
      description: 'お菓子作りの膨張剤',
      icon: 'package-variant'
    },
    {
      id: 5,
      name: '重曹',
      description: '天然の膨張剤・洗浄剤',
      icon: 'package-variant'
    },
    {
      id: 6,
      name: 'コンソメ',
      description: '洋風だしの素',
      icon: 'cube-outline'
    },
    {
      id: 7,
      name: 'だしの素',
      description: '和風だしの素',
      icon: 'cube-outline'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="その他食材" subtitle="種類別詳細情報" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.categoryCard}>
          <Card.Title
            title="📦 その他"
            subtitle="料理に必要なその他の食材"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              粉類やだしの素など、料理を美味しく作るために欠かせない食材です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な用途
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>製菓・製パン</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>とろみ付け</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>だし</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>膨張剤</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <SelectedItemsDisplay />

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {otherIngredients.map((item) => (
            <Card key={item.id} style={styles.otherCard}>
              <List.Item
                title={item.name}
                description={item.description}
                left={(props) => <List.Icon {...props} icon={item.icon} />}
                onPress={() => handleItemPress(item.name)}
                style={[
                  styles.listItem,
                  isSelected(item.name) && styles.selectedItem
                ]}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい食材を追加')}
            >
              カスタム食材を追加
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
    color: '#9E9E9E',
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
  otherCard: {
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
    backgroundColor: '#9E9E9E',
  },
  selectedItem: {
    backgroundColor: '#E8F5E8',
  },
});