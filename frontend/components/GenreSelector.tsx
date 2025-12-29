import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSelectedItems, CuisineGenre } from '@/contexts/SelectedItemsContext';

export function GenreSelector() {
  const { selectedGenre, setSelectedGenre } = useSelectedItems();

  const genres: { label: CuisineGenre; icon: string; color: string }[] = [
    { label: '和風', icon: 'rice', color: '#8BC34A' },
    { label: '洋風', icon: 'silverware-fork-knife', color: '#FF9800' },
    { label: '中華', icon: 'bowl-mix', color: '#F44336' },
    { label: 'エスニック', icon: 'chili-hot', color: '#FF5722' },
    { label: '多国籍', icon: 'earth', color: '#2196F3' },
  ];

  const handleGenrePress = (genre: CuisineGenre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title="料理ジャンル"
        subtitle="お好みのジャンルを選択してください"
        titleStyle={styles.cardTitle}
      />
      <Card.Content>
        <ThemedView style={styles.genresContainer}>
          {genres.map((genre) => (
            <Chip
              key={genre.label}
              icon={genre.icon}
              selected={selectedGenre === genre.label}
              onPress={() => handleGenrePress(genre.label)}
              mode={selectedGenre === genre.label ? 'flat' : 'outlined'}
              style={[
                styles.genreChip,
                selectedGenre === genre.label && { backgroundColor: genre.color }
              ]}
              textStyle={[
                styles.genreChipText,
                selectedGenre === genre.label && styles.selectedGenreChipText
              ]}
            >
              {genre.label}
            </Chip>
          ))}
        </ThemedView>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 24,
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
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  genreChip: {
    marginBottom: 8,
  },
  genreChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedGenreChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
