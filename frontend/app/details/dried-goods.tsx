import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function DriedGoodsDetailScreen() {
  const driedGoods = [
    {
      id: 1,
      name: '昆布',
      description: 'グルタミン酸豊富でだしの基本',
      icon: 'grain'
    },
    {
      id: 2,
      name: 'かつお節',
      description: 'イノシン酸で旨味たっぷり',
      icon: 'fish'
    },
    {
      id: 3,
      name: '海苔',
      description: 'ビタミンB12と食物繊維が豊富',
      icon: 'leaf'
    },
    {
      id: 4,
      name: 'わかめ',
      description: 'ミネラルと食物繊維が豊富',
      icon: 'leaf'
    },
    {
      id: 5,
      name: '干ししいたけ',
      description: 'グアニル酸で深い旨味',
      icon: 'mushroom'
    },
    {
      id: 6,
      name: '切り干し大根',
      description: 'カルシウムと食物繊維が凝縮',
      icon: 'food-variant'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="乾物" subtitle="種類別詳細情報" />
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
            title="🍃 乾物"
            subtitle="保存性が高く栄養価の濃縮された食材"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              乾物は水分を除いて保存性を高め、栄養価が濃縮された伝統的な食材です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な特徴
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>旨味成分</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ミネラル</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>食物繊維</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>長期保存</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {driedGoods.map((item) => (
            <Card key={item.id} style={styles.driedGoodsCard}>
              <List.Item
                title={item.name}
                description={item.description}
                left={(props) => <List.Icon {...props} icon={item.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log(`${item.name}の詳細を表示`)}
                style={styles.listItem}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい乾物を追加')}
            >
              カスタム乾物を追加
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
    color: '#607D8B',
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
  driedGoodsCard: {
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
    backgroundColor: '#607D8B',
  },
});