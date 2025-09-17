import { StyleSheet } from 'react-native';
import { Appbar, Card, Text, Button, List } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function VegetableCategoryScreen() {
  const vegetableItems = [
    { id: 1, name: '根菜類', description: 'にんじん・だいこん・じゃがいもなど', icon: 'carrot' },
    { id: 2, name: '葉物野菜', description: 'キャベツ・レタス・ほうれん草など', icon: 'leaf' },
    { id: 3, name: '果菜類', description: 'トマト・きゅうり・なすなど', icon: 'fruit-cherries' },
    { id: 4, name: 'きのこ類', description: 'しいたけ・えのき・しめじなど', icon: 'mushroom' },
    { id: 5, name: '豆類', description: '大豆・いんげん・えだまめなど', icon: 'grain' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="野菜類" subtitle="新鮮な野菜の管理" />
        <Appbar.Action icon="plus" onPress={() => console.log('追加')} />
      </Appbar.Header>

      <Card style={styles.categoryCard}>
        <Card.Title
          title="🥕 野菜類カテゴリ"
          subtitle="ビタミン・ミネラル豊富な食材を管理"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            新鮮な野菜や果物などの栄養豊富な食材を効率的に管理できます
          </Text>
        </Card.Content>
      </Card>

      <ThemedView style={styles.listContainer}>
        {vegetableItems.map((item) => (
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
          onPress={() => console.log('新しい野菜を追加')}
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
    color: '#4CAF50',
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
    backgroundColor: '#4CAF50',
  },
});
