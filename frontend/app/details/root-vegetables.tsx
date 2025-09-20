import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function RootVegetableDetailScreen() {
  const rootVegetables = [
    {
      id: 1,
      name: 'にんじん',
      description: 'βカロテンが豊富でビタミンA源',
      icon: 'carrot'
    },
    {
      id: 2,
      name: 'だいこん',
      description: '消化酵素が豊富で胃腸に優しい',
      icon: 'food-variant'
    },
    {
      id: 3,
      name: 'じゃがいも',
      description: 'ビタミンCと食物繊維が豊富',
      icon: 'potato'
    },
    {
      id: 4,
      name: 'たまねぎ',
      description: '血液サラサラ効果があるケルセチン含有',
      icon: 'circle-outline'
    },
    {
      id: 5,
      name: 'ごぼう',
      description: '食物繊維が特に豊富でデトックス効果',
      icon: 'food-variant'
    },
    {
      id: 6,
      name: 'れんこん',
      description: 'ビタミンCとタンニンが豊富',
      icon: 'food-variant'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="根菜類" subtitle="種類別詳細情報" />
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
            title="🥕 根菜類"
            subtitle="地下で育つ栄養豊富な野菜"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              根菜類は地下で育つため、土の栄養をたっぷり吸収した栄養価の高い野菜です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>βカロテン</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンC</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>食物繊維</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>カリウム</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {rootVegetables.map((vegetable) => (
            <Card key={vegetable.id} style={styles.vegetableCard}>
              <List.Item
                title={vegetable.name}
                description={vegetable.description}
                left={(props) => <List.Icon {...props} icon={vegetable.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log(`${vegetable.name}の詳細を表示`)}
                style={styles.listItem}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい根菜を追加')}
            >
              カスタム根菜を追加
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
    backgroundColor: '#FF7043',
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
    color: '#FF7043',
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
  vegetableCard: {
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
    backgroundColor: '#FF7043',
  },
});