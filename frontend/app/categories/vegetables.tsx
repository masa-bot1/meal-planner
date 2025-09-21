import { StyleSheet } from 'react-native';
import { Appbar, Card, Text, Button, List } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function VegetableCategoryScreen() {
  const vegetableItems = [
    { id: 1, name: '根菜類', description: 'にんじん・だいこん・じゃがいもなど', icon: 'carrot', route: 'root-vegetables' },
    { id: 2, name: '葉物野菜', description: 'キャベツ・レタス・ほうれん草など', icon: 'leaf', route: 'leafy-vegetables' },
    { id: 3, name: '果菜類', description: 'トマト・きゅうり・なすなど', icon: 'fruit-cherries', route: 'fruit-vegetables' },
    { id: 4, name: 'きのこ類', description: 'しいたけ・えのき・しめじなど', icon: 'mushroom', route: 'mushrooms' },
    { id: 5, name: '豆類', description: '大豆・いんげん・えだまめなど', icon: 'grain', route: 'beans' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="野菜類" subtitle="新鮮な野菜の管理" />
        <Appbar.Action icon="plus" onPress={() => console.log('追加')} />
      </Appbar.Header>

      <SelectedItemsDisplay />

      <ThemedView style={styles.listContainer}>
        {vegetableItems.map((item) => (
          <List.Item
            key={item.id}
            title={item.name}
            description={item.description}
            left={(props) => <List.Icon {...props} icon={item.icon} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              console.log(`${item.name}の詳細画面に遷移`);
              router.push(`/details/${item.route}` as any);
            }}
            style={styles.listItem}
          />
        ))}

        <ThemedView style={styles.addButtonContainer}>
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
  addButtonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
});
