import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';

export function SelectedItemsDisplay() {
  const { selectedItems, removeItem } = useSelectedItems();

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <Card style={styles.selectedCard}>
      <Card.Title
        title="🛒 選択中の食材"
        titleStyle={styles.selectedTitle}
      />
      <Card.Content>
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
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});