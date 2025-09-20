import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function PorkDetailScreen() {
  const porkTypes = [
    {
      id: 1,
      name: 'ロース',
      description: 'きめ細かく柔らかい',
      icon: 'food-steak'
    },
    {
      id: 2,
      name: 'バラ',
      description: '脂身が多くジューシー',
      icon: 'food-steak'
    },
    {
      id: 3,
      name: 'モモ',
      description: '脂肪が少なくヘルシー',
      icon: 'food-steak'
    },
    {
      id: 4,
      name: '肩',
      description: '程よい脂身で旨味豊富',
      icon: 'food-steak'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="豚肉" subtitle="部位別詳細情報" />
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
            title="🐷 豚肉"
            subtitle="バランスの良いタンパク質源"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              豚肉は部位によって脂身の量や食感が異なり、様々な料理に活用できる万能食材です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素（100gあたり）
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>タンパク質 18-22g</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンB1</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ナイアシン</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            部位別詳細
          </Text>

          {porkTypes.map((pork) => (
          <Card key={pork.id} style={styles.porkCard}>
            <List.Item
              title={pork.name}
              description={pork.description}
              left={(props) => <List.Icon {...props} icon={pork.icon} />}
              onPress={() => console.log(`${pork.name}の詳細を表示`)}
              style={styles.listItem}
            />
          </Card>
        ))}

        <ThemedView style={styles.actionContainer}>
          <Button
            mode="contained"
            icon="plus"
            style={styles.addButton}
            onPress={() => console.log('新しい豚肉部位を追加')}
          >
            カスタム部位を追加
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
  porkCard: {
    marginBottom: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  porkCardContent: {
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
    color: '#E91E63',
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
  actionContainer: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#E91E63',
  },
});
