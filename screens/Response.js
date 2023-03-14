import React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const WebViewScreen = () => {
  const hideMenuScript = `
    (function() {
      const menuElement = document.querySelector('.menu');
      if (menuElement) {
        menuElement.style.display = 'none';
      }
    })();
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://provisori.com/responses?app=native' }}
        injectedJavaScript={hideMenuScript}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -135,
    marginBottom: -400,
  },
});

export default WebViewScreen;
