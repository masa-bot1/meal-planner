import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedView } from '@/components/ThemedView';

interface LegalDocumentViewerProps {
  type: 'terms' | 'privacy';
  url?: string;
}

export function LegalDocumentViewer({ type, url }: LegalDocumentViewerProps) {
  // 本番環境では実際のURL、開発環境ではローカルHTMLファイルのパス
  const getDocumentUrl = () => {
    if (url) return url;

    // 開発環境用のデフォルトURL（実際のドメインに置き換える）
    const baseUrl = __DEV__
      ? 'http://localhost:8081'  // Metro bundlerのデフォルトポート
      : 'https://your-domain.com';

    const path = type === 'terms' ? '/terms.html' : '/privacy.html';
    return `${baseUrl}${path}`;
  };

  return (
    <ThemedView style={styles.container}>
      {Platform.OS === 'web' ? (
        // Web環境では直接HTMLファイルを開く
        <iframe
          src={getDocumentUrl()}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        // ネイティブ環境ではWebViewを使用
        <WebView
          source={{ uri: getDocumentUrl() }}
          style={styles.webview}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
