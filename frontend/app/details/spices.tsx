import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';
import { SelectedItemsDisplay } from '@/components/SelectedItemsDisplay';

export default function SpiceDetailScreen() {
  const { addItem, removeItem, isSelected } = useSelectedItems();

  const handleItemPress = (itemName: string) => {
    if (isSelected(itemName)) {
      removeItem(itemName);
    } else {
      addItem({ name: itemName, category: 'スパイス・香辛料' });
    }
  };
  const spices = [
    {
      id: 1,
      name: 'こしょう',
      description: '辛味と香りで料理にアクセント',
      icon: 'chili-hot'
    },
    {
      id: 2,
      name: 'にんにく',
      description: '強い香りと風味、疲労回復効果',
      icon: 'garlic'
    },
    {
      id: 3,
      name: 'しょうが',
      description: '辛味と香り、体を温める効果',
      icon: 'food-variant'
    },
    {
      id: 4,
      name: 'とうがらし',
      description: 'カプサイシンで新陳代謝促進',
      icon: 'chili-hot'
    },
    {
      id: 5,
      name: 'ターメリック',
      description: '黄色い色素とクルクミンが豊富',
      icon: 'shaker'
    },
    {
      id: 6,
      name: 'クミン',
      description: '独特の香りでカレーに欠かせない',
      icon: 'shaker'
    },
    {
      id: 7,
      name: 'パプリカ',
      description: '甘い香りと赤い色素',
      icon: 'shaker'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="香辛料" subtitle="種類別詳細情報" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.categoryCard}>
          <Card.Title
            title="🌶️ 香辛料"
            subtitle="香りと辛味で料理を引き立てる"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              香辛料は料理に独特の香りや辛味を加え、食欲を促進し健康効果も期待できます。
            </Text>

            <ThemedView style={styles.nutritionInfo}>
              <Text variant="titleSmall" style={styles.nutritionTitle}>
                主な効果
              </Text>
              <ThemedView style={styles.chipContainer}>
                <Chip mode="outlined" textStyle={styles.chipText}>抗酸化作用</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>新陳代謝促進</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>殺菌効果</Chip>
                <Chip mode="outlined" textStyle={styles.chipText}>食欲増進</Chip>
              </ThemedView>
            </ThemedView>
          </Card.Content>
        </Card>

        <SelectedItemsDisplay />

        <ThemedView style={styles.listContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            種類別詳細
          </Text>

          {spices.map((spice) => (
            <Card key={spice.id} style={styles.spiceCard}>
              <List.Item
                title={spice.name}
                description={spice.description}
                left={(props) => <List.Icon {...props} icon={spice.icon} />}
                onPress={() => handleItemPress(spice.name)}
                style={[
                  styles.listItem,
                  isSelected(spice.name) && styles.selectedItem
                ]}
              />
            </Card>
          ))}

          <ThemedView style={styles.actionContainer}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addButton}
              onPress={() => console.log('新しい香辛料を追加')}
            >
              カスタム香辛料を追加
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
    color: '#FF5722',
  },
  description: {
    textAlign: 'left',
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
  spiceCard: {
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
    backgroundColor: '#FF5722',
  },
  selectedItem: {
    backgroundColor: '#E8F5E8',
  },
});