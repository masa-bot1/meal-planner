import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems } from '@/contexts/SelectedItemsContext';

export function SelectedItemsDisplay() {
  const { selectedItems, removeItem, clearAll } = useSelectedItems();

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <Card style={styles.selectedCard}>
      <Card.Title
        title="🛒 選択中の食材"
        titleStyle={styles.selectedTitle}
        right={(props) => (
          <IconButton
            icon="delete-sweep"
            iconColor="#D32F2F"
            size={24}
            onPress={clearAll}
          />
        )}
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