import { StyleSheet } from 'react-native';
import { Appbar, Card, Text, Button, List } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function MeatCategoryScreen() {
  const meatItems = [
    { id: 1, name: '牛肉', description: '赤身・バラ・肩ロースなど', icon: 'cow' },
    { id: 2, name: '豚肉', description: 'ロース・バラ・モモなど', icon: 'pig' },
    { id: 3, name: '鶏肉', description: 'むね肉・もも肉・ささみなど', icon: 'bird' },
    { id: 4, name: 'ひき肉', description: '牛・豚・鶏のひき肉', icon: 'food-steak' },
    { id: 5, name: '魚類', description: 'サーモン・マグロ・サバなど', icon: 'fish' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="肉類" subtitle="お肉・魚類の管理" />
        <Appbar.Action icon="plus" onPress={() => console.log('追加')} />
      </Appbar.Header>

      <Card style={styles.categoryCard}>
        <Card.Title
          title="🥩 肉類カテゴリ"
          subtitle="タンパク質豊富な食材を管理"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            お肉や魚類などのタンパク質食材を効率的に管理できます
          </Text>
        </Card.Content>
      </Card>

      <ThemedView style={styles.listContainer}>
        {meatItems.map((item) => (
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
          onPress={() => console.log('新しい肉類を追加')}
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
  actionContainer: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#FF5722',
  },
});
