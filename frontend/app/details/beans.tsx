import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function BeansDetailScreen() {
  const beans = [
    {
      id: 1,
      name: '大豆',
      description: '植物性タンパク質とイソフラボンが豊富',
      icon: 'grain'
    },
    {
      id: 2,
      name: 'いんげん',
      description: '食物繊維とビタミンKが豊富',
      icon: 'grain'
    },
    {
      id: 3,
      name: 'えだまめ',
      description: 'タンパク質と葉酸が豊富',
      icon: 'grain'
    },
    {
      id: 4,
      name: 'そら豆',
      description: 'ビタミンB1とタンパク質が豊富',
      icon: 'grain'
    },
    {
      id: 5,
      name: 'ひよこ豆',
      description: '食物繊維と鉄分が豊富',
      icon: 'grain'
    },
    {
      id: 6,
      name: 'レンズ豆',
      description: 'タンパク質と鉄分が豊富',
      icon: 'grain'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="豆類" subtitle="種類別詳細情報" />
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
            title="🫘 豆類"
            subtitle="植物性タンパク質の宝庫"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              豆類は良質な植物性タンパク質と食物繊維が豊富で、健康的な食生活に欠かせない食材です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>植物性タンパク質</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>食物繊維</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>鉄分</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>葉酸</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>イソフラボン</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {beans.map((bean) => (
            <Card key={bean.id} style={styles.beanCard}>
              <List.Item
                title={bean.name}
                description={bean.description}
                left={(props) => <List.Icon {...props} icon={bean.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log(`${bean.name}の詳細を表示`)}
                style={styles.listItem}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい豆類を追加')}
            >
              カスタム豆類を追加
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
    color: '#795548',
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
  beanCard: {
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
    backgroundColor: '#795548',
  },
});