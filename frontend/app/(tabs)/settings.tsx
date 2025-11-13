import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Platform, Linking } from 'react-native';
import { Card, List, Divider, Portal, Modal, Button } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as WebBrowser from 'expo-web-browser';

export default function SettingsScreen() {
  const [showAboutModal, setShowAboutModal] = useState(false);

  // GitHub PagesのドキュメントベースURL
  const DOCS_BASE_URL = 'https://masa-bot1.github.io/meal-planner';

  // Google FormsのURL
  const FEEDBACK_FORM_URL = 'https://forms.gle/zYsTqBhAHVsFKx9o9';

  // 利用規約を開く
  const openTermsOfService = async () => {
    const url = `${DOCS_BASE_URL}/terms.html`;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('利用規約を開けませんでした:', error);
      // フォールバック
      try {
        await Linking.openURL(url);
      } catch (fallbackError) {
        console.error('フォールバックも失敗:', fallbackError);
      }
    }
  };

  // プライバシーポリシーを開く
  const openPrivacyPolicy = async () => {
    const url = `${DOCS_BASE_URL}/privacy.html`;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('プライバシーポリシーを開けませんでした:', error);
      // フォールバック
      try {
        await Linking.openURL(url);
      } catch (fallbackError) {
        console.error('フォールバックも失敗:', fallbackError);
      }
    }
  };

  // ご意見・ご要望フォームを開く
  const openFeedbackForm = async () => {
    try {
      await WebBrowser.openBrowserAsync(FEEDBACK_FORM_URL);
    } catch (error) {
      console.error('フォームを開けませんでした:', error);
      // フォールバック
      try {
        await Linking.openURL(FEEDBACK_FORM_URL);
      } catch (fallbackError) {
        console.error('フォールバックも失敗:', fallbackError);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>設定</ThemedText>
          <ThemedText style={styles.headerSubtitle}>アプリの設定と情報</ThemedText>
        </ThemedView>

        {/* 法的情報 */}
        <Card style={styles.card}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>法的情報</ThemedText>
            <List.Item
              title="利用規約"
              description="サービス利用規約を確認"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={openTermsOfService}
            />
            <Divider />
            <List.Item
              title="プライバシーポリシー"
              description="個人情報の取り扱いについて"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={openPrivacyPolicy}
            />
          </Card.Content>
        </Card>

        {/* サポート */}
        <Card style={styles.card}>
          <Card.Content>
            <ThemedText type="subtitle" style={styles.sectionTitle}>サポート</ThemedText>
            <List.Item
              title="ご意見・ご要望"
              description="アプリに関するご意見やご要望"
              left={(props) => <List.Icon {...props} icon="message-text" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={openFeedbackForm}
            />
            <Divider />
            <List.Item
              title="アプリについて"
              description="バージョン情報とライセンス"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowAboutModal(true)}
            />
          </Card.Content>
        </Card>

        {/* フッター */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>© 2025 献立くん</ThemedText>
          <ThemedText style={styles.footerText}>Version 1.0.0</ThemedText>
        </View>
      </ScrollView>

      {/* アプリについてモーダル */}
      <Portal>
        <Modal
          visible={showAboutModal}
          onDismiss={() => setShowAboutModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                献立くんについて
              </ThemedText>
              <ThemedText style={styles.modalText}>
                バージョン: 1.0.0
              </ThemedText>
              <ThemedText style={styles.modalText}>
                リリース日: 2025年11月1日
              </ThemedText>
              <ThemedText style={styles.modalText}>
                {'\n'}
                このアプリは、選択した食材から最適な献立を提案するAI搭載の献立アプリです。
              </ThemedText>
              <ThemedText style={styles.modalText}>
                {'\n'}
                開発: Your Company Name
              </ThemedText>
              <Button
                mode="contained"
                onPress={() => setShowAboutModal(false)}
                style={styles.modalButton}
              >
                閉じる
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FF9800',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 4,
  },
  modalContainer: {
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  modalButton: {
    marginTop: 24,
    backgroundColor: '#FF9800',
  },
});
