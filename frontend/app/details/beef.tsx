import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function BeefDetailScreen() {
  const { addItem, removeItem, isSelected } = useSelectedItems();

  const handleItemPress = (itemName: string) => {
    if (isSelected(itemName)) {
      removeItem(itemName);
    } else {
      addItem({ name: itemName, category: '牛肉' });
    }
  };

  const beefTypes = [
    {
      id: 1,
      name: '赤身',
      description: '脂肪が少なく、タンパク質豊富',
      icon: 'food-steak'
    },
    {
      id: 2,
      name: 'バラ',
      description: '脂身と赤身のバランスが良い',
      icon: 'food-steak'
    },
    {
      id: 3,
      name: '肩ロース',
      description: '程よい脂身でジューシー',
      icon: 'food-steak'
    },
    {
      id: 4,
      name: 'サーロイン',
      description: '最高級部位、柔らかく美味',
      icon: 'food-steak'
    },
    {
      id: 5,
      name: 'ヒレ',
      description: '最も柔らかい部位',
      icon: 'food-steak'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="牛肉" subtitle="部位別詳細情報" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.categoryCard}>
          <Card.Title
            title="🐄 牛肉"
            subtitle="高品質なタンパク質源"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              牛肉は部位によって味わいや食感が大きく異なります。料理に合わせて最適な部位を選びましょう。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素（100gあたり）
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>タンパク質 20-25g</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>鉄分 2-4mg</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンB12</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <SelectedItemsDisplay />

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            部位別詳細
          </Text>

          {beefTypes.map((beef) => (
            <Card key={beef.id} style={styles.beefCard}>
              <List.Item
                title={beef.name}
                description={beef.description}
                left={(props) => <List.Icon {...props} icon={beef.icon} />}
                onPress={() => handleItemPress(beef.name)}
                style={[
                  styles.listItem,
                  isSelected(beef.name) && styles.selectedItem
                ]}
              />
            </Card>
          ))}
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
    color: '#FF5722',
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
  beefCard: {
    marginBottom: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  beefCardContent: {
    paddingTop: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  priceLabel: {
    color: '#666',
    marginRight: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  cookingMethodsContainer: {
    marginTop: 4,
  },
  cookingLabel: {
    color: '#666',
    marginBottom: 4,
  },
  methodChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  methodChip: {
    height: 28,
  },
  methodChipText: {
    fontSize: 10,
  },
  selectedCard: {
    margin: 16,
    marginTop: 0,
    elevation: 3,
    backgroundColor: '#E8F5E8',
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: '#E8F5E8',
  },
});
