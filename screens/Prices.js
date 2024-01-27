import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

const PricesScreen = () => {
  const [prices, setPrices] = useState([]);
  const [strings, setStrings] = useState(false);
  const [getLang, setLang] = useState('fr');

  const checkLang = async () => {
    try {
      let lang = await AsyncStorage.getItem('lang');
      let selectedStrings = lang === 'de' ? strings_de : strings_fr;
      if (lang != null) {
        setLang(lang);
      } else {
        setLang('fr');
      }
      if (!selectedStrings) {
        await AsyncStorage.setItem('lang', 'fr');
        selectedStrings = strings_de;
      }
      setStrings(selectedStrings);
    } catch (error) {
      console.log(error); // Log the error for debugging purposes
    }
  };

  const fetchData = () => {
    fetch('https://provisori.com/api/prices')
      .then((response) => response.json())
      .then((data) => setPrices(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    checkLang();
    fetchData();
  }, []);

  const handlePricePress = (url) => {
    Linking.openURL(url);
  };

  const handleImagePress = (redirectUrl) => {
    Linking.openURL(redirectUrl);
  };

  useFocusEffect(() => {
    // This function will be called when the screen gains focus
    fetchData();
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{strings.prix}</Text>
      {prices.map((price) => (
        <TouchableOpacity
          key={price.id}
          style={styles.priceContainer}
          onPress={() => handlePricePress(price.redirect_url)}
        >
          <View style={styles.priceImageContainer}>
            <TouchableOpacity
              onPress={() => handleImagePress(price.redirect_url)}
            >
              <Image
                source={{ uri: price.imgprice.url }}
                style={styles.priceImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.priceDetailsContainer}>
            {getLang === 'fr' ? (
              <>
                <Text style={styles.price}>{price.price}</Text>
                <Text style={styles.price_descriptive}>
                  {price.period_descriptive}
                </Text>
              </>
            ) : (
              <>
                {price.price_de === '' ? (
                  <>
                    <Text style={styles.price}>{price.price}</Text>
                    <Text style={styles.price_descriptive}>
                      {price.period_descriptive}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.price}>{price.price_de}</Text>
                    <Text style={styles.price_descriptive}>
                      {price.period_descriptive_de}
                    </Text>
                  </>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#46b1c81A',
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 25,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 20,
    padding: 10,
    overflow: 'hidden',
  },
  priceImageContainer: {
    width: 100,
    height: 100,
  },
  priceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  priceDetailsContainer: {
    flex: 1,
    padding: 10,
  },
  price: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  price_descriptive: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#46b1c8',
  },
});

export default PricesScreen;
