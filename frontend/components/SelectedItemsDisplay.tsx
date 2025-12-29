import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Chip, IconButton, Text } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';

export function SelectedItemsDisplay() {
  const { selectedItems, removeItem, clearAll, selectedGenre, setSelectedGenre } = useSelectedItems();

  if (selectedItems.length === 0 && !selectedGenre) {
    return null;
  }

  return (
    <Card style={styles.selectedCard}>
      <Card.Title
        title="🛒 選択中の項目"
        titleStyle={styles.selectedTitle}
        right={(props) => (
          <IconButton
            icon="delete-sweep"
            iconColor="#D32F2F"
            size={24}
            onPress={() => {
              clearAll();
              setSelectedGenre(null);
            }}
          />
        )}
      />
      <Card.Content>
        {selectedGenre && (
          <ThemedView style={styles.genreSection}>
            <Text style={styles.sectionLabel}>料理ジャンル</Text>
            <Chip
              mode="flat"
              style={styles.genreChip}
              textStyle={styles.genreChipText}
              onClose={() => setSelectedGenre(null)}
              icon="food"
            >
              {selectedGenre}
            </Chip>
          </ThemedView>
        )}

        {selectedItems.length > 0 && (
          <ThemedView style={styles.itemsSection}>
            {selectedGenre && <Text style={styles.sectionLabel}>食材</Text>}
            <ThemedView style={styles.selectedContainer}>
              {selectedItems.map((item, index) => (
                <Chip
                  key={index}
                  mode="flat"
                  style={styles.selectedChip}
                  textStyle={styles.selectedChipText}
                  onClose={() => removeItem(item.name)}
                >
                  {item.name} ({item.category})
                </Chip>
              ))}
            </ThemedView>
          </ThemedView>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  selectedCard: {
    margin: 16,
    marginTop: 0,
    elevation: 3,
    backgroundColor: '#E8F5E8',
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  genreSection: {
    marginBottom: 12,
  },
  itemsSection: {
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: '#FF9800',
    alignSelf: 'flex-start',
  },
  genreChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});