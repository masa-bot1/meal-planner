import { StyleSheet } from 'react-native';
import { Appbar, List } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function MeatCategoryScreen() {
  const meatItems = [
    { id: 1, name: '牛肉', description: '赤身・バラ・肩ロースなど', icon: 'cow', route: 'beef' },
    { id: 2, name: '豚肉', description: 'ロース・バラ・モモなど', icon: 'pig', route: 'pork' },
    { id: 3, name: '鶏肉', description: 'むね肉・もも肉・ささみなど', icon: 'bird', route: 'chicken' },
    { id: 4, name: 'ひき肉', description: '牛・豚・鶏のひき肉', icon: 'food-steak', route: 'ground-meat' },
    { id: 5, name: '魚類', description: 'サーモン・マグロ・サバなど', icon: 'fish', route: 'fish' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="肉類" subtitle="お肉・魚類の管理" />
      </Appbar.Header>

      <SelectedItemsDisplay />

      <ThemedView style={styles.listContainer}>
        {meatItems.slice(0, 5).map((item) => (
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
    color: '#FF5722',
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
    backgroundColor: '#FF5722',
  },
});
