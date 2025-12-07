import { StyleSheet } from 'react-native';
import { Appbar, List } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function SeasoningCategoryScreen() {
  const seasoningItems = [
    { id: 1, name: '基本調味料', description: '塩・砂糖・醤油・味噌など', icon: 'bottle-tonic', route: 'basic-seasoning' },
    { id: 2, name: '香辛料', description: 'こしょう・にんにく・しょうがなど', icon: 'chili-hot', route: 'spices' },
    { id: 3, name: '油類', description: 'サラダ油・オリーブ油・ごま油など', icon: 'bottle-wine', route: 'oils' },
    { id: 4, name: '乾物', description: '昆布・かつお節・海苔など', icon: 'grain', route: 'dried-goods' },
    { id: 5, name: 'その他', description: '小麦粉・片栗粉・パン粉など', icon: 'package-variant', route: 'other-ingredients' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="調味料・その他" subtitle="料理の味付けアイテム" />
      </Appbar.Header>

      <SelectedItemsDisplay />

      <ThemedView style={styles.listContainer}>
        {seasoningItems.map((item) => (
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
  addButtonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#673AB7',
  },
});
