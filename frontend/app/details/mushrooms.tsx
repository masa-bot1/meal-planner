import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function MushroomDetailScreen() {
  const mushrooms = [
    {
      id: 1,
      name: 'しいたけ',
      description: 'エリタデニンが豊富でコレステロール低下',
      icon: 'mushroom'
    },
    {
      id: 2,
      name: 'えのき',
      description: 'GABA とビタミンB群が豊富',
      icon: 'mushroom'
    },
    {
      id: 3,
      name: 'しめじ',
      description: 'オルニチンが豊富で肝機能改善',
      icon: 'mushroom'
    },
    {
      id: 4,
      name: 'まいたけ',
      description: 'βグルカンが豊富で免疫力向上',
      icon: 'mushroom'
    },
    {
      id: 5,
      name: 'エリンギ',
      description: '食物繊維とカリウムが豊富',
      icon: 'mushroom'
    },
    {
      id: 6,
      name: 'なめこ',
      description: 'ムチンが豊富で胃粘膜保護',
      icon: 'mushroom'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="きのこ類" subtitle="種類別詳細情報" />
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
            title="🍄 きのこ類"
            subtitle="免疫力を高める機能性食品"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              きのこ類は低カロリーで食物繊維が豊富、免疫力を高める成分を多く含む健康食材です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素・成分
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>βグルカン</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>食物繊維</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンD</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>カリウム</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>GABA</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {mushrooms.map((mushroom) => (
            <Card key={mushroom.id} style={styles.mushroomCard}>
              <List.Item
                title={mushroom.name}
                description={mushroom.description}
                left={(props) => <List.Icon {...props} icon={mushroom.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log(`${mushroom.name}の詳細を表示`)}
                style={styles.listItem}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しいきのこを追加')}
            >
              カスタムきのこを追加
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
  header: {
    backgroundColor: '#8D6E63',
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
  mushroomCard: {
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
    backgroundColor: '#8D6E63',
  },
});