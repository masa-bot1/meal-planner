import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function FishDetailScreen() {
  const fishTypes = [
    {
      id: 1,
      name: 'サーモン',
      description: '脂が乗って美味しい',
      icon: 'fish'
    },
    {
      id: 2,
      name: 'マグロ',
      description: '赤身で高タンパク',
      icon: 'fish'
    },
    {
      id: 3,
      name: 'タイ',
      description: '上品な白身魚',
      icon: 'fish'
    },
    {
      id: 4,
      name: 'アジ',
      description: '庶民的で美味しい',
      icon: 'fish'
    },
    {
      id: 5,
      name: 'サバ',
      description: 'DHA・EPAが豊富',
      icon: 'fish'
    },
    {
      id: 6,
      name: 'イワシ',
      description: '栄養価が高い青魚',
      icon: 'fish'
    },
    {
      id: 7,
      name: 'カレイ',
      description: '淡白で上品な味',
      icon: 'fish'
    },
    {
      id: 8,
      name: 'ブリ',
      description: '脂が乗った出世魚',
      icon: 'fish'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="魚類" subtitle="種類別詳細情報" />
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
            title="🐟 魚類"
            subtitle="新鮮で栄養豊富な海の幸"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              魚類は良質なタンパク質とオメガ3脂肪酸を豊富に含む健康食材です。季節により旬が異なります。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素（100gあたり）
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>タンパク質 18-25g</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>DHA・EPA</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンD</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>カルシウム</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {fishTypes.map((fish) => (
            <Card key={fish.id} style={styles.fishCard}>
              <List.Item
                title={fish.name}
                description={fish.description}
                left={(props) => <List.Icon {...props} icon={fish.icon} />}
                onPress={() => console.log(`${fish.name}の詳細を表示`)}
                style={styles.listItem}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい魚種類を追加')}
            >
              カスタム魚種を追加
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
    color: '#4FC3F7',
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
  fishCard: {
    marginBottom: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  fishCardContent: {
    paddingTop: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  priceLabel: {
    color: '#666',
    marginRight: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#4FC3F7',
  },
  seasonContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  seasonLabel: {
    color: '#666',
    marginRight: 8,
  },
  season: {
    fontWeight: 'bold',
    color: '#FF7043',
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
    gap: 8,
  },
  addButton: {
    backgroundColor: '#4FC3F7',
  },
  seasonButton: {
    borderColor: '#4FC3F7',
  },
});
