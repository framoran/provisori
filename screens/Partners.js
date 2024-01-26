import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

const PartnerScreen = () => {
  const [prices, setPrices] = useState([]);
  const [strings, setStrings] = useState(false);
  const [getLang, setLang] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchData = () => {
    setIsLoading(true); // Start loading
    fetch('https://provisori.com/api/partners')
      .then((response) => response.json())
      .then((data) => {
        setPrices(data);
        setIsLoading(false); // End loading
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false); // End loading in case of error
      });
  };

  useEffect(() => {
    checkLang();
    fetchData();
  }, []);

  const handleScroll = (event) => {
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    if (y + height >= contentHeight - 20) {
      fetchData();
    }
  };

  useFocusEffect(() => {
    // This function will be called when the screen gains focus
    fetchData();
  });

  const handlePricePress = (url) => {
    Linking.openURL(url);
  };

  const handleImagePress = (redirectUrl) => {
    Linking.openURL(redirectUrl);
  };

  const { width } = Dimensions.get('window');
  const itemWidth = (width - 30) / 2;

  return (
    <ScrollView style={styles.container} onScroll={handleScroll}>
      <Text style={styles.heading}>{strings.partners}</Text>
      <View style={styles.imageRowContainer}>
        {prices.map((price) => (
          <TouchableOpacity
            key={price.id}
            style={styles.priceContainer}
            onPress={() => handlePricePress(price.redirect_url)}
          >
            <View
              style={[
                styles.priceImageContainer,
                { width: itemWidth, height: itemWidth },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleImagePress(price.redirect_url)}
              >
                <Image
                  source={{ uri: price.imgprice.url }}
                  style={styles.priceImage}
                />
              </TouchableOpacity>
              <Text style={styles.priceText}>{price.partners}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  imageRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  priceContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    marginVertical: 5,
  },
  priceImageContainer: {
    backgroundColor: '#fff',
    padding: 10,
  },
  priceImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'contain',
  },
  priceText: {
    color: '#46b1c8',
    alignSelf: 'center',
  },
});

export default PartnerScreen;
