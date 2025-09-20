import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export default function LeafyVegetableDetailScreen() {
  const leafyVegetables = [
    {
      id: 1,
      name: 'キャベツ',
      description: 'ビタミンCとビタミンKが豊富',
      icon: 'leaf'
    },
    {
      id: 2,
      name: 'レタス',
      description: '水分豊富でサラダの定番',
      icon: 'leaf'
    },
    {
      id: 3,
      name: 'ほうれん草',
      description: '鉄分と葉酸が豊富な緑黄色野菜',
      icon: 'leaf'
    },
    {
      id: 4,
      name: '小松菜',
      description: 'カルシウムが豊富で栄養価が高い',
      icon: 'leaf'
    },
    {
      id: 5,
      name: '白菜',
      description: '水分が多く鍋料理に最適',
      icon: 'leaf'
    },
    {
      id: 6,
      name: 'ブロッコリー',
      description: 'ビタミンCとスルフォラファンが豊富',
      icon: 'tree'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="葉物野菜" subtitle="種類別詳細情報" />
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
            title="🥬 葉物野菜"
            subtitle="ビタミン・ミネラルが豊富な緑の野菜"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              葉物野菜は光合成により豊富なビタミンやミネラルを蓄えた栄養価の高い野菜です。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な栄養素
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンC</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>ビタミンK</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>葉酸</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>鉄分</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>カルシウム</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {leafyVegetables.map((vegetable) => (
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
              onPress={() => console.log('新しい葉物野菜を追加')}
            >
              カスタム葉物野菜を追加
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
    backgroundColor: '#4CAF50',
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
    color: '#4CAF50',
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
    backgroundColor: '#4CAF50',
  },
});