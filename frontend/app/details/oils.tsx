import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function OilsDetailScreen() {
  const oils = [
    {
      id: 1,
      name: 'サラダ油',
      description: 'クセがなく汎用性が高い植物油',
      icon: 'bottle-wine'
    },
    {
      id: 2,
      name: 'オリーブ油',
      description: 'オレイン酸豊富で健康的',
      icon: 'bottle-wine'
    },
    {
      id: 3,
      name: 'ごま油',
      description: '香ばしい香りで風味付けに最適',
      icon: 'bottle-wine'
    },
    {
      id: 4,
      name: 'ココナッツオイル',
      description: '中鎖脂肪酸で体に優しい',
      icon: 'bottle-wine'
    },
    {
      id: 5,
      name: 'バター',
      description: '乳脂肪の豊かな風味',
      icon: 'cube'
    },
    {
      id: 6,
      name: 'マーガリン',
      description: '植物性で扱いやすい',
      icon: 'cube'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="油類" subtitle="種類別詳細情報" />
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
            title="🫒 油類"
            subtitle="料理に必要な油脂類"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              油類は調理に欠かせない食材で、種類によって風味や栄養価が異なります。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な成分・効果
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>必須脂肪酸</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンE</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>風味付け</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>エネルギー源</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {oils.map((oil) => (
            <Card key={oil.id} style={styles.oilCard}>
              <List.Item
                title={oil.name}
                description={oil.description}
                left={(props) => <List.Icon {...props} icon={oil.icon} />}
                onPress={() => console.log(`${oil.name}の詳細を表示`)}
                style={styles.listItem}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい油類を追加')}
            >
              カスタム油類を追加
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
    color: '#FFC107',
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
  oilCard: {
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
    backgroundColor: '#FFC107',
  },
});