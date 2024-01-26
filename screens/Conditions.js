import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

const WebViewScreen = () => {
  const webViewRef = useRef(null);
  const [getLang, setLang] = useState('fr');
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(false); // Track network errors

  const checkLang = async () => {
    try {
      let lang = await AsyncStorage.getItem('lang');
      let selectedStrings = lang === 'de' ? strings_de : strings_fr;
      setLang(lang);
      if (!selectedStrings) {
        await AsyncStorage.setItem('lang', 'fr');
        selectedStrings = strings_de;
      }
      setStrings(selectedStrings);
    } catch (error) {
      console.log(error); // Log the error for debugging purposes
    }
  };

  const hideMenuScript = `
    (function() {
      const menuElement = document.querySelector('.menu');
      if (menuElement) {
        menuElement.style.display = 'none';
      }
    })();
  `;

  const handleReload = () => {
    webViewRef.current?.reload();
  };

  const handleWebViewError = () => {
    setError(true); // Set error state when a network error occurs
  };

  useEffect(() => {
    // refresh screen when it is loaded
    const unsubscribe = navigation.addListener('focus', async () => {
      // Fetch data and update state here
      setRefresh(!refresh); // Toggle refresh state to force component to re-render
      setError(false); // Reset error state
    });

    checkLang();
  }, [refresh, navigation]);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>
          Erreur de réseau. Veuillez contrôler votre connection internet, fermer et réouvrir
        </Text>
      ) : (
        getLang === 'de' ? (
          <WebView
            source={{ uri: 'https://provisori.com/api/conditions_de' }}
            injectedJavaScript={hideMenuScript}
            ref={webViewRef}
            onError={handleWebViewError}
          />
        ) : (
          <WebView
            source={{ uri: 'https://provisori.com/api/conditions_fr' }}
            injectedJavaScript={hideMenuScript}
            ref={webViewRef}
            onError={handleWebViewError}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#46b1c81A',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WebViewScreen;
