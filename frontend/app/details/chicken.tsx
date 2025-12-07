import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function ChickenDetailScreen() {
  const { addItem, removeItem, isSelected } = useSelectedItems();

  const handleItemPress = (itemName: string) => {
    if (isSelected(itemName)) {
      removeItem(itemName);
    } else {
      addItem({ name: itemName, category: '肉類' });
    }
  };

  const chickenTypes = [
    {
      id: 1,
      name: 'むね肉',
      description: '高タンパク・低脂肪でヘルシー',
      icon: 'food-drumstick'
    },
    {
      id: 2,
      name: 'もも肉',
      description: 'ジューシーで旨味が豊富',
      icon: 'food-drumstick'
    },
    {
      id: 3,
      name: 'ささみ',
      description: '最も脂肪が少ない部位',
      icon: 'food-drumstick'
    },
    {
      id: 4,
      name: '手羽先',
      description: 'コラーゲン豊富で美容効果',
      icon: 'food-drumstick'
    },
    {
      id: 5,
      name: '手羽元',
      description: '骨付きでダシが良く出る',
      icon: 'food-drumstick'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="鶏肉" subtitle="部位別詳細情報" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.categoryCard}>
          <Card.Title
            title="🐔 鶏肉"
            subtitle="ヘルシーで万能なタンパク質源"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              鶏肉は部位によって脂肪含有量が大きく異なり、ダイエットから本格料理まで幅広く活用できます。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素（100gあたり）
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>タンパク質 20-25g</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンA</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>コラーゲン</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <SelectedItemsDisplay />

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            部位別詳細
          </Text>

          {chickenTypes.map((chicken) => (
          <Card key={chicken.id} style={styles.chickenCard}>
            <List.Item
              title={chicken.name}
              description={chicken.description}
              left={(props) => <List.Icon {...props} icon={chicken.icon} />}
              onPress={() => handleItemPress(chicken.name)}
              style={[
                styles.listItem,
                isSelected(chicken.name) && styles.selectedItem
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
    color: '#F57C00',
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
  chickenCard: {
    marginBottom: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  chickenCardContent: {
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
    color: '#F57C00',
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
  selectedItem: {
    backgroundColor: '#E8F5E8',
  },
});
