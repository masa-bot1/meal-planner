import { StyleSheet } from 'react-native';
import { Appbar, Card, Text, Button, List } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function SeasoningCategoryScreen() {
  const seasoningItems = [
    { id: 1, name: '基本調味料', description: '塩・砂糖・醤油・味噌など', icon: 'bottle-tonic' },
    { id: 2, name: '香辛料', description: 'こしょう・にんにく・しょうがなど', icon: 'chili-hot' },
    { id: 3, name: '油類', description: 'サラダ油・オリーブ油・ごま油など', icon: 'bottle-wine' },
    { id: 4, name: '乾物', description: '昆布・かつお節・海苔など', icon: 'grain' },
    { id: 5, name: 'その他', description: '小麦粉・片栗粉・パン粉など', icon: 'package-variant' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="調味料・その他" subtitle="料理の味付けアイテム" />
        <Appbar.Action icon="plus" onPress={() => console.log('追加')} />
      </Appbar.Header>

      <Card style={styles.categoryCard}>
        <Card.Title
          title="🧂 調味料・その他カテゴリ"
          subtitle="料理を美味しくする重要な食材"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            調味料や香辛料、その他の料理に欠かせない食材を管理できます
          </Text>
        </Card.Content>
      </Card>

      <ThemedView style={styles.listContainer}>
        {seasoningItems.map((item) => (
          <List.Item
            key={item.id}
            title={item.name}
            description={item.description}
            left={(props) => <List.Icon {...props} icon={item.icon} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log(`${item.name}を選択`)}
            style={styles.listItem}
          />
        ))}
      </ThemedView>

      <ThemedView style={styles.actionContainer}>
        <Button
          mode="contained"
          icon="plus"
          style={styles.addButton}
          onPress={() => console.log('新しい調味料を追加')}
        >
          新しい食材を追加
        </Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#673AB7',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  actionContainer: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#673AB7',
  },
});
