import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function MealPlannerHeaderImage() {
  return (
    <View style={styles.container}>
      {/* 料理のエモジアイコンでヘッダーを装飾 */}
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.emoji}>🥗</Text>
        <Text style={styles.emoji}>🍛</Text>
      </View>

      <View style={styles.secondRow}>
        <Text style={styles.emoji}>🥘</Text>
        <Text style={styles.emoji}>🍳</Text>
      </View>

      <View style={styles.thirdRow}>
        <Text style={styles.emoji}>🥕</Text>
        <Text style={styles.emoji}>🍅</Text>
        <Text style={styles.emoji}>🧄</Text>
        <Text style={styles.emoji}>🌶️</Text>
      </View>

      {/* アプリタイトル */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>献立くん</Text>
        <Text style={styles.subtitle}>美味しい毎日をサポート</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 40,
  },
  emojiContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  secondRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thirdRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 32,
    marginHorizontal: 8,
    opacity: 0.8,
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
});
