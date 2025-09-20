import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function GroundMeatDetailScreen() {
  const groundMeatTypes = [
    {
      id: 1,
      name: '牛ひき肉',
      description: '濃厚な味わいで旨味豊富',
      icon: 'food-steak'
    },
    {
      id: 2,
      name: '豚ひき肉',
      description: 'ジューシーで使いやすい',
      icon: 'food-steak'
    },
    {
      id: 3,
      name: '鶏ひき肉',
      description: 'あっさりヘルシー',
      icon: 'food-drumstick'
    },
    {
      id: 4,
      name: '合挽き肉',
      description: '牛豚のバランスが良い',
      icon: 'food-steak'
    },
    {
      id: 5,
      name: '豚鶏合挽き',
      description: 'ヘルシーで経済的',
      icon: 'food-steak'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="ひき肉" subtitle="種類別詳細情報" />
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
            title="🥩 ひき肉"
            subtitle="料理の幅が広がる万能食材"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              ひき肉は様々な料理に使える便利な食材です。種類によって味わいや食感が異なります。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素（100gあたり）
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>タンパク質 15-22g</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>鉄分</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンB群</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {groundMeatTypes.map((meat) => (
            <Card key={meat.id} style={styles.meatCard}>
              <List.Item
                title={meat.name}
                description={meat.description}
                left={(props) => <List.Icon {...props} icon={meat.icon} />}
                onPress={() => console.log(`${meat.name}の詳細を表示`)}
                style={styles.listItem}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しいひき肉種類を追加')}
            >
              カスタム種類を追加
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
    color: '#8D6E63',
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
  meatCard: {
    marginBottom: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  meatCardContent: {
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
    color: '#8D6E63',
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
    backgroundColor: '#8D6E63',
  },
});
