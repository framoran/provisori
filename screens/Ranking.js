import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

const ResponseScreen = () => {
  const [responses, setResponses] = useState([]);
  const [strings, setStrings] = useState(false);

  const checkLang = async () => {
    try {
      let lang = await AsyncStorage.getItem('lang');
      let selectedStrings = lang === 'de' ? strings_de : strings_fr;
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
    fetch('https://provisori.com/api/ranking')
      .then((response) => response.json())
      .then((data) => setResponses(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    checkLang();
    fetchData();
  }, []);

  useFocusEffect(() => {
    // This function will be called when the screen gains focus
    fetchData();
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>{strings.ranking}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>{strings.rank}</Text>
            <Text style={styles.tableHeader}>{strings.username}</Text>
            <Text style={styles.tableHeader}>{strings.points_maj}</Text>
          </View>
          {responses.map((response, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{response.username}</Text>
              <Text style={styles.tableCell}>{response.total}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 25,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#46b1c81A',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#46b1c81A',
    backgroundColor: '#fff',
    height: 40,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#46b1c81A',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#46b1c81A',
  },
  lastCell: {
    borderRightWidth: 0,
  },
});

export default ResponseScreen;
